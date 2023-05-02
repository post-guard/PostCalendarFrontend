<template>
    <a-button
              class="resize_button"
              shape="circle"
              size="large"
              @click = "buttonResize"
    >
        <template #icon><ReloadOutlined/></template>
    </a-button>

    <a-button
              class="zoomin_button"
              shape="circle"
              size="large"
              @click = "buttonZoom('In')"
    >
        <template #icon><ZoomInOutlined/></template>
    </a-button>

    <a-button
              class="zoomout_button"
              shape="circle"
              size="large"
              @click = "buttonZoom('Out')"
    >
        <template #icon><ZoomOutOutlined/></template>
    </a-button>

    <canvas ref="map">
        你的浏览器不支持canvas，请升级浏览器版本~
    </canvas>
</template>

<script setup lang="ts">
import { Canvas, Image } from "fabric";
import { onMounted, ref } from "vue";
import {ReloadOutlined,ZoomInOutlined,ZoomOutOutlined} from "@ant-design/icons-vue";


const map = ref<HTMLCanvasElement>();

const outsize_canvas = ref()
const outsize_background = ref()



onMounted( async () => {

    if (map.value != undefined) {


        //map.value.style.width = document.getElementsByClassName('ant-layout-content')[0].clientWidth+"px"
        //map.value.style.height = document.getElementsByClassName('ant-layout-content')[0].clientHeight+"px"
        map.value.width = document.getElementsByClassName('ant-layout-content')[0].clientWidth
        map.value.height = document.getElementsByClassName('ant-layout-content')[0].clientHeight


        const canvas = new Canvas(map.value);
        canvas.stopContextMenu = true



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

        outsize_canvas.value = canvas
        outsize_background.value = background

    }
})




function zoom(event: any,canvas:Canvas,background:Image){


    const scaleX = background.getScaledWidth()
    const preScale = scaleX/background.width;//原比例
    let afterScale = 0;


        if(event.e.deltaY>0){

            afterScale = preScale - 0.01;

        }
        else if(event.e.deltaY<0){

            afterScale = preScale + 0.01;

           /* afterScale = proportionLimit(afterScale,canvas.height/background.height,4*canvas.height/background.height)
            //这两串神奇的数字问就是手算的
            background.scale(afterScale);

            background.set('left',event.e.offsetX - (event.e.offsetX - background.getX()) * afterScale/preScale);
            background.set('top', event.e.offsetY -(event.e.offsetY - background.getY()) * afterScale/preScale);

            canvas.renderAll()*/
        }

    afterScale = proportionLimit(afterScale,canvas.height/background.height,4*canvas.height/background.height)
    //这两串神奇的数字问就是手算的
    background.scale(afterScale);


    background.set('left',event.e.offsetX - (event.e.offsetX - background.getX()) * afterScale/preScale);
    background.set('top', event.e.offsetY -(event.e.offsetY - background.getY()) * afterScale/preScale);

    canvas.renderAll()


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

function buttonResize(){
    outsize_background.value.scale(outsize_canvas.value.height/outsize_background.value.height)
    outsize_background.value.left = Math.abs(outsize_canvas.value.width-outsize_background.value.getScaledWidth())/2;
    outsize_background.value.top = 0

    outsize_background.value.scale(outsize_canvas.value.height/outsize_background.value.height)
    outsize_background.value.left = Math.abs(outsize_canvas.value.width-outsize_background.value.getScaledWidth())/2;
    outsize_background.value.top = 0

    outsize_canvas.value.renderAll()
    //灵异事件:需要重复一次才能在复位后正常拖动缩放地图,怀疑是焦点问题但懒得解决
}

function buttonZoom(type:string){

    const background  = outsize_background.value
    const canvas = outsize_canvas.value


    const scaleX = background.getScaledWidth()
    const preScale = scaleX/background.width;//原比例

    let afterScale = 0;

    if(type == 'In'){
        afterScale = preScale + 0.01;
    }
    else if(type == 'Out'){
        afterScale = preScale - 0.01;
    }


    afterScale = proportionLimit(afterScale,canvas.height/background.height,4*canvas.height/background.height)

    background.scale(afterScale);

    background.set('left',canvas.width/2 - (canvas.width/2 - background.getX()) * afterScale/preScale);
    background.set('top', canvas.height/2 -(canvas.height/2 - background.getY()) * afterScale/preScale);

    canvas.renderAll()
}

</script>

<style scoped>
.resize_button{
    z-index: 5;
    position: absolute;
    left: 75%;
    top: 12px;
}
.zoomin_button{
    z-index: 5;
    position: absolute;
    left: 80%;
    top: 12px;
}
.zoomout_button{
    z-index: 5;
    position: absolute;
    left: 85%;
    top: 12px;
}
</style>
