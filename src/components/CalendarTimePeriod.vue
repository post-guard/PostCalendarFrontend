<template>
    <a-config-provider :locale="zhCN">
        <div>
            <a-calendar :fullscreen="false">
            </a-calendar>
        </div>
    </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

</script>

<style scoped>

</style>
