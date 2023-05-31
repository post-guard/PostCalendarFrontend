<template>
    <div class="timeShower">

            <div class="currentDate" style="font-size: large">
                {{currentTime.now.year()}}年{{currentTime.now.month()+1}}月{{currentTime.now.date()}}日

                星期{{"日一二三四五六".charAt(currentTime.now.day())}}
            </div>


            <div class="currentTime">
                {{currentTime.now.hour()/10>=1?currentTime.now.hour():"0"+currentTime.now.hour()}}
                :
                {{currentTime.now.minute()/10>=1?currentTime.now.minute():"0"+currentTime.now.minute()}}
                :
                {{currentTime.now.second()/10>=1?currentTime.now.second():"0"+currentTime.now.second()}}
            </div>


        <div class="timeControlBar">
            <a-button type="text" @click="speedDownTime">
                <template #icon>
                    <DoubleLeftOutlined/>
                </template>
            </a-button>
            <a-button type="text" @click="()=>clockModalVisible=true">
                <template #icon>
                    <ClockCircleOutlined/>
                </template>
            </a-button>
            <a-button type="text" @click="speedUpTime">
                <template #icon>
                  <DoubleRightOutlined/>
                </template>
            </a-button>
        </div>

        <div class="speedTimeDisplay">
            <template v-if="currentTime.time!=1">
                x{{currentTime.time}}
            </template>
        </div>

        <a-modal v-model:visible="clockModalVisible"
                 centered
                 title="修改系统时间"
                 @ok="updateTime">
            <a-date-picker show-time
                           placeholder="选择时间"
                           size="large"
                           style="display: flex;
                                  align-items: center;
                                  justify-content: center;"
                           v-model:value="clockModalValue" />
        </a-modal>

    </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import type {Dayjs} from "dayjs";
import {DoubleLeftOutlined,DoubleRightOutlined,ClockCircleOutlined} from "@ant-design/icons-vue";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import {Request} from "@/utils/Request";
import type {IClock} from "@/models/IClock";
import {message} from "ant-design-vue";
import {createSocket} from "@/utils/WebSocket";

dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('zh-cn')

const currentTime = ref({
    now:dayjs("1970-01-01T00:00:00Z"),
    time:1
});

const request = new Request();

const clockModalVisible = ref(false);

const clockModalValue = ref<Dayjs>(dayjs());

onMounted(async ()=>{

    try {

        const response = await request.get<IClock>(`/postcalendarapi/clock/`);

        currentTime.value.now = dayjs(response.data.now)
        currentTime.value.time = response.data.time


    } catch (err) {
        const axiosError = err as AxiosError<IResponse<IClock>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {
                  console.log(axiosError.response.data.message)
        }

    }

    createSocket("wss://server.rrricardo.top/postcalendarapi/websocket/clock",'clock');
    window.addEventListener('onmessageWS', getCurrentTime)
})

onUnmounted(()=>{
    window.removeEventListener('onmessageWS', getCurrentTime);
})

async function getCurrentTime(event:any) {


    const data = event && event.detail.data
    const type = event && event.detail.type

    if(type=='clock'){
        currentTime.value.now = dayjs(data)
    }

    //console.log(data);

}


async function speedDownTime(){
    try {

        if(currentTime.value.time>1){
            const response = await request.post<IClock>(`/postcalendarapi/clock/speedDown`,{
                time:2
            });

            message.success("减速成功",1)
            currentTime.value.now = dayjs(response.data.now)
            currentTime.value.time = response.data.time
        }
        else{
            message.error("最小时间单位为1秒",1)
        }


    } catch (err) {
        const axiosError = err as AxiosError<IResponse<IClock>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {
            console.log(axiosError.response.data.message)
        }

    }
}


async function speedUpTime(){
    try {

        const response = await request.post<IClock>(`/postcalendarapi/clock/speedUp`,{
            time:2
        });

        message.success("加速成功",1)
        currentTime.value.now = dayjs(response.data.now)
        currentTime.value.time = response.data.time

    } catch (err) {
        const axiosError = err as AxiosError<IResponse<IClock>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {
            console.log(axiosError.response.data.message)
        }

    }
}


async function updateTime(){


    try {

        const response = await request.post<IClock>(`/postcalendarapi/clock/update`,{
            now:dayjs(clockModalValue.value).format("YYYY-MM-DD[T]HH:mm:ss")
        });

        message.success("修改时间成功成功",1)
        /*currentTime.value.now = dayjs(response.data.now)
        currentTime.value.time = response.data.time*/

    } catch (err) {
        const axiosError = err as AxiosError<IResponse<IClock>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {
            console.log(axiosError.response.data.message)
        }

    }

    clockModalVisible.value = false;
}

//TODO:对日程页和ddl页的当前时间要统一更改为这个系统时钟，同时要设置ddl页的过期效果
</script>

<style scoped>
.timeShower{
    position: absolute;
    width: 100%;
    height: inherit;
    top: 0;
    left:0

}

.currentDate{
    position: absolute;
    top:0;
    width: auto;
    height: auto;
    left:10%
}
.currentTime{
    position: absolute;
    top:0;
    flex: fit-content;
    font-size: 30px;
    left:48%
}
.timeControlBar{
    position: absolute;
    top:-5px;
    font-size: 30px;
    left:80%
}
.speedTimeDisplay{
    position: absolute;
    top:0;
    font-size: 20px;
    left:60%
}
</style>
