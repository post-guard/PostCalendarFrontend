<template>
    <a-modal v-model:visible="visible" centered title="添加DDL事件">

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
                <a-radio-group  style="display: flex;
                                    justify-content: center;
                                    margin-left:auto"
                                size="large"
                                @change="eventGroupChange"
                                v-model:value="eventRef.userOrGroup"
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
         endDateTime:Dayjs,
         type:number

     }):void;
}>()

const eventRef = ref({
    name:'',
    details:'',
    locationId:104,//默认就在学五公寓

    userOrGroup:"1",
    userId:0,
    groupId:0,
    groupSelectDisabled:true,

    currentTime:dayjs().add(1,'hour'),

    type:0,
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
const groupOptions = ref<{ value:number,label:string }[]>([]);


const submitButtonDisabled = computed(()=>{
//天啊，粪啊，不想改啊
    if(eventRef.value.name!=='' && eventRef.value.details!==''){

            if(eventRef.value.userOrGroup==='2'){
                return eventRef.value.groupId === 0;
            }
            else {
                return false;
            }
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

})


function eventGroupChange(){
    eventRef.value.groupSelectDisabled = eventRef.value.userOrGroup != '2';
}


function submitEvent(){
    //进行事件的添加


    if(currentUser.user!==undefined){

        if(eventRef.value.userOrGroup=='1'){
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
        endDateTime:eventRef.value.currentTime,
        type:eventRef.value.type

    }

    emit('submitEvent',emitval);

    visible.value = false

}
</script>

<style scoped>
.eventFormClass{
    position: relative;

}
</style>
