<template>
    <div class="colorBarDiv" ref="colorBarDivRef">
      <a-card class="colorBar" ref="colorBarRef"
              :bordered="false"
      @click="showEventModel">
          <h3>
              <b>
              {{ eventName }}
              </b>
          </h3>
          <p>
              <b>
              {{ location }}
              </b>
          </p>
          <p>
              <b>
              {{ type }}
              </b>
          </p>
      </a-card>

      <time-period-event-modify ref="eventModel">

      </time-period-event-modify>
    </div>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone";
import TimePeriodEventModify from "@/components/TimePeriodEventModify.vue";

// config dayjs
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('zh-cn')

const props= defineProps<{

    startTime: string,
    endTime: string,
    details:string,
    eventName: string,
    location: string,
    type: string,

    initScroll:number


}>()

const colorBarDivRef = ref()
const colorBarRef = ref()

const startTimeTransform = dayjs.tz(props.startTime);
const endTimeTransform = dayjs.tz(props.endTime);

const eventModel = ref()

onMounted(()=>{
    updateColorBar(props.initScroll);


    //设置随机颜色，根据开始时间和结束时间定
    const setBackgroundColor = {
        R : (dayjs(props.startTime).unix()+startTimeTransform.weekday())%90+120,
        G : (dayjs(props.endTime).unix()+startTimeTransform.weekday())%50+120,
        B : (dayjs(props.startTime).unix()+dayjs(props.endTime).unix()+startTimeTransform.weekday())%80+120,
        A : 255, //其实我也不知道会是什么颜色
    }

    const change = colorBarDivRef.value.getElementsByClassName("colorBar")[0];

    change.style.background = "rgba("
        +setBackgroundColor.R+","
        +setBackgroundColor.G+","
        +setBackgroundColor.B+","
        +setBackgroundColor.A+")"



})
/**
 * 设置滚动表格时彩条的位置
 * @param offsetY 表格滚动的距离
 */
function updateColorBar(offsetY:number){
    const startTime = startTimeTransform.hour()*3600+startTimeTransform.minute()*60+startTimeTransform.second();
    const endTime = endTimeTransform.hour()*3600+endTimeTransform.minute()*60+endTimeTransform.second()
    const day = startTimeTransform.day()//props.day;



    if(colorBarDivRef.value!==undefined){

        colorBarDivRef.value.style.top = startTime/36-offsetY + "px";

        if(day==0){
            colorBarDivRef.value.style.left = 167 * 6+"px";
        }
        else{
            colorBarDivRef.value.style.left = 167 * (day-1)+"px";
        }

        colorBarDivRef.value.style.height = (endTime-startTime)/36 + "px";
    }



}

defineExpose({updateColorBar});


function showEventModel(){
    eventModel.value.visible = true
}

</script>

<style scoped>
.colorBarDiv{
    position: absolute;
    border-radius: 8px;
    top:0;

    width: 167px;
    height: 150px;
    z-index: 4;
    overflow: hidden;

}
.colorBar{
    position: absolute;
    border-radius: 8px;
    top:0;

    width: inherit;
    height: inherit;
    z-index: 4;
    overflow: hidden;
    background: #ff8d8d;
    color: white;

}



:deep(h3){
    color: white;
}
</style>
