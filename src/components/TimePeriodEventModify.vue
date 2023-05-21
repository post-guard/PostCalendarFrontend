<template>
<a-modal v-model:visible="visible" centered>

    <a-form
        class="eventFormClass"
        :model="eventFormRef"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >

        <a-form-item>
            <a-input v-model:value="eventRef.name" placeholder="事件名称" />
        </a-form-item>

        <a-form-item>
            <a-input v-model:value="eventRef.details" placeholder="事件描述" />
        </a-form-item>


    </a-form>
</a-modal>
</template>

<script setup lang="ts">

import {ref} from "vue";

const visible = ref(false);
const props = defineProps<{
    name:string,
    details:string,
    locationId:number,
    userId:number,
    groupId:number,
    startTime: string,
    endTime: string
}>();

defineExpose({
    visible
})

const eventRef = ref({
    name:props.name,
    details:props.details,
    locationId:props.locationId,
    userId:props.userId,
    groupId:props.groupId,
    startTime: props.startTime,
    endTime: props.endTime
})

const eventFormRef = ref();


</script>

<style scoped>
.eventFormClass{
    position: relative;

}
</style>
