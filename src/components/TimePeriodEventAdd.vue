<template>
<a-modal v-model:visible="visible" centered title="添加事件">

    <template #footer>



        <a-button key="submit"
                  type="primary"
                  style="
                  position: relative;width: 20%"
                  :disabled = "submitButtonDisabled"
                  @click = "submitEvent"
                  >

            <template #icon>
                <CheckOutlined/>
            </template>
        </a-button>

    </template>

    <a-form
        class="eventFormClass"
        :model="eventFormRef"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 24 }"
        autocomplete="off"
    >

        <a-form-item>
            <a-input v-model:value="eventRef.name" placeholder="事件名称"
                     size="large"
                     />
        </a-form-item>

        <a-form-item>
            <a-input v-model:value="eventRef.details" placeholder="事件描述"
                     size="large"/>
        </a-form-item>

        <a-form-item>
            <a-date-picker style="width:30%" size="large" v-model:value="eventRef.currentDate" />
            <a-time-range-picker style="width:70%"
                                 size="large"
                                 v-model:value="currentTime"/>
        </a-form-item>

        <a-form-item>
            <a-select
                show-search
                placeholder="地点"
                size="large"
                optionFilterProp="label"
                v-model:value=eventRef.locationId
                :options="locationOptions"
            ></a-select>
        </a-form-item>

        <a-form-item>
            <a-radio-group  style="display: flex;
                                    justify-content: center;
                                    margin-left:auto"
                            size="large"
                            @change="eventTypeChange"
                            v-model:value="eventRef.type"
            >

                <a-radio-button value="1" >个人</a-radio-button>
                <a-radio-button value="2" >组织</a-radio-button>
            </a-radio-group>
        </a-form-item>

        <a-form-item>
            <a-select
                show-search
                placeholder="组织"
                size="large"
                optionFilterProp="label"
                :disabled="eventRef.groupSelectDisabled"
                v-model:value=eventRef.groupId
                :options="groupOptions"
            ></a-select>
        </a-form-item>

        <a-form-item>
            <p>

            </p>
            周期&nbsp&nbsp

            <a-switch
                v-model:checked=eventRef.periodic
                >
            </a-switch>
            &nbsp&nbsp
            每
            <a-input-number
                v-model:value=eventRef.periodicInterval
                :min="1"
                :max="30"
                :disabled="!eventRef.periodic"/>
            天
            &nbsp&nbsp
            至
            <a-date-picker v-model:value=eventRef.periodEndTime
                           :disabled="!eventRef.periodic"
                           :disabled-date="periodicEventDisabledDate"/>
        </a-form-item>

    </a-form>
</a-modal>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import type {IGroup} from "@/models/IGroup";
import type{AxiosError} from "axios";
import type{IResponse} from "@/models/IResponse";
import {Request} from "@/utils/Request";
import {useUserStore} from "@/stores/UserStore";
import type {IUserGroupLink} from "@/models/IUserGroupLink";
import type {IMapPoint} from "@/models/IMapPoint";
import dayjs, {Dayjs} from "dayjs";
import {CheckOutlined} from "@ant-design/icons-vue";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc)
const request = new Request();

const visible = ref(false);

const currentDate = new Date();

defineExpose({
    visible
})

const emit = defineEmits<{
    (event:'submitEvent',
     val: {
         name:string,
         details:string,
         userId:number,
         groupId:number,
         placeId:number,
         beginDateTime:Dayjs,
         endDateTime:Dayjs,
         periodicInterval:number,
         periodicTimes:number//关于周期添加:只会提供要循环的次数和间隔


    }):void;
}>()

const eventRef = ref({
    name:'',
    details:'',
    locationId:104,//默认就在学五公寓

    type:"1",
    userId:0,
    groupId:0,
    groupSelectDisabled:true,


    currentDate:dayjs(currentDate.getFullYear()+"-"
        +(currentDate.getMonth()+1)+"-"+(currentDate.getDate())),

    startTime: dayjs('00:00:00','HH:mm:ss'),
    endTime: dayjs('01:00:00','HH:mm:ss'),

    periodic:false,
    periodicInterval:1,
    periodEndTime:dayjs(currentDate.getFullYear()+"-"
        +(currentDate.getMonth()+1)+"-"+(currentDate.getDate())).add(1,'day')

})

const eventFormRef = ref();
const currentUser = useUserStore();
const locationOptions = ref<{ value:number,label:string }[]>([]);
const groupOptions = ref<{ value:number,label:string }[]>([]);
const currentTime = ref<Dayjs[]>([]);

const submitButtonDisabled = computed(()=>{
//天啊，粪啊，不想改啊
    if(eventRef.value.name!=='' && eventRef.value.details!==''){
        if(!eventRef.value.periodic || (eventRef.value.periodic
            && eventRef.value.periodicInterval!=undefined)){
            if(eventRef.value.type==='2'){
                return eventRef.value.groupId === 0;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
})


const periodicEventDisabledDate = (day:Dayjs)=>{
    // Can not select days before today and today

    return day &&  day < dayjs(eventRef.value.currentDate).endOf('day');
}

onMounted(async()=>{
    await currentUser.updateUserInformation();


    //加载用户组织列表

    if(currentUser.user!==undefined){


        try {

            const linkResponse =  await request.get<IUserGroupLink[]>(`/postcalendarapi/groupLink/user/${currentUser.user.id}`);

            for(let link of linkResponse.data){

                const groupResponse =  await request.get<IGroup>(`/postcalendarapi/group/${link.groupId}`);

                const option  = { value: groupResponse.data.id, label: groupResponse.data.name };
                groupOptions.value.push(option)
            }


        }catch (err){
            const axiosError = err as AxiosError<IResponse<IUserGroupLink[]>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

            }
        }
    }

    //加载地点列表
    locationOptions.value.push({ value: 0, label: '网络空间' })

    try {

        const locationResponse =  await request.get<IMapPoint[]>(`/postcalendarapi/place/`);

        for(let location of locationResponse.data){
            if(location.placeType==1){//只有建筑物会加入地点列表
                const option  = { value: location.id, label: location.name };
                locationOptions.value.push(option)
            }
        }


    }catch (err){
        const axiosError = err as AxiosError<IResponse<IMapPoint[]>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {

        }
    }


    /*eventRef.value.currentDate = dayjs(props.startTime.split('T')[0])
    eventRef.value.startTime = dayjs(props.startTime.split('T')[1].split('Z')[0],"HH:mm:ss")
    eventRef.value.endTime = dayjs(props.endTime.split('T')[1].split('Z')[0],"HH:mm:ss")*/
    currentTime.value.push(eventRef.value.startTime)
    currentTime.value.push(eventRef.value.endTime)
})


function eventTypeChange(){
    eventRef.value.groupSelectDisabled = eventRef.value.type != '2';
}


function submitEvent(){
    //进行事件的添加

    const submitStartTime = eventRef.value.currentDate
        .add(currentTime.value[0].hour(),'hour')
        .add(currentTime.value[0].minute(),'minute')
        .add(currentTime.value[0].second(),'second')

    const submitEndTime = eventRef.value.currentDate
        .add(currentTime.value[1].hour(),'hour')
        .add(currentTime.value[1].minute(),'minute')
        .add(currentTime.value[1].second(),'second')

    if(currentUser.user!==undefined){

        if(eventRef.value.type=='1'){
            eventRef.value.groupId = 0;
            eventRef.value.userId = currentUser.user.id
        }
        else {
            eventRef.value.userId = 0;
        }
    }

    //关于周期添加:只会提供要循环的次数和间隔 不是周期时，两者均为0
    const periodicIntervalNum:number = eventRef.value.periodic?eventRef.value.periodicInterval:0;

    const periodicTimes = () =>{
        const interval = eventRef.value.periodEndTime.diff(eventRef.value.currentDate,'day');
        //获取周期截止日期和当前事件开始日期的间隔时间(天)

        if(!eventRef.value.periodic){
            return 0;
        }
        else{
            return Math.floor(interval/periodicIntervalNum)+1;
        }

    }



    const emitval={
        name:eventRef.value.name,
        details:eventRef.value.details,
        userId:eventRef.value.userId,
        groupId:eventRef.value.groupId,
        placeId:eventRef.value.locationId,
        beginDateTime:submitStartTime,
        endDateTime:submitEndTime,
        periodicInterval:periodicIntervalNum,
        periodicTimes:periodicTimes()
    }


    emit('submitEvent',emitval);

    visible.value = false
    //console.log(submitStartTime,submitStartTime.utc(true).format('YYYY-MM-DDTHH:mm:ss[Z]'))



}
</script>

<style scoped>
.eventFormClass{
    position: relative;

}
</style>
