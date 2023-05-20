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
                                :id=value.id
                                :ref="setPointRef"

                                @deletePoint="deletePoint"
                                @checkoutPoint="checkoutPoint"
                                @rightMouseDown="addLineStart"
                                @rightMouseUp="addLineEnd"

                                style="z-index: 2;">

            </CoordinatePointCom>
        </div>
    </div>


    <div class="coordinateLines">

        <div v-for="value in coordinate_line_list">

            <CoordinateLineCom  :start-point-id=value.startPointId
                                :end-point-id=value.endPointId
                                :name=value.name
                                :id=value.id
                                :length=value.length
                                :ref="setLineRef"

                                @deleteLine="deleteLine"
                                @checkoutLine="checkoutLine"

                                style="z-index: 1;">

            </CoordinateLineCom>
        </div>
    </div>
</template>

<script setup lang="ts">
import {Canvas, Image, Line} from "fabric";
import { onBeforeUpdate, onMounted, reactive, ref} from "vue";
import { ReloadOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons-vue";
import CoordinatePointCom from '@/components/CoordinatePointCom.vue';
import { CoordinatePoint } from "@/models/CoordinatePoint";
import type {IMapPoint} from "@/models/IMapPoint";
import {message} from "ant-design-vue";
import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import { Request } from "@/utils/Request"
import {CoordinateLine} from "@/models/CoordinateLine";
import CoordinateLineCom from "@/components/CoordinateLineCom.vue";
import {getAngle, getLength} from "@/models/MathMethods";
import type {IMapRoad} from "@/models/IMapRoad";
import type {IMapNavigation} from "@/models/IMapNavigation";


const request = new Request();

const map = ref<HTMLCanvasElement>();

const outsize_canvas = ref();
const outsize_background = ref();



const coordinate_point_list: CoordinatePoint[] = reactive([]);
//谢谢你,reactive

let coordinate_point_list_ref: CoordinatePointCom [] = reactive([]);


const coordinate_line_list:CoordinateLine[] = reactive([]);

let coordinate_line_list_ref:CoordinateLineCom [] = reactive([]);

const lineSamplePos = ref<{start:{pos:{x:number,y:number},id:number},
                            end:{pos:{x:number,y:number},id:number}}>
                            ({start:{pos:{x:-1,y:-1},id:-1},end:{pos:{x:-1,y:-1},id:-1}});

onBeforeUpdate(async() => {
    coordinate_point_list_ref = [];
    coordinate_line_list_ref = [];
})


onMounted(async () => {

    if (map.value != undefined) {


        map.value.width = document.getElementsByClassName('ant-layout-content')[0].clientWidth
        map.value.height = document.getElementsByClassName('ant-layout-content')[0].clientHeight






        const canvas = new Canvas(map.value);
        canvas.stopContextMenu = true;
        canvas.fireRightClick = true;
        canvas.preserveObjectStacking = true;



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

        background.on('mousedown',e=>resetLineSamplePos(e));
        background.on('mouseup',e=>resetLineSamplePos(e));


        outsize_canvas.value = canvas
        outsize_background.value = background

        //background.on('mousewheel', e => updatePoints());
        //background.on('mousedblclick', e => updatePoints());
        background.on('moving', e => updatePoints());
        background.on('moving', e => updateLines());


        try {
            const response =  await request.get<IMapPoint[]>("/postcalendarapi/place/");


            message.success("获取地点列表成功");
            for(let pointAlready of response.data){
                const point = new CoordinatePoint(pointAlready.x, pointAlready.y, pointAlready.name, pointAlready.placeType);
                point.id = pointAlready.id;
                coordinate_point_list.push(point);
            }

        }catch (err){
            const axiosError = err as AxiosError<IResponse<IMapPoint[]>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                let errorMessage = "获取地点列表失败";
                message.error(errorMessage);
            }
        }



        try {
            const response =  await request.get<IMapRoad[]>("/postcalendarapi/road/");

            //console.log(response);
            message.success("获取道路列表成功");
            for(let lineAlready of response.data){



                const rot = getAngle({x:0,y:0},{x:1,y:1});
                const width = 6;


                const lineToPaint = new Line(
                    [0, 0, 1, 1],
                    {
                        fill:"#62dfff",
                        stroke:"#00e7ff",
                        strokeWidth:6,
                        hasBorders :false,
                        perPixelTargetFind:false,
                        hasControls :false,
                        hasRotatingPoint: false,
                        selectable:false
                    });

                canvas.add(lineToPaint);


                const line = new CoordinateLine(lineAlready.startPlaceId, lineAlready.endPlaceId, lineAlready.name, lineAlready.length,lineToPaint);
                line.id = lineAlready.id;
                coordinate_line_list.push(line);
            }

            updateLines();

        }catch (err){
            const axiosError = err as AxiosError<IResponse<IMapPoint[]>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                let errorMessage = "获取道路列表失败";
                message.error(errorMessage);
            }
        }


        await navigationComplex([19,32,34,37]);

    }
})



function setPointRef(el: CoordinatePointCom|undefined) {

    if (el) {
        coordinate_point_list_ref.push(el)
        updatePoints();

    }

}

function setLineRef(el: CoordinateLineCom|undefined) {

    if (el) {
        coordinate_line_list_ref.push(el)
        updateLines();

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

    canvas.renderAll();

    updatePoints();
    updateLines();
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


    //灵异事件:需要重复一次才能在复位后正常拖动缩放地图,怀疑是焦点问题但懒得解决
    //灵异事件：这个bug现在不能复现了，恢复为只设置一次
    // 灵异事件：这个bug在寝室复现了
    // 灵异事件结束了
    //戳了,灵异事件继续!
    updatePoints();
    updateLines();

    outsize_canvas.value.renderAll()
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


    updatePoints();
    updateLines();

    canvas.renderAll();
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


function updateLines() {


    const leftSum = outsize_canvas.value._offset.left+ outsize_background.value.left
    const topSum = outsize_canvas.value._offset.top+ outsize_background.value.top

    const scaleX = outsize_background.value.getScaledWidth()
    const scale = scaleX / outsize_background.value.width;//原比例

    for(let line of coordinate_line_list){

        let startPointPos,endPointPos;

        for(let start of coordinate_point_list){
            if(line.startPointId==start.id){
                startPointPos = {x:start.positionX,y:start.positionY}
                break;
            }
        }
        for(let end of coordinate_point_list){
            if(line.endPointId==end.id){
                endPointPos = {x:end.positionX,y:end.positionY}
                break;
            }
        }


        if(startPointPos!=undefined && endPointPos !=undefined) {
            const startPointCurrentPosX = outsize_background.value.left+startPointPos.x* scale;
            const startPointCurrentPosY = outsize_background.value.top+startPointPos.y* scale;
            const endPointCurrentPosX = outsize_background.value.left+endPointPos.x* scale;
            const endPointCurrentPosY = outsize_background.value.top+endPointPos.y* scale;

            line.react_image.set({"x1":startPointCurrentPosX,"y1":startPointCurrentPosY,
                                  "x2":endPointCurrentPosX,"y2":endPointCurrentPosY,
                "length":getLength({x:startPointCurrentPosX,y:startPointCurrentPosY},
                    {x:endPointCurrentPosX,y:endPointCurrentPosY})
            })
        }
    }


    for (let line of coordinate_line_list_ref) {

        let startPointPos,endPointPos;

        for(let start of coordinate_point_list){
            if(line.startPointId==start.id){
                startPointPos = {x:start.positionX,y:start.positionY}
                break;
            }
        }
        for(let end of coordinate_point_list){
            if(line.endPointId==end.id){
                endPointPos = {x:end.positionX,y:end.positionY}
                break;
            }
        }

        if(startPointPos!=undefined && endPointPos !=undefined){
            line.updateStatus(startPointPos,endPointPos,scale,leftSum,topSum);
        }

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
            const lineToDelete : number[] = [];
            //如果这个点还绑定了线，把这条线也删除
            for(let line of coordinate_line_list){
                if(line.startPointId==point.id||line.endPointId==point.id){
                    if(line.id!=-1)//数据库中有线
                    {
                        lineToDelete.push(line.id);

                    }

                }
            }

            console.log(lineToDelete);
            for(let lineId of lineToDelete){
                try {
                    const response =  request.delete<any>("/postcalendarapi/road/"+lineId);

                    //console.log(response);
                    message.success("删除道路成功");


                }catch (err){
                    const axiosError = err as AxiosError<IResponse<any>>;
                    if (axiosError.response?.status != undefined &&
                        axiosError.response.status >= 400 && axiosError.response.status < 500) {


                        message.error("删除道路失败");
                    }
                }
                for(let line of coordinate_line_list){

                    if(line.id == lineId){
                        let index = coordinate_line_list.indexOf(line);
                        if(index!=-1){
                            outsize_canvas.value.remove(line.react_image);
                            coordinate_line_list.splice(index,1);
                        }
                    }
                }
            }

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
                                placeType:number,
                                id:number
                                }){


    for(let point of coordinate_point_list){
        if(point.positionX == val.x && point.positionY == val.y){

            point.name = val.name;
            point.placeType = val.placeType;
            point.id = val.id;
        }
    }

}

/*
解释一下加线的行为逻辑，以便理解
1.给点的组件添加鼠标右键按下和松开的事件，一旦触发，就会返回编辑器这个点的绝对坐标和相对坐标
2.那么，现在在A点按下右键，鼠标保持按下状态移动到B点上，再松开，就会触发A点的按下事件和B点的松开事件
3.此时，会给编辑器的lineSamplePos{start,end}分别附上起点和终点的坐标
4.同时，在松开的处理函数中会根据lineSamplePos{start,end}生成线
 */
function addLineStart(val:{x:number,y:number,rx:number,ry:number}){
    const background = outsize_background.value
    const canvas = outsize_canvas.value



    let pointStart:CoordinatePoint|undefined;


    let pointStartPos = {x : 0, y : 0};



    for(let point of coordinate_point_list){
        if(val.x==point.positionX && val.y==point.positionY){
            if(point.id!=-1){
                    pointStart = point;//找到坐标点列表中的这个坐标点
                    lineSamplePos.value.start.id = pointStart.id
                    break;
            }
        }
    }

    pointStartPos.x = val.rx - canvas._offset.left;
    pointStartPos.y = val.ry -  canvas._offset.top;

    lineSamplePos.value.start.pos = pointStartPos;



}



function addLineEnd(val:{x:number,y:number,rx:number,ry:number}){
    const background = outsize_background.value
    const canvas = outsize_canvas.value


    let pointEndPos = {x : 0, y : 0};



    pointEndPos.x = val.rx - canvas._offset.left;
    pointEndPos.y = val.ry -  canvas._offset.top;

    if(lineSamplePos.value.start.pos!==pointEndPos){//不是同一个点作为起点和终点
        lineSamplePos.value.end.pos = pointEndPos;

        if(lineSamplePos.value.start.pos.x!=-1 && lineSamplePos.value.start.pos.y!=-1){


            const rot = getAngle(lineSamplePos.value.start.pos,lineSamplePos.value.end.pos);
            const width = 6;
            //const length = getLength(lineSamplePos.value.start.pos,lineSamplePos.value.end.pos);

            const line = new Line(
                [lineSamplePos.value.start.pos.x - width/2 * Math.sin(rot),
                        lineSamplePos.value.start.pos.y + width/2 * Math.cos(rot),
                        lineSamplePos.value.end.pos.x - width/2 * Math.sin(rot),
                        lineSamplePos.value.end.pos.y + width/2 * Math.cos(rot)],
                {
                    fill:"#62dfff",
                    stroke:"#00e7ff",
                    strokeWidth:6,
                    hasBorders :false,
                    perPixelTargetFind:false,
                    hasControls :false,
                    hasRotatingPoint: false,
                    selectable:false
                });

            canvas.add(line);



            let pointStart,pointEnd:CoordinatePoint|undefined;

            for(let point of coordinate_point_list){
                if(lineSamplePos.value.start.id == point.id){
                    if(point.id!=-1){
                        pointStart = point;//找到坐标点列表中的起始坐标点
                        break;
                    }
                }
            }

            for(let point of coordinate_point_list){
                if(val.x==point.positionX && val.y==point.positionY){
                    if(point.id!=-1){
                        pointEnd = point;//找到坐标点列表中的终止坐标点
                        lineSamplePos.value.end.id = point.id;
                        break;
                    }
                }
            }
            let length;
            if(pointStart!=undefined && pointEnd!=undefined){
                length = getLength({x:pointStart.positionX,y:pointStart.positionY},
                    {x:pointEnd.positionX,y:pointEnd.positionY});
            }



            if(lineSamplePos.value.start.id!=-1 && lineSamplePos.value.end.id!=-1 && length!=undefined){
                console.log("hi")
                const coordinate_line = new CoordinateLine(lineSamplePos.value.start.id,
                    lineSamplePos.value.end.id,'',length,line);

                coordinate_line_list.push(coordinate_line);
                //console.log(coordinate_line_list);
            }


        }
        /*这样做排除以下几种误操作：
        1.在地图外按下右键，在地图内的组件上松开
        2.在地图内的组件上按下右键，在地图外松开

        但是，当先做2再做1时，就会发生bug，导致两个点意外用线连起来
        然而我相信使用者应该不会引出这种问题,所以暂不解决
         */

    }

}

/**
 * 鼠标右键一旦在地图空白处放开，就会触发该函数重置lineSamplePos
 * @param event
 */
function resetLineSamplePos(event:any){

    if(event.e.button==2){
        lineSamplePos.value.start={pos:{x:-1,y:-1},id:-1};
        lineSamplePos.value.end={pos:{x:-1,y:-1},id:-1};
    }
}


function deleteLine(val:{
    startPointId:number,
    endPointId:number
}){
    for(let line of coordinate_line_list){
        if(line.startPointId == val.startPointId && line.endPointId == val.endPointId){


            let index = coordinate_line_list.indexOf(line);
            if(index!=-1){
                coordinate_line_list.splice(index,1)
                outsize_canvas.value.remove(line.react_image);
            }
        }
    }
}

function checkoutLine(val: {

    name:string,
    startPointId:number,
    endPointId:number,
    length:number,
    id:number
}){


    for(let line of coordinate_line_list){
        if(line.startPointId == val.startPointId && line.endPointId == val.endPointId){

            line.name = val.name;

            line.id = val.id;
        }
    }

}



async function navigationOneDest(startPointId:number,endPointId:number){
    try {

        for(let line of coordinate_line_list){
                line.react_image.set({"stroke":"#00e7ff"});
                line.react_image.set({"fill":"#62dfff"});
        }


        const response =  await request.get<IMapNavigation>(
            `/postcalendarapi/navigation/oneDestination?startPlaceId=${startPointId}&endPlaceId=${endPointId}`);


        message.success("添加导航成功");
        console.log(startPointId,endPointId);
        console.log(response.data);

        for(let lineRes of response.data.roads){


            for(let line of coordinate_line_list){


                if(line.id==lineRes.id){

                    line.react_image.set({"stroke":"#30ff37"});
                    line.react_image.set({"fill":"#a9ffb6"});

                }
            }

        }
            outsize_canvas.value.renderAll();


    }catch (err){
        const axiosError = err as AxiosError<IResponse<IMapRoad>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {


            message.error("添加导航失败");
        }
    }
}



async function navigationComplex(pointIdList:number[]){
    try {

        for(let line of coordinate_line_list){
            line.react_image.set({"stroke":"#00e7ff"});
            line.react_image.set({"fill":"#62dfff"});
        }


        const response =  await request.post<IMapNavigation>(
            "/postcalendarapi/navigation/manyDestination",pointIdList);


        message.success("多点导航成功");


        for(let lineRes of response.data.roads){


            for(let line of coordinate_line_list){


                if(line.id==lineRes.id){

                    line.react_image.set({"stroke":"#30ff37"});
                    line.react_image.set({"fill":"#a9ffb6"});

                }
            }

        }
        outsize_canvas.value.renderAll();


    }catch (err){
        const axiosError = err as AxiosError<IResponse<IMapRoad>>;
        if (axiosError.response?.status != undefined &&
            axiosError.response.status >= 400 && axiosError.response.status < 500) {


            message.error("多点导航失败");
        }
    }
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
