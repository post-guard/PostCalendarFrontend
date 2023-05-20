<template>
    <a-config-provider :locale="zhCN">

        <div class = "calendar">
            <div class = "calendarBackground">
                <a-table
                     :columns="columns"
                     :data-source="data"
                     :pagination="{ pageSize: 24 , hideOnSinglePage: true}"
                     :scroll="{ y: 556 }"
                >
                <template #title>
                    <a-date-picker  v-model:value="datePickerRef"
                                    picker="week"
                                    @change="datePickerChange"/>
                </template>

                </a-table>
            </div>

            <div class="colorBars">
                <div v-for="bar in colorBarList">
                    <calendar-color-bar
                                :ref = "setColorBarRef"
                                :start-time=bar.beginDateTime
                                :end-time=bar.endDateTime
                                :event-name=bar.name
                                :details = bar.details
                                :location=bar.placeId.toString()
                                :type=bar.userId.toString()>

                    </calendar-color-bar>
                </div>
            </div>

        </div>

    </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';

import 'dayjs/locale/zh-cn';
import dayjs from "dayjs";
dayjs.locale("zh-cn");
import CalendarColorBar from "@/components/CalendarColorBar.vue";
import {onBeforeUpdate, onMounted, reactive, ref} from "vue";
import type {CalendarTimePeriod} from "@/models/CalendarTimePeriod";
import {message} from "ant-design-vue";
import {Request} from "@/utils/Request";
import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import {useUserStore} from "@/stores/UserStore";
import {Dayjs} from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear"

dayjs.extend(weekOfYear)

const colorBarList : CalendarTimePeriod[] = reactive([]);

let colorBarListRef : CalendarColorBar[] = reactive([]);
//听我说,谢谢你,reactive

const request = new Request();

const currentUser = useUserStore();


const datePickerRef = ref<Dayjs>();

onBeforeUpdate(async() => {
    colorBarListRef = [];
})


onMounted(async ()=>{
    const temp:  Element | null = document.getElementsByClassName("calendarBackground")[0].querySelector(".ant-table-body")
    if(temp!==null){
        temp.addEventListener("scroll",()=>{updateColorBars(temp.scrollTop)});

    }



    if(currentUser.user!==undefined){
        try {




            const response =  await request.get<CalendarTimePeriod[]>(`/postcalendarapi/timeSpanEvent/user/${currentUser.user.id}?begin=1683993600&end=1684598399`);


            message.success("获取时间段日程成功");
            for(let barAlready of response.data){
                const bar : CalendarTimePeriod = {
                    id: barAlready.id,
                    name : barAlready.name,
                    details: barAlready.details,
                    userId: barAlready.userId,
                    groupId: barAlready.groupId,
                    placeId: barAlready.placeId,
                    beginDateTime: barAlready.beginDateTime,
                    endDateTime: barAlready.endDateTime
                }


                colorBarList.push(bar);
            }

        }catch (err){//TODO:待更改为新方法
            const axiosError = err as AxiosError<IResponse<CalendarTimePeriod[]>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                let errorMessage = "获取时间段日程失败";
                message.error(errorMessage);
            }
        }
    }




})




const columns = [
    { title: '时间', width: 100, dataIndex: 'time', key: 'time', fixed: 'left' ,
        align:'center'
    },

    { title: '星期一', dataIndex: 'Monday', key: 'Monday', width: 100 ,
        align:'center'},
    { title: '星期二', dataIndex: 'Tuesday', key: 'Tuesday', width: 100 ,
        align:'center'},
    { title: '星期三', dataIndex: 'Wednesday', key: 'Wednesday', width: 100 ,
        align:'center'},
    { title: '星期四', dataIndex: 'Thursday', key: 'Thursday', width: 100 ,
        align:'center'},
    { title: '星期五', dataIndex: 'Friday', key: 'Friday', width: 100 ,
        align:'center'},
    { title: '星期六', dataIndex: 'Saturday', key: 'Saturday', width: 100 ,
        align:'center'},
    { title: '星期日', dataIndex: 'Sunday', key: 'Sunday', width: 100 ,
        align:'center'},

];


const data = [
    {
        key: '0',
        time: "00:00~01:00",
    },
    {
        key: '1',
        time: "01:00~02:00",
    },
    {
        key: '2',
        time: "02:00~03:00",
    },
    {
        key: '3',
        time: "03:00~04:00",
    },
    {
        key: '4',
        time: "04:00~05:00",
    },
    {
        key: '5',
        time: "05:00~06:00",
    },
    {
        key: '6',
        time: "06:00~07:00",
    },
    {
        key: '7',
        time: "07:00~08:00",
    },
    {
        key: '8',
        time: "08:00~09:00",
    },
    {
        key: '9',
        time: "09:00~10:00",
    },
    {
        key: '10',
        time: "10:00~11:00",
    },
    {
        key: '11',
        time: "11:00~12:00",
    },
    {
        key: '12',
        time: "12:00~13:00",
    },
    {
        key: '13',
        time: "13:00~14:00",
    },
    {
        key: '14',
        time: "14:00~15:00",
    },
    {
        key: '15',
        time: "15:00~16:00",
    },
    {
        key: '16',
        time: "16:00~17:00",
    },
    {
        key: '17',
        time: "17:00~18:00",
    },
    {
        key: '18',
        time: "18:00~19:00",
    },
    {
        key: '19',
        time: "19:00~20:00",
    },
    {
        key: '20',
        time: "20:00~21:00",
    },
    {
        key: '21',
        time: "21:00~22:00",
    },
    {
        key: '22',
        time: "22:00~23:00",
    },
    {
        key: '23',
        time: "23:00~24:00",
    },
]


function setColorBarRef(el: CalendarColorBar|undefined){
    if (el) {

        colorBarListRef.push(el)

    }
}

function updateColorBars(scrollNum:number){

    for(let bar of colorBarListRef){
        bar.updateColorBar(scrollNum);
    }


}



function datePickerChange(){

    if(datePickerRef.value!==undefined){

        const currentTime = datePickerRef.value.year()+"-"
        +(datePickerRef.value.month()+1)+"-"
        +datePickerRef.value.date();

        const currentWeek = dayjs(currentTime).week();

        console.log(currentWeek);
    }

}
</script>

<style scoped>
.calendar{
    height: 670px;
}

.calendarBackground{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
}

.colorBars{
    position: absolute;
    top: 118px;
    left: 167px;
    width: 1168px;
    height: 556px;
    //z-index: 4;
    overflow: hidden;
}



:deep(.ant-table-row-level-0){
        height: 100px;
        overflow-wrap: break-word;
}

</style>
