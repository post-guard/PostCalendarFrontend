<template>
    <TimePointEventSearch ref="eventSearchPopover"
                          @searchEvent="searchEvent">
    </TimePointEventSearch>
<div class="ddlZoneDiv">

      <TimePointEventAdd ref="eventAddModel"
                        @submitEvent="addEvent">
      </TimePointEventAdd>



      <a-list class="ddlList"
              item-layout="horizontal"
          :data-source  = ddlList
          :pagination="false"
          size="large"
          :grid="{ gutter: 20, column: 1 }"
  >
      <template #renderItem="{ item }">
          <a-list-item>
              <CalendarDDLCard :ref = "setDDLCardRef"
                               :id = item.id
                               :event-name = item.name
                               :details = item.details
                               :user-id = item.userId
                               :group-id = item.groupId
                               :location-id = item.placeId
                               :end-time = item.endDateTime
                               :type = item.type
                               @submitEvent = "changeEvent"
                               @deleteEvent = "deleteEvent">

              </CalendarDDLCard>
          </a-list-item>
      </template>

    </a-list>

    <a-button size="large"
              shape="circle"
              style="position: absolute;
                     left: 105%;
                     top:80%"
              @click="()=>{eventAddModel.visible = true}">
        <template #icon style="color: blue">
            <PlusOutlined />
        </template>
    </a-button>


<!--    <a-button size="large"
              shape="circle"
              style="position: absolute;
                     left: 110%;
                     top:72%"
              >
        <template #icon style="color: blue">
            <SearchOutlined />
        </template>
    </a-button>-->

</div>
</template>

<script setup lang="ts">
import {onBeforeUpdate, onMounted, ref} from "vue";
import CalendarDDLCard from "@/components/CalendarDDLCard.vue";
import type {CalendarTimePoint} from "@/models/CalendarTimePoint";
import {message} from "ant-design-vue";
import {Request} from "@/utils/Request";
import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import {useUserStore} from "@/stores/UserStore";
import dayjs, {Dayjs} from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {PlusOutlined} from "@ant-design/icons-vue";
import TimePointEventAdd from "@/components/TimePointEventAdd.vue";
import TimePointEventSearch from "@/components/TimePointEventSearch.vue";


dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('zh-cn')

const request = new Request();

const currentUser = useUserStore();

const currentTime = new Date();

const calendarPeriod = ref<Dayjs>(
    dayjs(currentTime.getFullYear()
        +"-"+(currentTime.getMonth()+1)
        +"-"+currentTime.getDate())
);

let ddlList = ref<CalendarTimePoint[]>([]);

let ddlListRef = ref<CalendarDDLCard[]>([]);

const eventAddModel = ref();

onBeforeUpdate(async() => {
    ddlListRef.value = [];
})

onMounted(async ()=>{
    await currentUser.updateUserInformation();


    if(currentUser.user!==undefined){//默认读取以当前时间的前后三个月作为时间范围
        try {

            const response =  await request.get<CalendarTimePoint[]>
            (`/postcalendarapi/timePointEvent/user/${currentUser.user.id}?begin=${calendarPeriod.value.subtract(3,'month').unix()}&end=${calendarPeriod.value.add(3,'month').unix()}`);

            message.success("获取DDL日程成功");
            for(let ddlAlready of response.data){
                const ddl : CalendarTimePoint = {
                    id: ddlAlready.id,
                    name : ddlAlready.name,
                    details: ddlAlready.details,
                    userId: ddlAlready.userId,
                    groupId: ddlAlready.groupId,
                    placeId: ddlAlready.placeId,
                    endDateTime: ddlAlready.endDateTime,
                    type: ddlAlready.type
                }


                ddlList.value.push(ddl);
            }

        }catch (err){
            const axiosError = err as AxiosError<IResponse<CalendarTimePoint[]>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                let errorMessage = "获取DDL日程失败";
                message.error(errorMessage);
            }
        }
    }

})


function setDDLCardRef(el: CalendarDDLCard|undefined){
    if (el) {

        ddlListRef.value.push(el)

    }
}


async function changeEvent(val:{
    id:number,
    name:string,
    details:string,
    userId:number,
    groupId:number,
    placeId:number,
    endDateTime:Dayjs,
    type:number
}){
    console.log(val);
    console.log(val.endDateTime.utc(true).format('YYYY-MM-DDTHH:mm:ss[Z]'))
    if(val.userId==0){//组织事件修改

        try {

            const response =  await request.put<CalendarTimePoint>
            (`/postcalendarapi/timePointEvent/group/${val.groupId}`,{
                id:val.id,
                name:val.name,
                details:val.details,
                userId:val.userId,
                groupId:val.groupId,
                placeId:val.placeId,
                endDateTime:val.endDateTime.utc(true).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                type:val.type
            });


            message.success("修改组织DDL事件成功");

            await ddlListReLoad();

        }catch (err){
            const axiosError = err as AxiosError<IResponse<CalendarTimePoint>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                let errorMessage = "修改组织DDL事件失败";
                message.error(errorMessage);
            }
        }

    }
    else{//个人事件修改
        if(currentUser.user!==undefined){
            try {

                const response =  await request.put<CalendarTimePoint>
                (`/postcalendarapi/timePointEvent/user/${currentUser.user.id}`,{
                    id:val.id,
                    name:val.name,
                    details:val.details,
                    userId:val.userId,
                    groupId:val.groupId,
                    placeId:val.placeId,
                    endDateTime:val.endDateTime.utc(true).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                    type:val.type
                });


                message.success("修改个人DDL事件成功");

                await ddlListReLoad();

            }catch (err){
                const axiosError = err as AxiosError<IResponse<CalendarTimePoint>>;
                if (axiosError.response?.status != undefined &&
                    axiosError.response.status >= 400 && axiosError.response.status < 500) {

                    let errorMessage = "修改个人DDL事件失败";
                    message.error(errorMessage);
                }
            }
        }
    }
}



async function deleteEvent(val:{
    id:number,
    name:string,
    details:string,
    userId:number,
    groupId:number,
    placeId:number,
    endDateTime:string,
    type:number
}){
    if(val.userId==0){//删除组织事件

        try {

            const response =  await request.deleteWithBody<CalendarTimePoint>
            (`/postcalendarapi/timePointEvent/group/${val.groupId}`,{
                id:val.id,
                name:val.name,
                details:val.details,
                userId:val.userId,
                groupId:val.groupId,
                placeId:val.placeId,
                endDateTime:val.endDateTime,
                type:val.type
            });


            message.success("删除组织DDL事件成功");

            await ddlListReLoad();

        }catch (err){
            const axiosError = err as AxiosError<IResponse<CalendarTimePoint>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {
                let errorMessage = "删除组织DDL事件失败";
                message.error(errorMessage);
            }
        }

    }
    else{//删除个人事件
        if(currentUser.user!==undefined){
            try {

                const response =  await request.deleteWithBody<CalendarTimePoint>
                (`/postcalendarapi/timePointEvent/user/${currentUser.user.id}`,{
                    id:val.id,
                    name:val.name,
                    details:val.details,
                    userId:val.userId,
                    groupId:val.groupId,
                    placeId:val.placeId,
                    endDateTime:val.endDateTime,
                    type:val.type
                });


                message.success("删除个人DDL事件成功");

                await ddlListReLoad();

            }catch (err){
                const axiosError = err as AxiosError<IResponse<CalendarTimePoint>>;
                if (axiosError.response?.status != undefined &&
                    axiosError.response.status >= 400 && axiosError.response.status < 500) {
                    console.log(axiosError.response.data)
                    let errorMessage = "删除个人DDL事件失败";
                    message.error(errorMessage);
                }
            }
        }
    }
}


async function ddlListReLoad(){

        ddlList.value = [];
        ddlListRef.value = [];


        if(currentUser.user!==undefined){
            try {

                const response =  await request.get<CalendarTimePoint[]>
                (`/postcalendarapi/timePointEvent/user/${currentUser.user.id}?begin=${calendarPeriod.value.subtract(3,'month').unix()}&end=${calendarPeriod.value.add(3,'month').unix()}`);

                message.success("获取DDL日程成功");
                for(let ddlAlready of response.data){
                    const ddl : CalendarTimePoint = {
                        id: ddlAlready.id,
                        name : ddlAlready.name,
                        details: ddlAlready.details,
                        userId: ddlAlready.userId,
                        groupId: ddlAlready.groupId,
                        placeId: ddlAlready.placeId,
                        endDateTime: ddlAlready.endDateTime,
                        type:ddlAlready.type
                    }

                    ddlList.value.push(ddl);
                }

            }catch (err){
                const axiosError = err as AxiosError<IResponse<CalendarTimePoint[]>>;
                if (axiosError.response?.status != undefined &&
                    axiosError.response.status >= 400 && axiosError.response.status < 500) {

                    let errorMessage = "获取DDL日程失败";
                    message.error(errorMessage);
                }
            }
        }
}


async function addEvent(val:{
    name:string,
    details:string,
    userId:number,
    groupId:number,
    placeId:number,
    endDateTime:Dayjs,
    type:number
}){
    if(val.userId==0){//组织事件添加

            try {

                const response =  await request.post<CalendarTimePoint>
                (`/postcalendarapi/timePointEvent/group/${val.groupId}`,{

                    name:val.name,
                    details:val.details,
                    userId:val.userId,
                    groupId:val.groupId,
                    placeId:val.placeId,
                    endDateTime:val.endDateTime.utc(true).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                    type:val.type
                });


                message.success("添加组织DDL事件成功");

                await ddlListReLoad();

            }catch (err){
                const axiosError = err as AxiosError<IResponse<CalendarTimePoint>>;
                if (axiosError.response?.status != undefined &&
                    axiosError.response.status >= 400 && axiosError.response.status < 500) {

                    let errorMessage = "添加组织DDL事件失败";
                    message.error(errorMessage);
                }
            }
    }
    else{//个人事件添加
        if(currentUser.user!==undefined){

                try {

                    const response = await request.post<CalendarTimePoint>
                    (`/postcalendarapi/timePointEvent/user/${currentUser.user.id}`, {

                        name: val.name,
                        details: val.details,
                        userId: val.userId,
                        groupId: val.groupId,
                        placeId: val.placeId,
                        endDateTime: val.endDateTime.utc(true).format('YYYY-MM-DDTHH:mm:ss[Z]'),
                        type:val.type
                    });


                    message.success("添加个人DDL事件成功");

                    await ddlListReLoad();

                } catch (err) {
                    const axiosError = err as AxiosError<IResponse<CalendarTimePoint>>;
                    if (axiosError.response?.status != undefined &&
                        axiosError.response.status >= 400 && axiosError.response.status < 500) {

                        let errorMessage = "添加个人DDL事件失败";
                        message.error(errorMessage);
                    }
                }
            }
    }
}


async function searchEvent(val:{
    name:string|undefined,
    groupId:number[]|undefined,
    placeId:number[]|undefined,
    startDateTime:Dayjs|undefined,
    endDateTime:Dayjs|undefined,
    type:number[]|undefined
}){
    ddlList.value = [];
    ddlListRef.value = [];
    console.log(val)
    if(currentUser.user!==undefined){
        try {

            let timeList:IResponse<CalendarTimePoint[]>= {
                message: '',
                data: []
            };
                if(val.startDateTime!=undefined && val.endDateTime!=undefined){
                    timeList =  await request.get<CalendarTimePoint[]>
                    (`/postcalendarapi/timePointEvent/user/${currentUser.user.id}?begin=${val.startDateTime.unix()}&end=${val.endDateTime.unix()}`);
                }
                else{
                    timeList = await request.get<CalendarTimePoint[]>
                    (`/postcalendarapi/timePointEvent/user/${currentUser.user.id}?begin=${calendarPeriod.value.subtract(3,'month').unix()}&end=${calendarPeriod.value.add(3,'month').unix()}`);
                }


                const groupList:CalendarTimePoint[]=[];
                const placeList:CalendarTimePoint[]=[];
                const typeList:CalendarTimePoint[]=[];
                const nameList:CalendarTimePoint[]=[];
                const nameCopyList:CalendarTimePoint[]=[];


            for(let ddlAlready of timeList.data){
                const ddl : CalendarTimePoint = {
                    id: ddlAlready.id,
                    name : ddlAlready.name,
                    details: ddlAlready.details,
                    userId: ddlAlready.userId,
                    groupId: ddlAlready.groupId,
                    placeId: ddlAlready.placeId,
                    endDateTime: ddlAlready.endDateTime,
                    type:ddlAlready.type
                }

                nameCopyList.push(ddl);

                if(val.groupId!=undefined && val.groupId.length!=0){
                    if(val.groupId.includes(ddl.groupId)){
                        groupList.push(ddl);
                    }
                }
                else{
                    groupList.push(ddl);
                }

                if(val.placeId!=undefined && val.placeId.length!=0){
                    if(val.placeId.includes(ddl.placeId)){
                        placeList.push(ddl);
                    }
                }
                else{
                    placeList.push(ddl);
                }

                if(val.type!=undefined && val.type.length!=0){
                    if(val.type.includes(ddl.type)){
                        typeList.push(ddl);
                    }
                }
                else{
                    typeList.push(ddl);
                }
            }
            /*此时，有三个列表，里面分别是满足时间要求且分别满足组织、地点、类型要求的事件
            如果组织、地点、类型用户没有输入（就是undefined）,那么这个列表里就是满足时间要求的全部事件
             */
            let nameResponse;
            if(val.name!=undefined && val.name!=''){
                nameResponse =  await request.post<CalendarTimePoint[]>
                (`/postcalendarapi/searchTimePointEvent/${currentUser.user.id}`,
                    {
                        prefix: val.name
                    });
            }
            else{
                nameResponse = timeList;
            }
            //解决js的对象相同问题,写法粪但是管用
            for(let ddlAlready of nameResponse.data) {
                for(let ddlCopy of nameCopyList){
                    if(ddlAlready.id == ddlCopy.id){
                        nameList.push(ddlCopy);
                    }
                }
            }


            //接下来进行四个列表的取交集操作
            let searchResultList = placeList.filter((ddl)=>{
                return typeList.includes(ddl);
            })

            searchResultList = searchResultList.filter((ddl)=>{
                return groupList.includes(ddl);
            })

            searchResultList = searchResultList.filter((ddl)=>{
                return nameList.includes(ddl);
            })
            console.log(searchResultList);
            for(let searchResult of searchResultList){
                ddlList.value.push(searchResult);
            }



        }catch (err){
            const axiosError = err as AxiosError<IResponse<CalendarTimePoint[]>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                let errorMessage = "查询DDL日程失败";
                message.error(errorMessage);
            }
        }
    }
}
</script>

<style scoped>
.ddlZoneDiv{
    position: relative;
    top:10%;
    left:20%;
    width: 60%;
    height: 95%;
}

.ddlList{
    position: absolute;
    top:0;
    height: inherit;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}

::-webkit-scrollbar{
    width: 0;
}

</style>
