<template>
<!--  <a-layout>
    <a-layout-header>
      <div id="logo">
        <h2 id="header-text">邮历</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKey"
      theme="dark"
      mode="horizontal"
      :style="{lineHeight: '64px'}"
      id="header-menu">
        <a-menu-item key="1">
          <router-link to="/">主页</router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/calendar">日程</router-link>
        </a-menu-item>
      </a-menu>

      <a-button ghost id="login" @click="login">
        {{logged ? "登录成功" : "点击登录"}}
      </a-button>
    </a-layout-header>

    <a-layout-content>
      <div id="main-content">
        <router-view></router-view>
      </div>
    </a-layout-content>

    <a-layout-footer class="footer">
      Copyright 2023 By 邮历团队
    </a-layout-footer>
  </a-layout>-->
  <router-view>

  </router-view>
</template>

<script setup lang="ts">
/*import {ref} from "vue";

const selectedKey = ref(['1'])
const logged = ref(false)

function login() {
  logged.value = !logged.value;
}*/
</script>

<style>
/*#logo {
  float: left;
  width: fit-content;
}

#header-text {
  color: white;
  margin-right: 24px;
}

#header-menu {
  width: fit-content;
  float: left;
}

#login {
  float: right;
  margin: 16px 24px 16px 0;
}

#main-content {
  min-height: 500px;
}

.footer {
  text-align: center;
}*/
</style>
