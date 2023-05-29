<template>
  <div>
    <a-layout style="min-height: 100vh;">
      <a-layout-sider v-model:collapsed="collapsed" :collapsible=true :defaultCollapsed=true style="z-index: 5">
        <div class="logo" />

        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" @select="menu_selected">

          <a-menu-item key="calendar">
            <calendar-outlined />
            <span>
              日程表
            </span>
          </a-menu-item>

          <a-menu-item key="deadline">
                <schedule-outlined />
                <span>
              DDL
            </span>
          </a-menu-item>



            <a-menu-item key="map">
            <global-outlined />
            <span>
              地图
            </span>
          </a-menu-item>

          <a-menu-item key="home">
            <user-outlined />
            <span>
              个人主页
            </span>
          </a-menu-item>


          <a-menu-item key="log">
              <TagOutlined />
              <span>
              日志
            </span>
          </a-menu-item>

        </a-menu>
      </a-layout-sider>


      <a-layout>
        <a-layout-header style="background: #fff; padding: 0;z-index: 5">
          <div class="mainClock">
              <TimeDisplayCom>

              </TimeDisplayCom>
          </div>
          <div id="loginStatus">
            <a-button type="primary" @click="loginButtonClicked">
              {{ loginButtonMessage }}
            </a-button>
          </div>
        </a-layout-header>
        <a-layout-content style="margin: 0 16px">



            <router-view v-slot="{ Component }">
                <keep-alive include="LogPage">
                    <component :is="Component" />
                </keep-alive>
            </router-view>



        </a-layout-content>
        <a-layout-footer style="text-align: center;z-index: 5">
          PostCalendar ©2023 Created by PostCalendar Team
        </a-layout-footer>


      </a-layout>


    </a-layout>


  </div>
</template>

<script setup lang="ts">
import { CalendarOutlined, UserOutlined, GlobalOutlined ,ScheduleOutlined,TagOutlined} from "@ant-design/icons-vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import { useRouter } from "vue-router";
import { WebStorage } from "@/utils/Storage";
import { useUserStore } from "@/stores/UserStore";
import TimeDisplayCom from "@/components/TimeDisplayCom.vue";
import {createSocket} from "@/utils/WebSocket";

const router = useRouter();
const storage = new WebStorage("localStorage");

const collapsed = ref(true);
const selectedKeys = ref([""]);
const loginButtonMessage = ref("登录");

const userStore = useUserStore();

init();

watch(() => router, (newValue) => {
  //console.log(newValue.currentRoute.value.fullPath);
  selectedKeys.value[0] = newValue.currentRoute.value.fullPath.substring(1);
  //传进来的是子页面的router如/calendar,需要截去第一个字符
},
  { immediate: true, deep: true }
  //immediate负责首次监听即触发的功能，deep负责监听对象内部属性发生变化
);


onMounted(async ()=>{
    await userStore.updateUserInformation();
    if(userStore.user!=undefined){
        createSocket(`wss://server.rrricardo.top/postcalendarapi/websocket/alarm/${userStore.user.id}`,'alarm');
        window.addEventListener('onmessageWS', getAlarm);
    }

})

onUnmounted(()=>{
    window.removeEventListener('onmessageWS', getAlarm);
})

function menu_selected() {
  switch (selectedKeys.value[0]) {
    case 'calendar':

      router.push({ path: "/calendar" });

      break;


    case 'deadline':
          router.push({ path: "/deadline" });
      break;


    case 'map':
      router.push({ path: "/map" });
      break;

    case 'home':
      router.push({ path: "/home" })
      break;

    case 'log':
          router.push({ path: "/log" })
      break;

    default:

      router.push({ path: "/calendar" });
  }
}

function loginButtonClicked() {
  storage.remove("token");
  router.replace("/login");
}

async function init() {
  await userStore.updateUserInformation();

  if (userStore.user == undefined) {
    // 没有登录
    router.replace("/login");
  } else {
    loginButtonMessage.value = "退出登录";
  }
}


function getAlarm(event:any){
    const data = event && event.detail.data
    const type = event && event.detail.type

    if(type=='alarm')
    {
        console.log("alarm!!")
        console.log(data);
    }
}
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

#loginStatus {
  float: right;
  margin-right: 20px;
}
</style>
