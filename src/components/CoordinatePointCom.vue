<template>
    <div ref="popoverDom"
         @contextmenu.prevent
         @mousedown="e=>rightMouseDown(e)"
         @mouseup="e=>rightMouseUp(e)">
  <a-popover title="" v-model:visible="popoverVisible">

      <template #content>
          <p></p>
          <p>
          <a-input size="middle"
                   v-model:value="pointName"
                   placeholder="地点名称">
          </a-input>
          </p>

          <p>
              <a-radio-group v-model:value="placeTypeRef"
              style="z-index: 6">
                  <a-radio :value="1">建筑物</a-radio>
                  <a-radio :value="2">十字路口</a-radio>
              </a-radio-group>
          </p>

          <p>X : {{positionX}}</p>
          <p>Y : {{positionY}}</p>
          <p>id : {{id}}</p>

          <p>
              <a-button size="middle"
                        style="width: 50%"
                        :disabled = "checkoutButton"
                        @click="checkoutPoint"
              >
                  <template #icon>
                      <CheckOutlined/>
                  </template>
              </a-button>

              <a-button danger
                        size="middle"
                        style="width: 50%"
                        @click="deletePoint"
              >
                  <template #icon>
                      <CloseOutlined/>
                  </template>
              </a-button>

          </p>



      </template>


    <a-button type="link" size="large">
      <template #icon>
          <EnvironmentTwoTone v-model:two-tone-color="iconColor" />
      </template>
    </a-button>
  </a-popover>
  </div>
</template>

<script setup lang="ts">

import {EnvironmentTwoTone,CheckOutlined,CloseOutlined} from "@ant-design/icons-vue";
import {computed,ref} from "vue";

import { Request } from "@/utils/Request"
import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import {message} from "ant-design-vue";
import type {IMapPoint} from "@/models/IMapPoint";

const props = defineProps<{

      positionX:number,
      positionY:number,
      name:string,
      placeType:number,
      id:number

}>()

defineExpose({updatePos});

const emit = defineEmits<{
    (event:'deletePoint',val: {x:number,y:number}):void;
    (event:'checkoutPoint',val: {
        name:string,
        x:number,
        y:number,
        placeType:number,
        id:number
    }):void;
    (event:'rightMouseDown',val: {
        x:number,y:number,rx:number,ry:number
    }):void;
    (event:'rightMouseUp',val: {
        x:number,y:number,rx:number,ry:number
    }):void;

}>();


const pointName = ref(props.name)
const pointId = ref(-1)

const request = new Request();


/**
 * 根据输入框中是否有内容来调整按钮和颜色状态
 */
const checkoutButton = computed(()=>{
    if(pointName.value === ''){
        iconColor.value="#ff0040";
    }
    else{
        iconColor.value="#1890ff";
    }
    return pointName.value === '';
})

const popoverDom = ref<HTMLDivElement>()

const popoverVisible = ref (false)

const placeTypeRef = ref(props.placeType)

const iconColor = ref("#ff0040")


function init(){
    if(pointName.value === ''){
        iconColor.value="#ff0040";
    }
    else{
        iconColor.value="#1890ff";
    }
}
init();

/**
 * 更新组件位置的函数
 * @param x
 * @param y
 * @param scale 当前地图的尺寸
 */
function updatePos(x:number,y:number,scale:number){

    if(popoverDom.value!=undefined){

        popoverDom.value.style.position = "absolute"

        const leftPos = x + props.positionX * scale - 20;
        const topPos = y + props.positionY * scale - 20;

        popoverDom.value.style.left = leftPos + "px"
        popoverDom.value.style.top = topPos + "px"
        /*坐标点 = 地图的全局left(即x)或全局top(即y) + 在原始地图图片上坐标*地图缩放尺寸
                  - dom长度(40)的一半(20)*/
        //console.log(popoverDom.value?.style.left);
        //console.log(popoverDom.value?.style.top);

        if(leftPos+20 >= window.innerWidth-20 || topPos+20 >= window.innerHeight-20){
            popoverDom.value.style.display = "none";
        }
        else {
            popoverDom.value.style.display = "inline";
        }//超出窗口范围隐藏

    }

    pointName.value = props.name
    placeTypeRef.value = props.placeType



}

/**
 * 点击确认按钮事件
 */
async function checkoutPoint(){
    /*
    发送到后端，获取id
    如果存在对应id，为改变数值
    如果不存在，赋值id
     */
    if(props.id==-1){ //该点没有在数据库中
        try {
            const response =  await request.post<IMapPoint>("/postcalendarapi/place/", {

                "name": pointName.value,
                "x": props.positionX,
                "y": props.positionY,
                "placeType": placeTypeRef.value,

            });

            //console.log(response);
            message.success("添加地点成功");

            pointId.value = response.data.id;

        }catch (err){
            const axiosError = err as AxiosError<IResponse<IMapPoint>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {


                message.error("添加地点失败");
            }
        }
    }
    else{ //该点在数据库中
        try {
            const response =  await request.put<null>("/postcalendarapi/place/"+props.id, {

                "name": pointName.value,
                "x": props.positionX,
                "y": props.positionY,
                "placeType": placeTypeRef.value,
                "id": props.id

            });

            //console.log(response.message);
            message.success("修改地点成功");

        }catch (err){
            const axiosError = err as AxiosError<IResponse<null>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                let errorMessage = "修改地点失败";
                message.error(errorMessage);
            }
        }
    }



    if(pointName.value!==''){

        iconColor.value = "#1890ff";


        emit('checkoutPoint',
            {name:pointName.value,
                x:props.positionX,
                y:props.positionY,
                placeType:placeTypeRef.value,
                id:pointId.value})
    }
    else {



        iconColor.value = "#ff0040";
    }



    popoverVisible.value = false;
}

/**
 * 点击删除按钮事件
 */
async function deletePoint(){
    /*
    如果id为-1,说明后端还没有接收,直接在这里删除
    如果id不为-1，向后端发送删除信息，同时前端进行删除
     */
    if(props.id!=-1){//该点在数据库中,向后端发送删除请求
        try {
            const response =  await request.delete<any>("/postcalendarapi/place/"+props.id);

            //console.log(response);
            message.success("删除地点成功");


        }catch (err){
            const axiosError = err as AxiosError<IResponse<any>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {


                message.error("删除地点失败");
            }
        }
    }


    const emitVal = {x:props.positionX,y:props.positionY};
    emit('deletePoint',emitVal)
    popoverVisible.value = false;
}

/**
 * 监测鼠标右键是否在自己身上按下
 */
function rightMouseDown(event:any){

    if(event.button==2) {

        //console.log("Start:");
        //console.log(props);

        if (popoverDom.value != undefined) {

            //iconColor.value="#27ff00"

            const rx = parseFloat(popoverDom.value.style.left);
            const ry = parseFloat(popoverDom.value.style.top);


            const emitVal = {x: props.positionX, y: props.positionY, rx: rx + 20, ry: ry + 20};

            emit('rightMouseDown', emitVal);
        }
    }
}

function rightMouseUp(event:any){
    if(event.button==2){//右键在自己身上松开
        //console.log("End:");
        //console.log(props);

        if(popoverDom.value!=undefined) {

            const rx = parseFloat(popoverDom.value.style.left);
            const ry = parseFloat(popoverDom.value.style.top);


            const emitVal = {x: props.positionX, y: props.positionY,rx:rx+20,ry:ry+20};

            emit('rightMouseUp', emitVal);

        }
    }
}

</script>

<style scoped>

</style>
