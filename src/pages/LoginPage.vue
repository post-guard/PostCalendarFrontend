<template>
  <div class="loginPage">
    <div class="loginBox">
      <div class="loginBoxBg">

      </div>
      <div class="loginElement">
        <a-form :wrapperCol="{ span: 20, offset: 2 }" :label-col="{ span: 4, offset: 0 }">
          <a-form-item style="text-align: center">
            <h1>
              登录
            </h1>
          </a-form-item>

          <a-form-item>
            <a-input v-model:value="email" placeholder="Email" size="large">
              <template #prefix>
                <mail-outlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password v-model:value="password" placeholder="Password" size="large">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a href="/#/register" id="click-to-register">
              没有账号？点我注册
            </a>
          </a-form-item>

          <a-form-item>
            <a-button :disabled="buttonDisable" :loading="buttonLoading" type="primary" size="large" block style=""
              id="loginbutton" @click="login">
              登录
            </a-button>
          </a-form-item>

        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MailOutlined, LockOutlined } from "@ant-design/icons-vue";
import { computed, ref } from "vue";
import { Request } from "@/utils/Request"
import type { IResponse } from "@/models/IResponse";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import type { AxiosError } from "axios";
import type { ILoginToken } from "@/models/ILoginToken";
import { WebStorage } from "@/utils/Storage";
import { useUserStore } from "@/stores/UserStore";

const email = ref("");
const password = ref("");
const router = useRouter();
const request = new Request();
const storage = new WebStorage("localStorage");
const userStore = useUserStore();

const buttonDisable = computed(() => {
  return email.value === "" || password.value === "" || buttonLoading.value;
});
const buttonLoading = ref(false);

const token = storage.getKey<ILoginToken>("token");
if (token != null) {
  message.warn("已经登录，请勿重复登录!");

  router.replace("/");
}

async function login() {
  buttonLoading.value = true;

  try {
    const response = await request.post<ILoginToken>("/postcalendarapi/auth/login", {
      "emailAddress": email.value,
      "password": password.value
    });

    storage.setKey<ILoginToken>("token", response.data);
    // 这里不用设置request的token
    // request不是全局共享的

    userStore.updateUserInformation();
    await message.success("登录成功", 1);

    router.push({
      path: "/"
    });
  } catch(err) {
    const axiosError = err as AxiosError<IResponse<ILoginToken>>;
    // 当返回状态码为400系列时
    // 服务器应当返回错误原因
    // 注意这里虽然AxiosError中含有status字段的定义
    // 但是实际上是undefined
    // 所以需要使用response字段中的status
    if (axiosError.response?.status != undefined && 
        axiosError.response.status >= 400 && axiosError.response.status < 500) {
      let errorMessage = "登录错误";

      if (axiosError.response?.data != undefined) {
        errorMessage += `: ${axiosError.response.data.message}`;
      }

      message.error(errorMessage);
    } else {
      message.error("服务器错误，请联系管理员");
    }
  } finally {
    buttonLoading.value = false;
  }
}
</script>

<style scoped>
.loginPage {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("https://img.mp.itc.cn/upload/20161215/51aeb8b813824936856e0f613aca83a7_th.jpg");
  background-size: cover;
}

.loginBox {
  position: relative;
  width: 26%;
  height: 52%;
  top: 24%;
  left: 37%;
}

.loginBoxBg {

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

.loginElement {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 10%;
  left: 0;
  opacity: 100%;

}

#loginbutton {
  position: relative;
  width: 100%;
  height: 100%;
  top: 30px;
  left: 0;
  padding: 10px 0 10px 0;

}

#click-to-register {
  position: relative;
  width: 100%;
  height: 100%;
  top: 20px;
  left: 0;
  margin: 0 0 0 0;
  padding: 10px 0 10px 0;
}

* {
  /* CSS Reset */
  margin: 0;
  padding: 0;
}
</style>
