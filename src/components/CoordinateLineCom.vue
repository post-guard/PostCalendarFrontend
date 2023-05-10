<template>
    <div ref="popoverDom"
         @contextmenu.prevent
         >
  <a-popover title="" v-model:visible="popoverVisible">

      <template #content>
          <p></p>
          <p>
          <a-input size="middle"
                   v-model:value="LineName"
                   placeholder="道路名称">
          </a-input>
          </p>



          <p>X : {{positionX}}</p>
          <p>Y : {{positionY}}</p>

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


    <a-button >

    </a-button>
  </a-popover>
  </div>
</template>

<script setup lang="ts">

import {CheckOutlined,CloseOutlined} from "@ant-design/icons-vue";
import {computed,ref} from "vue";


const props = defineProps<{

    startPointId:number;

    endPointId:number;

    name:string;

    length:number;

    id:number

}>()

defineExpose({updatePos});

const emit = defineEmits<{
    (event:'deletePoint',val: {x:number,y:number}):void;
    (event:'checkoutPoint',val: {
        startPointId:number;

        endPointId:number;

        name:string;

        length:number;

        id:number
    }):void;


}>();


const LineName = ref(props.name)

/**
 * 根据输入框中是否有内容来调整按钮和颜色状态
 */
const checkoutButton = computed(()=>{
    if(LineName.value === ''){
        iconColor.value="#ff0040";
    }
    else{
        iconColor.value="#1890ff";
    }
    return LineName.value === '';
})

const popoverDom = ref<HTMLDivElement>()

const popoverVisible = ref (false)

const iconColor = ref("#ff0040")

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
        console.log(popoverDom.value?.style.left);
        console.log(popoverDom.value?.style.top);

        if(leftPos+20 >= window.innerWidth-20 || topPos+20 >= window.innerHeight-20){
            popoverDom.value.style.display = "none";
        }
        else {
            popoverDom.value.style.display = "inline";
        }//超出窗口范围隐藏

    }

    LineName.value = props.name



}

/**
 * 点击确认按钮事件
 */
function checkoutPoint(){
    /*
    发送到后端，获取id
    如果存在对应id，为改变数值
    如果不存在，赋值id
     */
    if(pointName.value!==''){

        iconColor.value = "#1890ff";


        emit('checkoutPoint',
            {name:pointName.value,
                x:props.positionX,
                y:props.positionY,
                placeType:placeTyperef.value})
    }
    else {



        iconColor.value = "#ff0040";
    }



    popoverVisible.value = false;
}

/**
 * 点击删除按钮事件
 */
function deletePoint(){
    /*
    如果id为-1,说明后端还没有接收,直接在这里删除
    如果id不为-1，向后端发送删除信息，同时前端进行删除
     */

    const emitVal = {x:props.positionX,y:props.positionY};
    emit('deletePoint',emitVal)
    popoverVisible.value = false;
}



</script>

<style scoped>

</style>
