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
         endDateTime:Dayjs
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
    endTime: dayjs('01:00:00','HH:mm:ss')


})

const eventFormRef = ref();
const currentUser = useUserStore();
const locationOptions = ref<{ value:number,label:string }[]>([]);
const groupOptions = ref<{ value:number,label:string }[]>([]);
const currentTime = ref<Dayjs[]>([]);

const submitButtonDisabled = computed(()=>{

    if(eventRef.value.name!=='' && eventRef.value.details!=='' && eventRef.value.locationId!==0){
        if(eventRef.value.type==='2'){
            return eventRef.value.groupId === 0;
        }
        else return false;
    }
    else {
        return true;
    }
})

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


    const emitval={
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
</script>

<style scoped>
.eventFormClass{
    position: relative;

}
</style>
