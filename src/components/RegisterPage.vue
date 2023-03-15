<template>

  <div class="registerPage">
    <div class="registerBox">
      <div class="registerBoxBg">

      </div>
      <div class="registerElement">
        <a-form :model="registerState" :wrapperCol="{ span: 20, offset: 2 }" :label-col="{span: 4, offset: 0}">
          <a-form-item style="text-align: center">
            <h1>
              注册
            </h1>
          </a-form-item>

          <a-form-item has-feedback>
            <a-input v-model:value="name" placeholder="Username" size="large">
              <template #prefix>
                <user-outlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item has-feedback>
            <a-input v-model:value="email" placeholder="Email" size="large">
              <template #prefix>
                <mail-outlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item has-feedback>
            <a-input-password v-model:value="password" placeholder="Password" size="large">
              <template #prefix>
                <LockOutlined/>
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-input-password v-model:value="confirmPassword" placeholder="Confirm Password" size="large">
              <template #prefix>
                <LockOutlined/>
              </template>
            </a-input-password>
          </a-form-item>


          <a-form-item>
            <a href="/#/login" id="click-to-login">
              已有账号？点我登录
            </a>
          </a-form-item>

          <a-form-item>
            <a-button
                :disabled="button_disabled"
                type="primary" size="large" block style="" id="registerbutton" @click="register"
                :help="button_help"
            >
              注册
            </a-button>
          </a-form-item>

        </a-form>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {MailOutlined, LockOutlined,UserOutlined} from "@ant-design/icons-vue";

import {computed, ref} from "vue";

const name = ref("")
const password = ref("")
const email = ref("")
const confirmPassword = ref("")

const button_help = ref("");

function register() {
  if (password.value !== confirmPassword.value) {
    button_help.value = "前后输入的密码不一致";
  }
}

const button_disabled = computed(() => {
  return !(name.value && password.value && email.value && confirmPassword.value);
});


</script>

<style scoped>

.registerPage{
  position : absolute;
  width: 100%;
  height: 100%;
  background-image: url("https://img0.baidu.com/it/u=759713920,3089363671&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800");
  background-size: cover;
}

.registerBox{
  position: relative;
  width: 26%;
  height: 68%;
  top: 15%;
  left: 37%;
}

.registerBoxBg{

  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: white;
  opacity: 90%;
  border-radius: 5%;
  z-index: auto;
}
.registerElement{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 10%;
  left: 0;
  opacity: 100%;

}
#registerbutton{
  position: relative;
  width: 100%;
  height: 100%;
  top: 20px;
  left: 0;
  padding: 10px 0 10px 0;

}

#click-to-login{
  position: relative;
  width: 100%;
  height: 100%;
  top:14px;
  left: 0;
  margin: 0 0 0 0;
  padding: 10px 0 10px 0;
}

*{        /* CSS Reset */
  margin : 0;
  padding : 0;
}
</style>
