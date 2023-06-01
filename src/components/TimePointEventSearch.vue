<template>
    <div class="searchBarDiv">
            <a-form
                class="eventFormClass"
                autocomplete="off"
                layout="inline"
            >

                <a-form-item style="width: 20%">
                    <a-input v-model:value="eventRef.name" placeholder="事件名称"
                             size="large"

                    />
                </a-form-item>


                <a-form-item style="width: 15%">

                        <a-select
                            size="large"
                            placeholder="事件类型"
                            mode="multiple"
                            :max-tag-count = 1
                            :maxTagTextLength = 4
                            v-model:value="eventRef.type"
                            :options="eventRef.typeOptions"

                        ></a-select>

                </a-form-item>

                <a-form-item style="width: 15%">
                    <a-select
                        show-search
                        placeholder="事件地点"
                        size="large"
                        mode="multiple"
                        optionFilterProp="label"
                        :max-tag-count = 1
                        :maxTagTextLength = 4
                        v-model:value=eventRef.locationId
                        :options="locationOptions"

                    ></a-select>
                </a-form-item>

                <a-form-item style="width: 15%">
                    <a-select
                        show-search
                        placeholder="事件组织"
                        size="large"
                        mode="multiple"
                        optionFilterProp="label"
                        :max-tag-count = 1
                        :maxTagTextLength = 4
                        v-model:value=eventRef.groupId
                        :options="groupOptions"
                    ></a-select>
                </a-form-item>

                <a-form-item style="width: 28%">
                    <a-range-picker
                        :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD HH:mm:ss"
                        :placeholder="['起始时间段', '终止时间段']"
                        v-model:value=searchTimePeriod
                        size="large"
                    />
                </a-form-item>
            </a-form>
    </div>
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
import utc from "dayjs/plugin/utc";
import {SearchOutlined} from "@ant-design/icons-vue";

dayjs.extend(utc)
const request = new Request();

const emit = defineEmits<{
    (event:'searchEvent',
     val: {
         name:string|undefined,
         groupId:number[]|undefined,
         placeId:number[]|undefined,
         startDateTime:Dayjs|undefined,
         endDateTime:Dayjs|undefined,
         type:number[]|undefined

     }):void;
}>()

const eventRef = ref({
    name:undefined,
    locationId:undefined,

    groupId:undefined,

    startDateTime:undefined,
    endDateTime:undefined,


    type:undefined,
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


const currentUser = useUserStore();
const locationOptions = ref<{ value:number,label:string }[]>([]);
const groupOptions = ref<{ value:number,label:string }[]>([]);

const searchTimePeriod= ref<[Dayjs|undefined,Dayjs|undefined]>([eventRef.value.startDateTime,eventRef.value.endDateTime]);


onMounted(async()=>{
    await currentUser.updateUserInformation();


    //加载用户组织列表

    if(currentUser.user!==undefined){

        groupOptions.value.push({ value: 0, label: '个人' })
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


function searchEvent(){
    //进行事件的搜索
    //在查询组织与个人时，设定为组织Id=0即为个人事件

    const emitVal={
        name:eventRef.value.name,
        groupId:eventRef.value.groupId,
        placeId:eventRef.value.locationId,
        startDateTime:eventRef.value.startDateTime,
        endDateTime:eventRef.value.endDateTime,
        type:eventRef.value.type
    }

    emit('searchEvent',emitVal);
}
</script>

<style scoped>
.searchBarDiv{
    position: absolute;
    top:2%;
    left: 0;
    width: 100%;
    height: 10%;
}
</style>
