<template>
    <canvas ref="map" width="1350" height="670">
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

        const background = await Image.fromURL("xtcmap.jpg");


        background.scale(canvas.height/background.height);
        background.selectable = true;
        background.hasControls = false;
        background.hasBorders =  true;
        background.lockRotation = true;
        background.left = Math.abs(canvas.width-background.getScaledWidth())/2;

        canvas.add(background);


        background.on('mousewheel',e=>zoom(e,canvas,background));
//todo：即将完成地图按鼠标为原点缩放，限制拖拽范围，标志点的坐标计算与添加/删除功能
    }
})

async function createMap(){

    /*if (map.value != undefined) {
        const canvas = new Canvas(map.value);

        const background = await Image.fromURL("xtcmap.jpg");


        background.scale(canvas.height/background.height);
        background.selectable = true;
        background.hasControls = false;
        background.hasBorders =  true;
        background.lockRotation = true;
        canvas.add(background);

        console.log(canvas)
        console.log(init)



        init.value.canvas = canvas;
        init.value.background = background;

        background.on('mousewheel',e=>zoom(e));

    }*/

}


function zoom(event: any,canvas:Canvas,background:Image){


    const scaleX = background.getScaledWidth()
    const preScale = scaleX/background.width;//原比例


        if(event.e.deltaY<0){

            let afterScale = preScale - 0.01;

            afterScale = proportionLimit(afterScale,0.19093758905671132,0.7509375890567117)
            //这两串神奇的数字问就是手算的
            background.scale(afterScale);

            canvas.renderAll()
        }
        else if(event.e.deltaY>0){

            let afterScale = preScale + 0.01;

            afterScale = proportionLimit(afterScale,0.19093758905671132,0.7509375890567117)
            //这两串神奇的数字问就是手算的
            background.scale(afterScale);

            canvas.renderAll()
        }


}

function proportionLimit(value:number,min:number,max:number):number{

    if(value>max){
        value = max;
    }
    else if(value<min){
        value = min;
    }
    else{

    }
    return value;
}

</script>

<style scoped>

</style>
