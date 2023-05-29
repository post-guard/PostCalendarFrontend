<template>
  <div class="logDiv">

          <a-list item-layout="horizontal"
                  :data-source="logData"
                  :pagination=false
                  :grid="{ gutter: 16, column: 1 }"
                  class="logListDiv">
              <template #renderItem="{ item }">
                  <a-list-item>

                                  {{ item.title }}


                  </a-list-item>
              </template>
          </a-list>

  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted,ref} from "vue";
import {createSocket} from "@/utils/WebSocket";


onMounted(()=>{
    createSocket("wss://server.rrricardo.top/postcalendarapi/websocket/logging",'logging');
    window.addEventListener('onmessageWS', getLog);
})

onUnmounted(()=>{
    window.removeEventListener('onmessageWS', getLog);
})


interface ILogData{
    title:string
}
const logData = ref<ILogData[]>([]);

async function getLog(event:any) {


    const data = event && event.detail.data
    const type = event && event.detail.type

    if(type=='logging')
    {

        if(logData.value.length>=300){
            logData.value.shift();
        }
        logData.value.push({title:data});
        console.log(data);
    }


}
</script>

<style scoped>
.logDiv{
    position: relative;
    width: 100%;
    height: 100%;

}

.logListDiv{
    position: absolute;
    width: 100%;
    height: inherit;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>
