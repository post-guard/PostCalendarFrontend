<template>
    <div class="classMap" @wheel="zoom" style="width: 1350px;height: 648px ">
        <canvas ref="canvasMap" width="456" height="643.2">
          你的浏览器不支持canvas，请升级浏览器版本~
        </canvas>

        <canvas ref="canvasMap_DoubleBuffer" width="456" height="643.2" style="opacity: 0;">
        </canvas>


    </div>
</template>

<script setup lang="ts">

import {nextTick, ref} from "vue";

const canvasMap = ref(); //用ref找到canvas
const canvasMap_DoubleBuffer = ref();

const cPainter = ref(); //创建画笔
const cPainter_DoubleBuffer = ref(); //创建双缓冲画笔

const originScale = {x:456,y:643.2};

const mapBg = init();
function init(){

    const mapBg = new Image(2491,3509);
    mapBg.src= "xtcmap.jpg";

    nextTick(()=>{

        mapBg.onload = () => {
            draw(mapBg);
        }
    })

    return mapBg;
}



function zoom(event:WheelEvent){

    event.preventDefault();

    const proportionality = originScale.y/originScale.x; //图片比例

  if(event.deltaY < 0){
      originScale.x -= 10 ;
      originScale.y -= 10 * proportionality;

  }
  else if(event.deltaY > 0){
      originScale.x += 10 ;
      originScale.y += 10 * proportionality;

  }
//TODO:需要根据鼠标位置进行鼠标位置为中心的缩放，以及限定渲染范围与缩放范围
    draw(mapBg);
}



function draw(mapBg:HTMLImageElement){

  /*const cPainter = ref(); //创建画笔

  const cPainter_DoubleBuffer = ref(); //创建双缓冲画笔*/

  let ratio = 1;


  nextTick(()=>{//待页面dom加载完毕才去获取ref
    cPainter.value = canvasMap.value.getContext("2d"); //创建画笔

    cPainter_DoubleBuffer.value = canvasMap_DoubleBuffer.value.getContext("2d"); //创建双缓冲画笔




      const devicePixelRatio = window.devicePixelRatio || 1;
      // 浏览器在渲染canvas之前存储画布信息的像素比

      const backingStoreRatio =cPainter.value?.webkitBackingStorePixelRatio ||
          cPainter.value?.mozBackingStorePixelRatio ||
          cPainter.value?.msBackingStorePixelRatio ||
          cPainter.value?.oBackingStorePixelRatio ||
          cPainter.value?.backingStorePixelRatio || 1;



      ratio = devicePixelRatio / backingStoreRatio;// canvas的实际渲染倍率


      /*使canvas先放大到当前屏幕大小进行渲染，然后缩小到固定比例放置在界面上，以此解决图片模糊的问题*/
      canvasMap.value.style.width = originScale.x+'px';

      canvasMap.value.style.height = originScale.y+'px';

      canvasMap.value.width = originScale.x * ratio;

      canvasMap.value.height = originScale.y * ratio;



      canvasMap_DoubleBuffer.value.style.width = originScale.x+'px';

      canvasMap_DoubleBuffer.value.style.height = originScale.y+'px';

      canvasMap_DoubleBuffer.value.width = originScale.x * ratio;

      canvasMap_DoubleBuffer.value.height = originScale.y * ratio;


      cPainter_DoubleBuffer.value.clearRect(0,0,canvasMap_DoubleBuffer.value.width,canvasMap_DoubleBuffer.value.height)
      cPainter_DoubleBuffer.value.beginPath();
      cPainter_DoubleBuffer.value.drawImage(mapBg, 0, 0,canvasMap_DoubleBuffer.value.width,canvasMap_DoubleBuffer.value.height);
      cPainter_DoubleBuffer.value.closePath();


      //cPainter.value.clearRect(0,0,canvasMap.value.width,canvasMap.value.height);
      //const imageData = cPainter_DoubleBuffer.value.getImageData(0,0,canvasMap_DoubleBuffer.value.width,canvasMap_DoubleBuffer.value.height)

      cPainter.value.drawImage(canvasMap_DoubleBuffer.value,0,0);

  })


  /*let mapBg = new Image(2491,3509);
  mapBg.src= "xtcmap.jpg";*/





  //mapBg.onload = () => {




  //}

}



</script>

<style scoped>

</style>
