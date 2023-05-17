<template>
    <a-config-provider :locale="zhCN">
        <div class = "calendar">

            <a-table :columns="columns"
                     :data-source="data"
                     :pagination="{ pageSize: 24 , hideOnSinglePage: true}"
                     :scroll="{ y: 620 }">
                <template #bodycell="{columns,data}">
                    <template v-if="columns.key=== 'time'">
                        <a>
                            {{data.time}}
                        </a>

                    </template>
                </template>
            </a-table>
        </div>
    </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {ref} from "vue";

dayjs.locale('zh-cn');


const columns =ref( [
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

]);


const data  = ref([
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
])
</script>

<style scoped>
.calendar{
    height: 670px;
}
</style>
