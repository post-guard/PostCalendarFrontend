<template>
    <a-button class="resize_button" shape="circle" size="large" @click="buttonResize">
        <template #icon>
            <ReloadOutlined />
        </template>
    </a-button>

    <a-button class="zoomin_button" shape="circle" size="large" @click="buttonZoom('In')">
        <template #icon>
            <ZoomInOutlined />
        </template>
    </a-button>

    <a-button class="zoomout_button" shape="circle" size="large" @click="buttonZoom('Out')">
        <template #icon>
            <ZoomOutOutlined />
        </template>
    </a-button>

    <canvas ref="map">
        你的浏览器不支持canvas，请升级浏览器版本~
    </canvas>

    <div class="coordinatePoints">

        <div v-for="value in coordinate_point_list">

            <CoordinatePointCom :position-x=value.positionX
                                :position-y=value.positionY
                                :name=value.name
                                :place-type=value.placeType
                                :ref="setPointRef"

                                @deletePoint="deletePoint"
                                @checkoutPoint="checkoutPoint"

                                style="z-index: 1;">

            </CoordinatePointCom>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Canvas, Image} from "fabric";
import { onBeforeUpdate, onMounted, reactive, ref} from "vue";
import { ReloadOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons-vue";
import CoordinatePointCom from '@/components/CoordinatePointCom.vue';
import { CoordinatePoint } from "@/models/CoordinatePoint";



const map = ref<HTMLCanvasElement>();

const outsize_canvas = ref();
const outsize_background = ref();



const coordinate_point_list: CoordinatePoint[] = reactive([]);
//谢谢你,reactive

let coordinate_point_list_ref: CoordinatePointCom [] = reactive([]);

onBeforeUpdate(async() => {
    coordinate_point_list_ref = [];
})


onMounted(async () => {

    if (map.value != undefined) {


        map.value.width = document.getElementsByClassName('ant-layout-content')[0].clientWidth
        map.value.height = document.getElementsByClassName('ant-layout-content')[0].clientHeight


        const canvas = new Canvas(map.value);
        canvas.stopContextMenu = true




        const background = await Image.fromURL("xtcmap.jpg");

        background.scale(canvas.height / background.height);
        background.selectable = true;
        background.hasControls = false;
        background.hasBorders = true;
        background.lockRotation = true;
        background.left = Math.abs(canvas.width - background.getScaledWidth()) / 2;



        canvas.add(background);

        background.on('mousewheel', e => zoom(e, canvas, background));

        background.on('mousedblclick', e => addPoint(e));


        outsize_canvas.value = canvas
        outsize_background.value = background

        //background.on('mousewheel', e => updatePoints());
        //background.on('mousedblclick', e => updatePoints());
        background.on('moving', e => updatePoints());

    }
})



function setPointRef(el: CoordinatePointCom|undefined) {

    if (el) {
        coordinate_point_list_ref.push(el)
        updatePoints();

    }

}


/**
 * 地图缩放功能
 * @param event 鼠标点击事件
 * @param canvas 画布对象
 * @param background 地图图片对象
 */
function zoom(event: any, canvas: Canvas, background: Image) {


    const scaleX = background.getScaledWidth()
    const preScale = scaleX / background.width;//原比例
    let afterScale = 0;


    if (event.e.deltaY > 0) {

        afterScale = preScale - 0.01;

    }
    else if (event.e.deltaY < 0) {

        afterScale = preScale + 0.01;

    }

    afterScale = proportionLimit(afterScale, canvas.height / background.height, 4 * canvas.height / background.height)
    //这两串神奇的数字问就是手算的
    background.scale(afterScale);


    background.set('left', event.e.offsetX - (event.e.offsetX - background.getX()) * afterScale / preScale);
    background.set('top', event.e.offsetY - (event.e.offsetY - background.getY()) * afterScale / preScale);

    canvas.renderAll()

    updatePoints()
}

/**
 * 范围限制函数
 * @param value 要限制的值
 * @param min 最小值
 * @param max 最大值
 * @return 若value在min与max之间，则传回原值，否则传回最小值或最大值
 */
function proportionLimit(value: number, min: number, max: number): number {

    if (value > max) {
        value = max;
    }
    else if (value < min) {
        value = min;
    }
    else {

    }
    return value;
}


/**
 * 复位按钮点击触发函数
 */
function buttonResize() {
    outsize_background.value.left = Math.abs(outsize_canvas.value.width - outsize_background.value.getScaledWidth()) / 2;
    outsize_background.value.top = 0;
    outsize_background.value.scale(outsize_canvas.value.height / outsize_background.value.height);

    outsize_background.value.left = Math.abs(outsize_canvas.value.width - outsize_background.value.getScaledWidth()) / 2;
    outsize_background.value.top = 0;

    outsize_canvas.value.renderAll()
    //灵异事件:需要重复一次才能在复位后正常拖动缩放地图,怀疑是焦点问题但懒得解决
    //灵异事件：这个bug现在不能复现了，恢复为只设置一次
    // 灵异事件：这个bug在寝室复现了
    // 灵异事件结束了
    //戳了,灵异事件继续!
    updatePoints();
}

/**
 * 缩放按钮点击触发函数
 * @param type 'In'-放大
 * @param type 'Out'-缩小
 */
function buttonZoom(type: string) {

    const background = outsize_background.value
    const canvas = outsize_canvas.value


    const scaleX = background.getScaledWidth()
    const preScale = scaleX / background.width;//原比例

    let afterScale = 0;

    if (type == 'In') {
        afterScale = preScale + 0.01;
    }
    else if (type == 'Out') {
        afterScale = preScale - 0.01;
    }


    afterScale = proportionLimit(afterScale, canvas.height / background.height, 4 * canvas.height / background.height)

    background.scale(afterScale);

    background.set('left', canvas.width / 2 - (canvas.width / 2 - background.getX()) * afterScale / preScale);
    background.set('top', canvas.height / 2 - (canvas.height / 2 - background.getY()) * afterScale / preScale);

    canvas.renderAll();

    updatePoints();
}

/**
 * 更新当前的坐标点组件列表
 */
function updatePoints() {


    const leftSum = outsize_canvas.value._offset.left+ outsize_background.value.left
    const topSum = outsize_canvas.value._offset.top+ outsize_background.value.top

    const scaleX = outsize_background.value.getScaledWidth()
    const scale = scaleX / outsize_background.value.width;//原比例




        for (let point of coordinate_point_list_ref) {

            point.updatePos(leftSum,topSum,scale)

        }



}

/**
 * 添加坐标点功能
 * @param event 鼠标点击事件
 */
function addPoint(event: any) {

    const background = outsize_background.value
    const canvas = outsize_canvas.value


    let position = { x: 0, y: 0 }

    position.x = (event.e.offsetX - background.getX()) / (background.getObjectScaling().x)
    position.y = (event.e.offsetY - background.getY()) / (background.getObjectScaling().x)
    //获取鼠标双击的地图绝对坐标，不会因为尺寸和位置改变

    const point = new CoordinatePoint(position.x, position.y, '', 1);

    coordinate_point_list.push(point);


}


function deletePoint(val:{x:number,y:number}){


    for(let point of coordinate_point_list){
        if(point.positionX == val.x && point.positionY == val.y){

            let index = coordinate_point_list.indexOf(point);
            if(index!=-1){
                coordinate_point_list.splice(index,1)
            }
        }
    }



}

function checkoutPoint(val: { name:string,
                                x:number,
                                y:number,
                                placeType:number }){


    for(let point of coordinate_point_list){
        if(point.positionX == val.x && point.positionY == val.y){

            point.name = val.name;
            point.placeType = val.placeType;
        }
    }
    console.log(coordinate_point_list)
}
</script>

<style scoped>
.resize_button {
    z-index: 5;
    position: absolute;
    left: 80%;
    top: 74%;
}

.zoomin_button {
    z-index: 5;
    position: absolute;
    left: 80%;
    top: 80%;
}

.zoomout_button {
    z-index: 5;
    position: absolute;
    left: 80%;
    top: 86%;
}
</style>
