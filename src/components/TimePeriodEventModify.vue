<template>
<a-modal v-model:visible="visible"
        centered>
<p>
    hello,model!
</p>
</a-modal>
</template>

<script setup lang="ts">

import {ref} from "vue";

const visible = ref(false);

defineExpose({
    visible
})

</script>

<style scoped>

</style>
