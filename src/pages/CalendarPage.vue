<template>
    <div class="calendarPage">

        <div class="calendarPart">
            <calendar-time-period>

            </calendar-time-period>
        </div>
    </div>
</template>

<script lang="ts" setup>

import CalendarTimePeriod from "@/components/CalendarTimePeriod.vue";

</script>

<style scoped>
.calendarPage{
    position: relative;
    /*width: 1350px;
    height: 670px;*/
    width: 100%;
    height: 100%;
}



.calendarPart{
    position: absolute;
    top:  0;
    left: 0;
    //width: 1350px;
    //height: 670px;
    width: inherit;
    height: inherit;
}
</style>
