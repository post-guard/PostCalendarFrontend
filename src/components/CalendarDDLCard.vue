<template>
<div class="DDLCardDiv">
    <TimePointEventModify ref="eventModel"
                          :id=props.id
                          :location-id=props.locationId
                          :group-id=props.groupId
                          :name=props.eventName
                          :details=props.details
                          :end-time=props.endTime
                          :type=props.type
                          :user-id=props.userId
                          @submitEvent = "submitEvent"
                          @deleteEvent = "deleteEvent">

    </TimePointEventModify>
    <a-card class = "DDLCard"
            :title="props.eventName" @click="eventModel.visible = true">

        <InfoCircleOutlined style="color: cornflowerblue"/>
        {{props.details}}

        <p></p>
        <p></p>
        <ClockCircleOutlined style="color: #db9065"/>
        {{dayjs.tz(props.endTime).format('YYYY-MM-DD  HH:mm:ss')}}

        &nbsp;&nbsp;&nbsp;&nbsp;
        <EnvironmentOutlined style="color: #6afff5"/>
        {{ddlLocation}}

        &nbsp;&nbsp;&nbsp;&nbsp;
        <DatabaseOutlined style="color: #ea2323"/>
        {{typeList[props.type]}}

        &nbsp;&nbsp;&nbsp;&nbsp;
        <UserOutlined style="color: #48614d"/>
        {{ddlGroup}}
        <div class="ddlMask" ref="ddlMask">

        </div>

    </a-card>

</div>
</template>

<script setup lang="ts">
import {InfoCircleOutlined,ClockCircleOutlined,DatabaseOutlined,EnvironmentOutlined,UserOutlined} from "@ant-design/icons-vue";
import dayjs, {Dayjs} from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {onMounted, onUnmounted, ref} from "vue";
import type {IMapPoint} from "@/models/IMapPoint";
import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import {Request} from "@/utils/Request";
import type {IGroup} from "@/models/IGroup";
import TimePointEventModify from "@/components/TimePointEventModify.vue";



dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('zh-cn')

const request = new Request();

const props = defineProps<{
    id:number,
    endTime: string,
    details:string,
    eventName: string,
    locationId: number,
    userId: number,
    groupId: number,
    type:number
}>()

const emit = defineEmits<{
    (event:'submitEvent',
     val: {
         id:number,
         name:string,
         details:string,
         userId:number,
         groupId:number,
         placeId:number,
         endDateTime:Dayjs,
         type:number
     }):void;

    (event:'deleteEvent',
     val: {
         id:number,
         name:string,
         details:string,
         userId:number,
         groupId:number,
         placeId:number,
         endDateTime:string,
         type:number

     }):void;
}>()


const typeList:string[] = [
    "购物",
    "洗澡",
    "取外卖",
    "取快递",
    "寄快递",
    "外出",
    "送物品",
    "拿物品",
    "运动",
    "完成作业",
    "其它"
]

const ddlLocation = ref("未标明地点")
const ddlGroup = ref()

const eventModel = ref()
const ddlMask = ref<HTMLElement>();

onMounted(async ()=>{


    try {

        if(props.locationId==0){
            ddlLocation.value = "网络空间";
        }
        else{
            const response =  await request.get<IMapPoint>(`/postcalendarapi/place/${props.locationId}`);
            ddlLocation.value = response.data.name;
        }


    }catch (err){
        const axiosError = err as AxiosError<IResponse<IMapPoint>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {

            //let errorMessage = "获取时间段日程失败";
            //message.error(errorMessage);
        }
    }

    if(props.userId==0){//组织事件
        try {

                const response =  await request.get<IGroup>(`/postcalendarapi/group/${props.groupId}`);
                ddlGroup.value = "组织【"+response.data.name+"】事件";


        }catch (err){
            const axiosError = err as AxiosError<IResponse<IGroup>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                //let errorMessage = "获取时间段日程失败";
                //message.error(errorMessage);
            }
        }
    }
    else {//个人事件
        ddlGroup.value = "个人"
    }

    window.addEventListener('onmessageWS', getCurrentTimeDDL);

})


onUnmounted(()=>{
    window.removeEventListener('onmessageWS', getCurrentTimeDDL);
})

function getCurrentTimeDDL(event:any){
    const data = event && event.detail.data
    const type = event && event.detail.type

    if(type=='clock')
    {
        if(dayjs(data).isAfter(dayjs.tz(props.endTime))){
            if(ddlMask.value!=undefined){
                ddlMask.value.style.opacity = '0.5';
            }

        }
        else{
            if(ddlMask.value!=undefined){
                ddlMask.value.style.opacity = '0';
            }
        }
    }
}
function submitEvent(val:{
    id:number,
    name:string,
    details:string,
    userId:number,
    groupId:number,
    placeId:number,
    endDateTime:Dayjs,
    type:number
}){
    emit('submitEvent',val);
}


function deleteEvent(val:{
    id:number,
    name:string,
    details:string,
    userId:number,
    groupId:number,
    placeId:number,
    endDateTime:string,
    type:number
}){
    emit('deleteEvent',val);
}
</script>

<style scoped>
.DDLCardDiv{
    position: relative;
    width: 100%;
    height: 100%;
}
.DDLCard{
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
}
.ddlMask{
    pointer-events:none;
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
    border-radius: 8px;
    opacity: 0;
    background-color: black;
    z-index: 5;
}
</style>
