<template>
    <div class="colorBar" ref="colorBarRef">
      <a-card class="colorBar" :bordered="false">
          <h3>
              {{ eventName }}
          </h3>
          <p>
              {{ location }}
          </p>
          <p>
              {{ type }}&nbsp;&nbsp;&nbsp;&nbsp;{{ periodicity }}
          </p>
      </a-card>
    </div>
</template>

<script setup lang="ts">

import {ref} from "vue";

const props= defineProps<{

    startTime: string,
    endTime: string,
    day: number,
    eventName: string,
    location: string,
    type: string,
    periodicity: string

}>()

const colorBarRef = ref()

/**
 * 设置滚动表格时彩条的位置
 * @param offsetY 表格滚动的距离
 */
function updateColorBar(offsetY:number){
    const startTime = hmsToSec(props.startTime);
    const endTime = hmsToSec(props.endTime);
    const day = props.day;

    console.log(startTime);
    console.log(endTime);

    if(colorBarRef.value!==undefined){

        //console.log(colorBarRef.value)
        colorBarRef.value.style.top = startTime/86400*2400-offsetY + "px";
        colorBarRef.value.style.left = 167 * (day-1)+"px";
        colorBarRef.value.style.height = (endTime-startTime)/86400*2400 + "px";
    }



}

defineExpose({updateColorBar});
/**
 * 用于将HH:MM:SS形式的字符串转化为秒的函数
 * @param hms HH:MM:SS形式的字符串
 */
function hmsToSec(hms:string):number{
    const splitHms = hms.split(':');

// minutes are worth 60 seconds. Hours are worth 60 minutes.
    const seconds = (+splitHms[0]) * 60 * 60 + (+splitHms[1]) * 60 + (+splitHms[2]);


    return seconds;
}
</script>

<style scoped>
.colorBar{
    position: absolute;
    border-radius: 8px;
    top:0;

    width: 167px;
    height: 150px;
    z-index: 4;
    overflow: hidden;
    background: #67fffa;
    color: white;

}



:deep(h3){
    color: white;
}
</style>
