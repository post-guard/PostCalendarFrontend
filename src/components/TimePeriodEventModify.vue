<template>
<a-modal v-model:visible="visible" centered title="事件明细">

    <template #footer>

        <a-button key="delete"
                  danger
                  type="primary"
                  style="
                  position: absolute;
                  left: 16px;width: 20%">

            <template #icon>
                <DeleteOutlined/>
            </template>
        </a-button>

        <a-button key="submit"
                  type="primary"
                  style="
                  position: relative;width: 20%"
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
                            v-model:value="eventRef.type">

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

import {onMounted, ref} from "vue";
import type {IGroup} from "@/models/IGroup";
import type{AxiosError} from "axios";
import type{IResponse} from "@/models/IResponse";
import {Request} from "@/utils/Request";
import {useUserStore} from "@/stores/UserStore";
import type {IUserGroupLink} from "@/models/IUserGroupLink";
import type {IMapPoint} from "@/models/IMapPoint";
import dayjs, {Dayjs} from "dayjs";
import {DeleteOutlined,CheckOutlined} from "@ant-design/icons-vue";

const request = new Request();

const visible = ref(false);
const props = defineProps<{
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

const eventRef = ref({
    name:props.name,
    details:props.details,
    locationId:props.locationId,

    type:"1",
    userId:props.userId,
    groupId:props.groupId,
    groupSelectDisabled:false,


    currentDate:dayjs('1970-01-01'),

    startTime: dayjs('00:00:00'),
    endTime: dayjs('00:00:00')


})

const eventFormRef = ref();
const currentUser = useUserStore();
const locationOptions = ref<{ value:number,label:string }[]>([]);
const groupOptions = ref<{ value:number,label:string }[]>([]);
const currentTime = ref<Dayjs[]>([]);

onMounted(async()=>{
    await currentUser.updateUserInformation();
    //初始化工作
    if(props.userId==0){//有组织
        eventRef.value.groupSelectDisabled = false;
        eventRef.value.type = "2";
    }
    else{//无组织
        eventRef.value.groupSelectDisabled = true;
        eventRef.value.type = "1";
    }

    //加载用户组织列表

    if(currentUser.user!==undefined){


        try {

            const linkResponse =  await request.get<IUserGroupLink[]>(`/postcalendarapi/groupLink/user/${currentUser.user.id}`);

            for(let link of linkResponse.data){

                const groupResponse =  await request.get<IGroup>(`/postcalendarapi/group/${link.groupId}`);

                const option  = { value: groupResponse.data.id, label: groupResponse.data.name };
                groupOptions.value.push(option)
            }


        }catch (err){//TODO:待更改为新方法
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


function eventTypeChange(){
    if(eventRef.value.type=='2'){
        eventRef.value.groupSelectDisabled = false;
    }
    else{
        eventRef.value.groupSelectDisabled = true;
    }
}

</script>

<style scoped>
.eventFormClass{
    position: relative;

}
</style>
