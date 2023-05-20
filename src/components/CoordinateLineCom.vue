<template>
    <div ref="popoverDom"
         @contextmenu.prevent
         >
  <a-popover title="" v-model:visible="popoverVisible">

      <template #content>
          <p></p>
          <p>
          <a-input size="middle"
                   v-model:value="lineName"
                   placeholder="道路名称">
          </a-input>
          </p>



          <p>Start : {{startPointId}}</p>
          <p>End : {{endPointId}}</p>
          <p>Length : {{length}}</p>
          <p>Id : {{id}}</p>

          <p>
              <a-button size="middle"
                        style="width: 50%"
                        :disabled = "checkoutButton"
                        @click="checkoutLine"
              >
                  <template #icon>
                      <CheckOutlined/>
                  </template>
              </a-button>

              <a-button danger
                        size="middle"
                        style="width: 50%"
                        @click="deleteLine"
              >
                  <template #icon>
                      <CloseOutlined/>
                  </template>
              </a-button>

          </p>



      </template>


    <a-button block size="small" type="text" style="opacity: 0">
        .
    </a-button>
  </a-popover>
  </div>
</template>

<script setup lang="ts">

import {CheckOutlined,CloseOutlined} from "@ant-design/icons-vue";
import {computed,ref} from "vue";
import {getAngle} from "@/models/MathMethods";
import {message} from "ant-design-vue";
import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import {Request} from "@/utils/Request";
import type {IMapRoad} from "@/models/IMapRoad";


const props = defineProps<{

    startPointId:number;

    endPointId:number;

    name:string;

    length:number;

    id:number

}>()

const lineName = ref(props.name)
const lineId = ref(-1)
const startPointId = ref(props.startPointId)
const endPointId = ref(props.endPointId)
const request= new Request();


defineExpose({updateStatus,
    startPointId,endPointId //ref类型在父组件会被自动解包，不需要使用.value
    });

const emit = defineEmits<{
    (event:'deleteLine',val: {startPointId:number; endPointId:number}):void;
    (event:'checkoutLine',val: {
        startPointId:number;

        endPointId:number;

        name:string;

        length:number;

        id:number
    }):void;


}>();




const checkoutButton = computed(()=>{

    return lineName.value === '';
})

const popoverDom = ref<HTMLDivElement>()

const popoverVisible = ref (false)



/**
 * 更新组件位置的函数
 * @param startPoint
 * @param endPoint
 * @param scale 当前地图的尺寸
 * @param offsetX
 * @param offsetY
 */
function updateStatus(startPoint: { x:number,y:number },endPoint:{ x:number,y:number },scale:number,offsetX:number,offsetY:number){

    if(popoverDom.value!=undefined){

        popoverDom.value.style.position = "absolute"

        let leftPos,topPos,rot;


        if(startPoint.x<endPoint.x){
            rot = getAngle(startPoint,endPoint);
            leftPos = offsetX + startPoint.x * scale
            topPos = offsetY + startPoint.y * scale - 6 / 2

        }
        else {
            rot = getAngle(endPoint,startPoint);
            leftPos = offsetX + endPoint.x * scale
            topPos = offsetY + endPoint.y * scale - 6 / 2

        }


        popoverDom.value.style.left = leftPos + "px"
        popoverDom.value.style.top = topPos + "px"
        popoverDom.value.style.transform = "rotate("+rot+"deg)";
        popoverDom.value.style.transformOrigin="0 3px";
        popoverDom.value.style.width = props.length*scale+"px";
        popoverDom.value.style.height = 6+"px";

        //console.log(popoverDom.value?.style.left);
        //console.log(popoverDom.value?.style.top);



    }

    lineName.value = props.name

}

/**
 * 点击确认按钮事件
 */
async function checkoutLine(){
    /*
    发送到后端，获取id
    如果存在对应id，为改变数值
    如果不存在，赋值id
     */

    if(props.id==-1){ //该路没有在数据库中
        try {
            const response =  await request.post<IMapRoad>("/postcalendarapi/road/", {

                "name": lineName.value,
                "startPlaceId": props.startPointId,
                "endPlaceId": props.endPointId,
                "length": props.length,

            });

            //console.log(response);
            message.success("添加道路成功");

            lineId.value = response.data.id;

        }catch (err){
            const axiosError = err as AxiosError<IResponse<IMapRoad>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {


                message.error("添加道路失败");
            }
        }
    }
    else{ //该路在数据库中
        try {
            const response =  await request.put<null>("/postcalendarapi/road/"+props.id, {

                "name": lineName.value,
                "startPlaceId": props.startPointId,
                "endPlaceId": props.endPointId,
                "length": props.length,
                "id": props.id

            });

            message.success("修改道路成功");

        }catch (err){
            const axiosError = err as AxiosError<IResponse<null>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {

                let errorMessage = "修改道路失败";
                message.error(errorMessage);
            }
        }
    }



    if(lineName.value!==''){


        emit('checkoutLine',
            {name:lineName.value,
                startPointId:props.startPointId,
                endPointId:props.endPointId,
                length:props.length,
                id:lineId.value});
    }




    popoverVisible.value = false;
}

/**
 * 点击删除按钮事件
 */
async function deleteLine(){
    /*
    如果id为-1,说明后端还没有接收,直接在这里删除
    如果id不为-1，向后端发送删除信息，同时前端进行删除
     */

    if(props.id!=-1){//该点在数据库中,向后端发送删除请求
        try {
            const response =  await request.delete<any>("/postcalendarapi/road/"+props.id);

            //console.log(response);
            message.success("删除道路成功");


        }catch (err){
            const axiosError = err as AxiosError<IResponse<any>>;
            if (axiosError.response?.status != undefined &&
                axiosError.response.status >= 400 && axiosError.response.status < 500) {


                message.error("删除道路失败");
            }
        }
    }


    const emitVal = {startPointId:props.startPointId,endPointId:props.endPointId};
    emit('deleteLine',emitVal)
    popoverVisible.value = false;
}



</script>

<style scoped>

</style>
