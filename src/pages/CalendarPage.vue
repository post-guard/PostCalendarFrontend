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
    position: fixed;
}
.calendarPart{
    position: absolute;
    left: 5px;
    top: 100px;
    width: 300px;



}
</style>
