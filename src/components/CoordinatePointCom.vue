<template>
    <div class="a-popover_temp">
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
import {computed, ref} from "vue";


const props = defineProps<{

      positionX:number,
      positionY:number,
      name:string,
      placeType:number,

}>()

const pointName = ref('')
const checkoutButton = computed(()=>{
    return pointName.value === '';
})



function init(){
    const popover = <HTMLElement> document.getElementsByClassName('a-popover_temp')[0]

    /*popover.style.left = props.positionX/10 + 'px';
    popover.style.top = props.positionY/10 + 'px';*/


}

init();
</script>

<style scoped>
/*.a-popover_temp{
    position: absolute;
    left: auto;
    top: auto;
}*/

</style>
