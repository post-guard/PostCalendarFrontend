<template>
    <a-config-provider :locale="zhCN">
        <div class = "calendar">
            <div class = "calendarBackground">
                <a-table v-model:value="tableTimePeriod"
                     :columns="columns"
                     :data-source="data"
                     :pagination="{ pageSize: 24 , hideOnSinglePage: true}"
                     :scroll="{ y: 610 }"
                >


                </a-table>
            </div>

            <div class="colorBars">
                <calendar-color-bar
                    ref = "colorBarTest"
                                :start-time="'12:00:00'"
                                :end-time="'13:30:00'"
                                :event-name="'发病'"
                                :location="'学五宿舍'"
                                :day="2"
                                :periodicity="'临时'"
                                :type="'个人'">

                </calendar-color-bar>
            </div>
        </div>
    </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import CalendarColorBar from "@/components/CalendarColorBar.vue";
import {onMounted, ref} from "vue";

dayjs.locale('zh-cn');

const tableTimePeriod = ref();


onMounted(()=>{
   const temp:  Element | null = document.getElementsByClassName("calendarBackground")[0].querySelector(".ant-table-body")
    if(temp!==null){
        temp.addEventListener("scroll",()=>{updateColorBars(temp.scrollTop)});

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


const colorBarTest = ref();
function updateColorBars(scrollNum:number){
    console.log(scrollNum)

    colorBarTest.value.updateColorBar(scrollNum);

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
    top: 55px;
    left: 167px;
    width: 1168px;
    height: 610px;
    //z-index: 4;
    overflow: hidden;
}



:deep(.ant-table-row-level-0){
        height: 100px;
        overflow-wrap: break-word;
}

</style>
