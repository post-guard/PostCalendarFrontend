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

                    <template #headerCell="{ column }">
                        <template v-if="column.key !== 'time'">
                            <span>
                                {{calendarColumns(column.key)}}
                            </span>
                        </template>
                    </template>


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
                                :type=bar.userId.toString()
                                :init-scroll=currentScroll()
                    >

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

let colorBarList = ref<CalendarTimePeriod[]>([]);

let colorBarListRef = ref<CalendarColorBar[]>([]);
//听我说,谢谢你,reactive

const request = new Request();

const currentUser = useUserStore();


const datePickerRef = ref<Dayjs>();

const currentTime = new Date();

const currentScroll = ()=>{
    let scrollElement : Element|null = document.getElementsByClassName("calendarBackground")[0].querySelector(".ant-table-body")

    if(scrollElement!==null){
        return scrollElement.scrollTop;
    }//当前表格滑动条的位置
    else return 0;
}

const calendarPeriod = ref({//控制日历显示的日期

    start: dayjs(getCalendarPeriod(currentTime.getFullYear()
        +"-"+(currentTime.getMonth()+1)
        +"-"+currentTime.getDate()).start), //获得当前时间戳


    end: dayjs(getCalendarPeriod(currentTime.getFullYear()
    +"-"+(currentTime.getMonth()+1)
    +"-"+currentTime.getDate()).end)
});



function calendarColumns(columnDay:string){

    let day = 0;

    switch (columnDay){//我谔谔，你呃呃
        case "Monday":
            day = 1;
            break;
        case "Tuesday":
            day = 2;
            break;
        case "Wednesday":
            day = 3;
            break;
        case "Thursday":
            day = 4;
            break;
        case "Friday":
            day = 5;
            break;
        case "Saturday":
            day = 6;
            break;
        case "Sunday":
            day = 7;
            break;

    }

    let result = "星期"+"空一二三四五六日".charAt(day)+" ";
    if(day!=0){
        result+=(calendarPeriod.value.start.add(day-1,'d').month()+1)+"-"+(calendarPeriod.value.start.add(day-1,'d').date())
    }
    else{
        result+=(calendarPeriod.value.start.add(6,'d').month()+1)+"-"+(calendarPeriod.value.start.add(6,'d').date())
    }

    return result;

}

onBeforeUpdate(async() => {
    colorBarListRef.value = [];
})


onMounted(async ()=>{
    await currentUser.updateUserInformation();

    const scrollElement:  Element | null = document.getElementsByClassName("calendarBackground")[0].querySelector(".ant-table-body")
    if(scrollElement!==null){

        scrollElement.addEventListener("scroll",()=>{updateColorBars(scrollElement.scrollTop)});

    }


    if(currentUser.user!==undefined){
        try {




            const response =  await request.get<CalendarTimePeriod[]>
            (`/postcalendarapi/timeSpanEvent/user/${currentUser.user.id}?begin=${calendarPeriod.value.start.unix()}&end=${calendarPeriod.value.end.unix()}`);




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


                colorBarList.value.push(bar);
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




const columns = ref([
    { title: '时间', width: 100, dataIndex: 'time', key: 'time', fixed: 'left' ,
        align:'center'
    },

    { //title: calendarColumns.value[0],
        dataIndex: 'Monday', key: 'Monday', width: 100 , align:'center'},


    { //title: calendarColumns.value[1],
        dataIndex: 'Tuesday', key: 'Tuesday', width: 100 , align:'center'},

    { //title: calendarColumns.value[2],
        dataIndex: 'Wednesday', key: 'Wednesday', width: 100 , align:'center'},

    { //title: calendarColumns.value[3],
        dataIndex: 'Thursday', key: 'Thursday', width: 100 , align:'center'},

    { //title: calendarColumns.value[4],
        dataIndex: 'Friday', key: 'Friday', width: 100 , align:'center'},

    { //title: calendarColumns.value[5],
        dataIndex: 'Saturday', key: 'Saturday', width: 100 , align:'center'},

    { //title: calendarColumns.value[6],
        dataIndex: 'Sunday', key: 'Sunday', width: 100 , align:'center'},

]);


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

        colorBarListRef.value.push(el)

    }
}

function updateColorBars(scrollNum:number){

    for(let bar of colorBarListRef.value){
        bar.updateColorBar(scrollNum);
    }


}



async function datePickerChange(){

    if(datePickerRef.value!==undefined){

        const currentTime = datePickerRef.value.year()+"-"
        +(datePickerRef.value.month()+1)+"-"
        +datePickerRef.value.date();



        calendarPeriod.value.start = getCalendarPeriod(currentTime).start
        calendarPeriod.value.end = getCalendarPeriod(currentTime).end


        colorBarList.value = [];
        colorBarListRef.value = [];


        if(currentUser.user!==undefined){
            try {

                console.log(calendarPeriod.value.start.unix())
                console.log(calendarPeriod.value.end.unix())


                const response =  await request.get<CalendarTimePeriod[]>
                (`/postcalendarapi/timeSpanEvent/user/${currentUser.user.id}?begin=${calendarPeriod.value.start.unix()}&end=${calendarPeriod.value.end.unix()}`);




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


                    colorBarList.value.push(bar);
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


        console.log(colorBarList.value)
        console.log(colorBarListRef.value)
    }

}

/**
 * 获得所选日期所在这一周的起始日期（星期一）和结束日期（星期天）
 * @param today 形如yyyy-mm-dd格式的日期字符串
 */
function getCalendarPeriod(today:string):({start:Dayjs,end:Dayjs}){

    const currentWeek = dayjs(today).week();
    const currentDay = dayjs(today).day();

    let startDate,endDate;

    /*注意，day指的是星期，范围是星期天0-星期六6，但是由于课程表是星期一到星期天，
         所以需要以下操作*/

    if(currentDay!=0){
        //向前找currentDay-1天,向后找7-currentDay天
        startDate = dayjs(today).subtract(currentDay-1, 'day')
        endDate = dayjs(today).add(7-currentDay, 'day')
    }
    else{//是星期天就向前找6天
        startDate = dayjs(today).subtract(6, 'day')
        endDate = dayjs(today)
    }

    endDate = dayjs(endDate).add(23, 'hour')
        .add(59,'minute').add(59,'second');


    //console.log(currentDay)

    return {start:startDate,end:endDate};
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
