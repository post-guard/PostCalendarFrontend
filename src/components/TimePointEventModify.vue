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
            <a-date-picker style="width:45%"
                           size="large"
                           :show-time="{ format: 'HH:mm:ss' }"
                           v-model:value="eventRef.currentTime" />

            <a-select
                size="large"
                v-model:value="eventRef.type"
                style="position:absolute;width: 45% ; right: 0"
                :options="eventRef.typeOptions"
            ></a-select>

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
    endTime: string,
    type:number
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

const eventRef = ref({
    name:props.name,
    details:props.details,
    locationId:props.locationId,

    userOrGroup:"1",
    userId:props.userId,
    groupId:props.groupId,
    buttonValue:'',

    currentTime:dayjs('1970-01-01T00:00:00Z'),


    type:props.type,
    typeOptions:[
        {
            value: 0,
            label: "购物"
        },
        {
            value: 1,
            label: "洗澡"
        },
        {
            value: 2,
            label: "取外卖"
        },
        {
            value: 3,
            label: "取快递"
        },
        {
            value: 4,
            label: "寄快递"
        },
        {
            value: 5,
            label: "外出"
        },
        {
            value: 6,
            label: "送物品"
        },
        {
            value: 7,
            label: "拿物品"
        },
        {
            value: 8,
            label: "运动"
        },
        {
            value: 9,
            label: "完成作业"
        },
        {
            value: 10,
            label: "其它"
        },
    ]
})

const eventFormRef = ref();
const currentUser = useUserStore();
const locationOptions = ref<{ value:number,label:string }[]>([]);


const submitButtonDisabled = computed(()=>{

    return !(eventRef.value.name !== '' && eventRef.value.details !== '');
})

onMounted(async()=>{
    await currentUser.updateUserInformation();
    //初始化工作
    if(props.userId==0){//有组织
        eventRef.value.userOrGroup = "2";

        if(currentUser.user!==undefined){


            try {//加载用户组织列表

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
        eventRef.value.userOrGroup = "1";
        eventRef.value.buttonValue = "个人事件"
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

    eventRef.value.currentTime = dayjs(props.endTime);

})




function submitEvent(){
    //进行事件的修改

    const emitval={
        id:props.id,
        name:eventRef.value.name,
        details:eventRef.value.details,
        userId:eventRef.value.userId,
        groupId:eventRef.value.groupId,
        placeId:eventRef.value.locationId,
        endDateTime:eventRef.value.currentTime,
        type:eventRef.value.type
    }


    emit('submitEvent',emitval);

    visible.value = false

}



function deleteEvent(){
    const emitval={
        id:props.id,
        name:props.name,
        details:props.details,
        userId:props.userId,
        groupId:props.groupId,
        placeId:props.locationId,
        endDateTime:props.endTime,
        type:props.type
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
