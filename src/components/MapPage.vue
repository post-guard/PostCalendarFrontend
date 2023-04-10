<template>
<canvas ref="canvasMap" width="456" height="643.2">
  你的浏览器不支持canvas，请升级浏览器版本~
</canvas>
</template>

<script setup lang="ts">

import {nextTick, ref} from "vue";

const canvasMap = ref(); //用ref找到canvas
function draw(){

  const cPainter = ref(); //创建画笔

  nextTick(()=>{//待页面dom加载完毕才去获取ref
    cPainter.value = canvasMap.value.getContext("2d"); //创建画笔
  })


  let mapBg = new Image(2491,3509);
  mapBg.src= "https://www.bupt.edu.cn/images/xtc.jpg";

  mapBg.onload = () => {

    cPainter.value.beginPath();
    cPainter.value.drawImage(mapBg, 0, 0,456,643.2);

  }

}

draw();

</script>

<style scoped>

</style>
