<template>


</template>

<script setup lang="ts">
import {onMounted, onUnmounted} from "vue";
import {createSocket} from "@/utils/WebSocket";


onMounted(()=>{
    createSocket("wss://server.rrricardo.top/postcalendarapi/websocket/logging",'logging');
    window.addEventListener('onmessageWS', getLog);
})

onUnmounted(()=>{
    window.removeEventListener('onmessageWS', getLog);
})


async function getLog(event:any) {


    const data = event && event.detail.data
    const type = event && event.detail.type

    if(type=='logging')
    {
        console.log(data);
    }


}
</script>

<style scoped>

</style>
