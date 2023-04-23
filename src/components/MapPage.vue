<template>
    <div class="classMap" @wheel="zoom">
<canvas ref="canvasMap" width="456" height="643.2" >
  你的浏览器不支持canvas，请升级浏览器版本~
</canvas>
    </div>
</template>

<script setup lang="ts">

import {nextTick, ref} from "vue";

const canvasMap = ref(); //用ref找到canvas

draw();

function zoom(event:WheelEvent){

    event.preventDefault();

  if(event.deltaY < 0){
      canvasMap.value.width -= 5;
      canvasMap.value.height -= 5;

  }
  else if(event.deltaY > 0){
      canvasMap.value.width += 5;
      canvasMap.value.height += 5;

  }
  console.log(canvasMap.value.width+" "+canvasMap.value.height)
    draw();
}
function draw(){

  const cPainter = ref(); //创建画笔

  let ratio = 1;



  nextTick(()=>{//待页面dom加载完毕才去获取ref
    cPainter.value = canvasMap.value.getContext("2d"); //创建画笔


      const devicePixelRatio = window.devicePixelRatio || 1;
      // 浏览器在渲染canvas之前存储画布信息的像素比

      const backingStoreRatio =cPainter.value?.webkitBackingStorePixelRatio ||
          cPainter.value?.mozBackingStorePixelRatio ||
          cPainter.value?.msBackingStorePixelRatio ||
          cPainter.value?.oBackingStorePixelRatio ||
          cPainter.value?.backingStorePixelRatio || 1;



      ratio = devicePixelRatio / backingStoreRatio;// canvas的实际渲染倍率


      /*使canvas先放大到当前屏幕大小进行渲染，然后缩小到固定比例放置在界面上，以此解决图片模糊的问题*/
      canvasMap.value.style.width = canvasMap.value.width+'px';

      canvasMap.value.style.height = canvasMap.value.height+'px';

      console.log("old:"+canvasMap.value.width+" "+canvasMap.value.height)

      canvasMap.value.width = canvasMap.value.width * ratio;

      canvasMap.value.height = canvasMap.value.height * ratio;

      //TODO:这里会出现重复draw()导致width和height重复乘法变大的情况，需要进行调整

      console.log("new:"+canvasMap.value.width+" "+canvasMap.value.height)
  })


  let mapBg = new Image(2491,3509);
  mapBg.src= "https://www.bupt.edu.cn/images/xtc.jpg";




  mapBg.onload = () => {

    /*cPainter.value.beginPath();
    cPainter.value.rect(0, 0, 456*ratio, 643.2*ratio)
      cPainter.value.fill();
      cPainter.value.closePath()*/


      cPainter.value.beginPath();
    cPainter.value.drawImage(mapBg, 0, 0,canvasMap.value.width,canvasMap.value.height);
      cPainter.value.closePath()
  }

}



</script>

<style scoped>

</style>
