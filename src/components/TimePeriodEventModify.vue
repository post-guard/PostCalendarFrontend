<template>
<a-modal v-model:visible="visible" centered title="事件明细">

    <template #footer>

        <a-button key="delete"
                  danger
                  type="primary"
                  style="
                  position: absolute;
                  left: 16px;width: 20%"
                  @click = "deleteEvent"
        >

            <template #icon>
                <DeleteOutlined/>
            </template>
        </a-button>

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
            <a-button size="large" style="display: flex;
                                            justify-content: center;
                                            margin-left:auto;
                                            margin-right:auto"

            >
                {{eventRef.buttonValue}}
            </a-button>
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
import type {IMapPoint} from "@/models/IMapPoint";
import dayjs, {Dayjs} from "dayjs";
import {DeleteOutlined,CheckOutlined} from "@ant-design/icons-vue";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc)
const request = new Request();

const visible = ref(false);

const props = defineProps<{
    id:number,
    name:string,
    details:string,
    locationId:number,
    userId:number,
    groupId:number,
    startTime: string,
    endTime: string
}>();

defineExpose({
    visible
})

const emit = defineEmits<{
    (event:'submitEvent',
     val: {
        id:number,
         name:string,
         details:string,
         userId:number,
         groupId:number,
         placeId:number,
         beginDateTime:Dayjs,
         endDateTime:Dayjs
    }):void;

    (event:'deleteEvent',
     val: {
         id:number,
         name:string,
         details:string,
         userId:number,
         groupId:number,
         placeId:number,
         beginDateTime:string,
         endDateTime:string
     }):void;
}>()

const eventRef = ref({
    name:props.name,
    details:props.details,
    locationId:props.locationId,

    type:"1",
    userId:props.userId,
    groupId:props.groupId,
    buttonValue:'',

    currentDate:dayjs('1970-01-01'),

    startTime: dayjs('00:00:00'),
    endTime: dayjs('00:00:00')


})

const eventFormRef = ref();
const currentUser = useUserStore();
const locationOptions = ref<{ value:number,label:string }[]>([]);
const currentTime = ref<Dayjs[]>([]);

const submitButtonDisabled = computed(()=>{

    return !(eventRef.value.name !== '' && eventRef.value.details !== '');
})

onMounted(async()=>{
    await currentUser.updateUserInformation();
    //初始化工作
    if(props.userId==0){//有组织
        eventRef.value.type = "2";

        if(currentUser.user!==undefined){


            try {

                const groupResponse =  await request.get<IGroup>(`/postcalendarapi/group/${eventRef.value.groupId}`);

                eventRef.value.buttonValue = "集体事件 : 组织【"+groupResponse.data.name+"】"


            }catch (err){
                const axiosError = err as AxiosError<IResponse<IGroup>>;
                if (axiosError.response?.status != undefined &&
                    axiosError.response.status >= 400 && axiosError.response.status < 500) {
                    eventRef.value.buttonValue = '未知组织'
                }
            }
        }
    }
    else{//无组织
        eventRef.value.type = "1";
        eventRef.value.buttonValue = "个人事件"
    }

    //加载用户组织列表



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


    }catch (err){//TODO:待更改为新方法
        const axiosError = err as AxiosError<IResponse<IMapPoint[]>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {

        }
    }


    eventRef.value.currentDate = dayjs(props.startTime.split('T')[0])
    eventRef.value.startTime = dayjs(props.startTime.split('T')[1].split('Z')[0],"HH:mm:ss")
    eventRef.value.endTime = dayjs(props.endTime.split('T')[1].split('Z')[0],"HH:mm:ss")
    currentTime.value.push(eventRef.value.startTime)
    currentTime.value.push(eventRef.value.endTime)
})




function submitEvent(){
    //进行事件的修改

    const submitStartTime = eventRef.value.currentDate
        .add(currentTime.value[0].hour(),'hour')
        .add(currentTime.value[0].minute(),'minute')
        .add(currentTime.value[0].second(),'second')

    const submitEndTime = eventRef.value.currentDate
        .add(currentTime.value[1].hour(),'hour')
        .add(currentTime.value[1].minute(),'minute')
        .add(currentTime.value[1].second(),'second')



    const emitval={
        id:props.id,
        name:eventRef.value.name,
        details:eventRef.value.details,
        userId:eventRef.value.userId,
        groupId:eventRef.value.groupId,
        placeId:eventRef.value.locationId,
        beginDateTime:submitStartTime,
        endDateTime:submitEndTime
    }


    emit('submitEvent',emitval);

    visible.value = false
    //console.log(submitStartTime,submitStartTime.utc(true).format('YYYY-MM-DDTHH:mm:ss[Z]'))



}



function deleteEvent(){
    const emitval={
        id:props.id,
        name:props.name,
        details:props.details,
        userId:props.userId,
        groupId:props.groupId,
        placeId:props.locationId,
        beginDateTime:props.startTime,
        endDateTime:props.endTime
    }


    emit('deleteEvent',emitval);

    visible.value = false
}
</script>

<style scoped>
.eventFormClass{
    position: relative;

}
</style>
