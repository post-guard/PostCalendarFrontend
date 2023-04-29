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

        canvas.add(background);


        background.on('mousewheel',e=>zoom(e,canvas,background));

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



    if(canvas!=undefined){

        console.log(event.e.deltaY)

        if(event.e.deltaY<0){
            console.log("j")
            const scaleX = background.getScaledWidth()
            const preScale = scaleX/background.width;



            background.scale(preScale-0.1);
            //background.set('scale',preScale-0.1)
            canvas.renderAll()
        }
        else if(event.e.deltaY>0){
            const scaleX = background.getScaledWidth()
            const preScale = scaleX/background.width;

            background.scale(preScale+0.1);
            //background.set('scale',preScale+0.1)
            canvas.renderAll()
        }
    }

}


</script>

<style scoped>

</style>
