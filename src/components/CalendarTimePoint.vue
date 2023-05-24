<template>
<div class="ddlZoneDiv">



      <a-list class="ddlList"
              item-layout="horizontal"
          :data-source  = ddlList
          :pagination="false"
          size="Large"
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
                               :type = item.type>

              </CalendarDDLCard>
          </a-list-item>
      </template>

    </a-list>

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
</script>

<style scoped>
.ddlZoneDiv{
    position: relative;
    top:0;
    left:20%;
    width: 60%;
    height: 100%;
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
