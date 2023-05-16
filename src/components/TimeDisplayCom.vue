<template>
    <div class="timeShower">
        <a-card>
            <div class="currentDate" style="font-size: large">
                {{date.getFullYear()}}年{{date.getMonth()+1}}月{{date.getDate()}}日

                星期{{"日一二三四五六".charAt(date.getDay())}}
            </div>
            <br>

            <div class="currentTime" style="font-size: xxx-large;margin-left:auto">
                {{date.getHours()/10>=1?date.getHours():"0"+date.getHours()}}
                :
                {{date.getMinutes()/10>=1?date.getMinutes():"0"+date.getMinutes()}}
                :
                {{date.getSeconds()/10>=1?date.getSeconds():"0"+date.getSeconds()}}
            </div>

        </a-card>
    </div>
</template>

<script setup lang="ts">

import {ref} from "vue";

const date = ref<Date>(new Date);



function getCurrentTimeF(){
    date.value = new Date();
}

setInterval(getCurrentTimeF,1000);
</script>

<style scoped>
.timeShower{
    position: absolute;
    width: 300px;
    top: 20px;

}

.currentTime{

    display: flex;
    justify-content: center;
}
</style>
