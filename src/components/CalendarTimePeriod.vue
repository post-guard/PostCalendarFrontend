<template>
    <a-config-provider :locale="zhCN">
        <div class = "calendar">

            <a-table :columns="columns">

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
    { title: '时间', width: 100, dataIndex: 'time', key: 'time', fixed: 'left' },

    { title: '星期一', dataIndex: 'Monday', key: '1', width: 100 },
    { title: '星期二', dataIndex: 'address', key: '2', width: 100 },
    { title: '星期三', dataIndex: 'address', key: '3', width: 100 },
    { title: '星期四', dataIndex: 'address', key: '4', width: 100 },
    { title: '星期五', dataIndex: 'address', key: '5', width: 100 },
    { title: '星期六', dataIndex: 'address', key: '5', width: 100 },
    { title: '星期日', dataIndex: 'address', key: '5', width: 100 },

]);
</script>

<style scoped>

</style>
