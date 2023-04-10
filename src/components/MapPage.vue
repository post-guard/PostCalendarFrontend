<template>
<canvas ref="canvasMap" width="456" height="643.2">
  你的浏览器不支持canvas，请升级浏览器版本~
</canvas>
</template>

<script setup lang="ts">

import {ref} from "vue";

const canvasMap = ref(); //用ref找到canvas
function draw(){
  if(canvasMap.value===undefined){
    return;
  }
  console.log(canvasMap.value);

  const cPainter = canvasMap.value.getContext("2d"); //创建画笔
  let mapBg = new Image();
  mapBg.src= "https://www.bupt.edu.cn/images/xtc.jpg";

  mapBg.onload = () => {

    cPainter.beginPath();
    cPainter.drawImage(mapBg, 0, 0);

  }

}

draw();

</script>

<style scoped>

</style>
