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
import {computed, getCurrentInstance, onMounted, ref} from "vue";


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

function updatePos(x:number,y:number){
    if(popoverDom.value!=undefined){

        popoverDom.value.style.position = "absolute"

        popoverDom.value.style.left = x -18/2 + "px"
        popoverDom.value.style.top = y -18/2 + "px"

        console.log(popoverDom.value.style.left,popoverDom.value.style.top)
    }
}


</script>

<style scoped>

</style>
