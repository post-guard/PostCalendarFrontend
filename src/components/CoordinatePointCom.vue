<template>
    <div ref="popoverDom" @contextmenu.prevent>
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
              <a-radio-group v-model:value="placeTyperef"
              style="z-index: 6">
                  <a-radio :value="1">建筑物</a-radio>
                  <a-radio :value="2">十字路口</a-radio>
              </a-radio-group>
          </p>

          <p>X : {{positionX}}</p>
          <p>Y : {{positionY}}</p>

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


const props = defineProps<{

      positionX:number,
      positionY:number,
      name:string,
      placeType:number,

}>()

defineExpose({updatePos});

const emit = defineEmits<{
    (event:'deletePoint',val: {x:number,y:number}):void;
    (event:'checkoutPoint',val: {
        name:string,
        x:number,
        y:number,
        placeType:number
    }):void;
}>();


const pointName = ref(props.name)
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

const placeTyperef = ref(props.placeType)

const iconColor = ref("#ff0040")

function updatePos(x:number,y:number,scale:number){

    if(popoverDom.value!=undefined){

        popoverDom.value.style.position = "absolute"

        const leftPos = x + props.positionX * scale - 20;
        const topPos = y + props.positionY * scale - 20;

        popoverDom.value.style.left = leftPos + "px"
        popoverDom.value.style.top = topPos + "px"
        /*坐标点 = 地图的全局left(即x)或全局top(即y) + 在原始地图图片上坐标*地图缩放尺寸
                  - dom长度(40)的一半(20)*/

        if(leftPos+20 >= window.innerWidth-20 || topPos+20 >= window.innerHeight-20){
            popoverDom.value.style.display = "none";
        }
        else {
            popoverDom.value.style.display = "inline";
        }//超出窗口范围隐藏

    }

    pointName.value = props.name
    placeTyperef.value = props.placeType

    //todo:这里要考虑加入对颜色的修改
}


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
