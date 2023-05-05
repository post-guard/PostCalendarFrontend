<template>
    <div ref="popoverDom">
  <a-popover title="">

      <template #content>

          <p>
          <a-input size="middle"
                   v-model:value="pointName"
                   placeholder="地点名称">
          </a-input>
          </p>

          <p>X : {{positionX}}</p>
          <p>Y : {{positionY}}</p>

          <p>
              <a-button size="middle"
                        style="width: 50%"
                        :disabled = "checkoutButton"
              >
                  <template #icon>
                      <CheckOutlined/>
                  </template>
              </a-button>

              <a-button danger
                        size="middle"
                        style="width: 50%"
              >
                  <template #icon>
                      <CloseOutlined/>
                  </template>
              </a-button>

          </p>



      </template>


    <a-button type="link" size="large">
      <template #icon>
          <EnvironmentTwoTone/>
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

const pointName = ref('')
const checkoutButton = computed(()=>{
    return pointName.value === '';
})

const popoverDom = ref()

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
}


</script>

<style scoped>

</style>
