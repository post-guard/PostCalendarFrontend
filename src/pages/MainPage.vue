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
import {
    CalendarOutlined,
    UserOutlined,
    GlobalOutlined,
    ScheduleOutlined,
    TagOutlined,
    BellOutlined
} from "@ant-design/icons-vue";
import {h, onMounted, onUnmounted, ref, watch} from "vue";
import { useRouter } from "vue-router";
import { WebStorage } from "@/utils/Storage";
import { useUserStore } from "@/stores/UserStore";
import TimeDisplayCom from "@/components/TimeDisplayCom.vue";
import {createSocket} from "@/utils/WebSocket";
import {message, notification} from "ant-design-vue";
import type {IGroup} from "@/models/IGroup";
import type {AxiosError} from "axios";
import type {IResponse} from "@/models/IResponse";
import {Request} from "@/utils/Request";
import type {IMapPoint} from "@/models/IMapPoint";
import {usePlaceStore} from "@/stores/PlaceStore";


const router = useRouter();
const storage = new WebStorage("localStorage");

const collapsed = ref(true);
const selectedKeys = ref(["calendar"]);
const loginButtonMessage = ref("登录");

const userStore = useUserStore();
const request = new Request();

const placeStore = usePlaceStore();

const audio = new Audio();
audio.src = "/alarm.wav"
router.push({ path: "/calendar" });//进入页面时默认进入日历页

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

    if(placeStore.nowPosition==undefined){
        const indexPlace =  await request.get<IMapPoint>(`/postcalendarapi/place/104`);

        placeStore.setPlace(indexPlace.data);//设定初始位置是学五公寓id:104
        console.log("初始位置设置成功:");
        console.log(placeStore.nowPosition)
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


async function getAlarm(event:any){
    const data = event && event.detail.data
    const type = event && event.detail.type

    if(type=='alarm')
    {
        const alarmData = JSON.parse(data);

        //console.log(alarmData)

        if(alarmData.timePointEvents!=null){

            if(alarmData.alarmType == 1){//只对现在发生的事进行导航
                if(placeStore.navigationList!=undefined){
                    const lastPlace =  await request.get<IMapPoint>(`/postcalendarapi/place/${placeStore.navigationList[placeStore.navigationList.length-1]}`);

                    placeStore.setPlace(lastPlace.data);//设定当前位置是上一次导航的终点,这一项只会设置一次

                    placeStore.setNavigationList([]);//设置完当前位置后,清空原导航列表
                }

            }


            for(let timePointEvent of alarmData.timePointEvents){

                let event={
                    name:timePointEvent.name,
                    group:'',
                    location:''
                }

                if(timePointEvent.userId!=0){//个人事件
                    event.group='个人'
                }
                else{//集体事件

                    try {

                        const response =  await request.get<IGroup>(`/postcalendarapi/group/${timePointEvent.groupId}`);
                        event.group='集体【'+response.data.name+'】'

                    }catch (err){
                        const axiosError = err as AxiosError<IResponse<IGroup>>;
                        if (axiosError.response?.status != undefined &&
                            axiosError.response.status >= 400 && axiosError.response.status < 500) {
                            event.group='未知集体'
                        }
                    }
                }


                try {

                    if(timePointEvent.locationId==0){
                        event.location = "网络空间";
                    }
                    else{
                        const response =  await request.get<IMapPoint>(`/postcalendarapi/place/${timePointEvent.placeId}`);
                        event.location = response.data.name;
                        if(alarmData.alarmType == 1){//只对现在发生的事进行导航
                            if(placeStore.navigationList!=undefined){

                                placeStore.navigationList.push(response.data.id);//向当前导航列表添加地点
                            }
                            else{
                                placeStore.navigationList = [response.data.id];
                            }
                        }
                    }

                }catch (err){
                    const axiosError = err as AxiosError<IResponse<IMapPoint>>;
                    if (axiosError.response?.status != undefined &&
                        axiosError.response.status >= 400 && axiosError.response.status < 500) {
                        event.location = "未知地点";
                    }
                }

                showNotification(alarmData.alarmType,event);

            }


        }
        if(alarmData.timeSpanEvents!=null){
            for(let timeSpanEvent of alarmData.timeSpanEvents){

                let event={
                    name:timeSpanEvent.name,
                    group:'',
                    location:''
                }

                if(timeSpanEvent.userId!=0){//个人事件
                    event.group='个人'
                }
                else{//集体事件

                    try {

                        const response =  await request.get<IGroup>(`/postcalendarapi/group/${timeSpanEvent.groupId}`);
                        event.group='集体【'+response.data.name+'】'

                    }catch (err){
                        const axiosError = err as AxiosError<IResponse<IGroup>>;
                        if (axiosError.response?.status != undefined &&
                            axiosError.response.status >= 400 && axiosError.response.status < 500) {
                            event.group='未知集体'
                        }
                    }
                }


                try {

                    if(timeSpanEvent.locationId==0){
                        event.location = "网络空间";
                    }
                    else{
                        const response =  await request.get<IMapPoint>(`/postcalendarapi/place/${timeSpanEvent.placeId}`);
                        event.location = response.data.name;

                        if(alarmData.alarmType == 1){//只对现在发生的事进行导航
                            if(placeStore.navigationList!=undefined){
                                const lastPlace =  await request.get<IMapPoint>(`/postcalendarapi/place/${placeStore.navigationList[placeStore.navigationList.length-1]}`);

                                placeStore.setPlace(lastPlace.data);//设定当前位置是上一次导航的终点
                                placeStore.setNavigationList([response.data.id]);//设定当前导航列表
                            }
                            else{
                                placeStore.navigationList = [response.data.id];
                            }
                        }
                    }

                }catch (err){
                    const axiosError = err as AxiosError<IResponse<IMapPoint>>;
                    if (axiosError.response?.status != undefined &&
                        axiosError.response.status >= 400 && axiosError.response.status < 500) {
                        event.location = "未知地点";
                    }
                }

                showNotification(alarmData.alarmType,event);

            }
        }

    }
}


async function showNotification(type:number,event:any){

    try {
        await audio.play();
    }catch (e){
        message.error("当前浏览器无法播放提示音")
    }

    if(type == 0){

        notification.open({
            message: '一小时后',
            description:
            event.name+"    "+event.location+"    "+event.group
                ,
            icon: () => h(BellOutlined, { style: 'color: #FFC15EFF' }),
            duration: 10

        });
    }
    else if(type == 1){
        notification.open({
            message: '现在',
            description:
                event.name+"    "+event.location+"    "+event.group
            ,
            icon: () => h(BellOutlined, { style: 'color: #30FF37FF' }),
            duration: 10
        });
    }
    else {
        notification.open({
            message: '明天待办事项',
            description:
                event.name+"    "+event.location+"    "+event.group
            ,
            icon: () => h(BellOutlined, { style: 'color: #62A6FFFF' }),
            duration: 10
        });
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
