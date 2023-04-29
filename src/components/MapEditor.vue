<template>
    <canvas ref="map" width="auto" height="auto">
        你的浏览器不支持canvas，请升级浏览器版本~
    </canvas>
</template>

<script setup lang="ts">
import { Canvas, Image } from "fabric";
import { onMounted, ref } from "vue";


const map = ref<HTMLCanvasElement>();

onMounted( async () => {
    if (map.value != undefined) {
        const canvas = new Canvas(map.value);

        const background = await Image.fromURL("xtcmap.svg");

        background.scale(canvas.height / background.height);

        background.selectable = false;
        canvas.add(background);
    }
})
</script>

<style scoped>

</style>