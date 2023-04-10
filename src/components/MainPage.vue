<template>
  <div>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed = "collapsed"
                    :collapsible = true
                    :defaultCollapsed = true>
      <div class="logo"/>

      <a-menu v-model:selected-keys="selectedKeys"
              theme="dark"
              mode="inline">

        <a-menu-item key="1">
          <calendar-outlined />
          <span>
            日程表
          </span>
        </a-menu-item>

        <a-menu-item key="2">
          <global-outlined />
          <span>
            地图
          </span>
        </a-menu-item>

        <a-menu-item key="3">
          <user-outlined />
          <span>
            个人主页
          </span>
        </a-menu-item>

      </a-menu>
    </a-layout-sider>


    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">

        <router-view></router-view>

      </a-layout-content>
      <a-layout-footer style="text-align: center">
        PostCalendar ©2023 Created by PostCalendar Team
      </a-layout-footer>


    </a-layout>


  </a-layout>


    </div>
</template>

<script setup lang="ts">
import {CalendarOutlined,UserOutlined,GlobalOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";

const collapsed = ref(true);
const selectedKeys = ref(["1"]);
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout-background {
  background: #fff;
}
.site-layout-background {
  background: #141414;
}
</style>
