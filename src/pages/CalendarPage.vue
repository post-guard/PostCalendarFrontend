<template>
    <div class="calendarPage">
        <div class="timeDisplayPart">
            <time-display-com>

            </time-display-com>
        </div>
        <div class="calendarPart">
            <calendar-time-period>

            </calendar-time-period>
        </div>
    </div>
</template>

<script lang="ts" setup>

import CalendarTimePeriod from "@/components/CalendarTimePeriod.vue";
import TimeDisplayCom from "@/components/TimeDisplayCom.vue";
</script>

<style scoped>
.calendarPage{
    position: fixed;
}
.calendarPart{
    position: relative;
    top:  20px;
    left: 400px;
}

.timeDisplayPart{

}
</style>
