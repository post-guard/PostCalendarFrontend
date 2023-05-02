<template>
    <canvas ref="map">
        你的浏览器不支持canvas，请升级浏览器版本~
    </canvas>
</template>

<script setup lang="ts">
import { Canvas, Image } from "fabric";
import { onMounted, ref } from "vue";



const map = ref<HTMLCanvasElement>();




onMounted( async () => {

    if (map.value != undefined) {


        //map.value.style.width = document.getElementsByClassName('ant-layout-content')[0].clientWidth+"px"
        //map.value.style.height = document.getElementsByClassName('ant-layout-content')[0].clientHeight+"px"
        map.value.width = document.getElementsByClassName('ant-layout-content')[0].clientWidth
        map.value.height = document.getElementsByClassName('ant-layout-content')[0].clientHeight


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
//todo：即将完成限制拖拽范围，标志点的坐标计算与添加/删除功能



    }
})




function zoom(event: any,canvas:Canvas,background:Image){


    const scaleX = background.getScaledWidth()
    const preScale = scaleX/background.width;//原比例


        if(event.e.deltaY<0){

            let afterScale = preScale - 0.01;

            afterScale = proportionLimit(afterScale,canvas.height/background.height,4*canvas.height/background.height)
            //这两串神奇的数字问就是手算的
            background.scale(afterScale);

            //console.log(background)

            /*console.log("event.offsetX:"+event.e.offsetX);
            console.log("event.offsetY:"+event.e.offsetY);
            console.log("background.getX():"+background.getX());
            console.log("background.getY():"+background.getY());
            console.log("preScale:"+preScale);
            console.log("afterScale:"+afterScale);
            console.log("scaleRate:"+afterScale/preScale);
            console.log('left:'+background.getX()+(event.e.offsetX) * afterScale/preScale)
            console.log('top:'+background.getY()+(event.e.offsetY) * afterScale/preScale)*/


            background.set('left',event.e.offsetX - (event.e.offsetX - background.getX()) * afterScale/preScale);
            background.set('top', event.e.offsetY -(event.e.offsetY - background.getY()) * afterScale/preScale);

            canvas.renderAll()
        }
        else if(event.e.deltaY>0){

            let afterScale = preScale + 0.01;

            afterScale = proportionLimit(afterScale,canvas.height/background.height,4*canvas.height/background.height)
            //这两串神奇的数字问就是手算的
            background.scale(afterScale);

            background.set('left',event.e.offsetX - (event.e.offsetX - background.getX()) * afterScale/preScale);
            background.set('top', event.e.offsetY -(event.e.offsetY - background.getY()) * afterScale/preScale);

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
