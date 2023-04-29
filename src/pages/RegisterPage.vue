<template>

  <div class="registerPage">
    <div class="registerBox">
      <div class="registerBoxBg">

      </div>
      <div class="registerElement">
        <a-form
            :wrapperCol="{ span: 20, offset: 2 }"
            :label-col="{span: 4, offset: 0}"
            :rules="rules"
            ref="registerForm"
            :model="registerForm"
        >

          <a-form-item style="text-align: center">
            <h1>
              注册
            </h1>
          </a-form-item>

          <a-form-item
              name="name"
              has-feedback
          >

            <a-input v-model:value="name" placeholder="Username" size="large">
              <template #prefix>
                <user-outlined/>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
              name="email"
              has-feedback
          >
            <a-input v-model:value="email" placeholder="Email" size="large">
              <template #prefix>
                <mail-outlined/>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
              name="password"
              has-feedback
          >
            <a-input-password v-model:value="password" placeholder="Password" size="large">
              <template #prefix>
                <LockOutlined/>
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item has-feedback
                       name="confirm"
          >
            <a-input-password v-model:value="confirmPassword" placeholder="Confirm Password" size="large"

            >
              <template #prefix>
                <LockOutlined/>
              </template>
            </a-input-password>
          </a-form-item>


          <a-form-item>
            <router-link to="/login" id="click-to-login">
              已有账号？点我登录
            </router-link>
          </a-form-item>

          <a-form-item


          >
            <a-button
                :disabled="buttonDisabled" :loading="buttonLoading"
                type="primary" size="large" block style="" id="registerButton" @click="register"

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
import {MailOutlined, LockOutlined, UserOutlined} from "@ant-design/icons-vue";
import type {Rule} from "ant-design-vue/es/form";
import {computed, ref} from "vue";
import {Request} from "@/networks/Request";
import type {IResponse} from "@/models/IResponse";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import type { AxiosError } from "axios";

const name = ref("")
const password = ref("")
const email = ref("")
const confirmPassword = ref("")
const registerForm = ref();
//the WORST shit code of the year
const name_is_legal = ref(false);
const password_is_legal = ref(false);
const email_is_legal = ref(false);
const confirm_is_legal = ref(false);
const buttonLoading = ref(false);

const buttonDisabled = computed(() => {
  // 确保每个输入框中的值都合法
  // 没有正在请求
  return !(name_is_legal.value && password_is_legal.value && email_is_legal.value && confirm_is_legal.value) 
          || buttonLoading.value

});

const router = useRouter();
const request = new Request();

/**
 * 注册按钮的回调函数
 */
async function register() {
  buttonLoading.value = true;

  try {
    await request.post<Object>("/postcalendarapi/auth/register", {
      emailAddress: email.value,
      password: password.value,
      username: name.value
    });

    await message.info("注册成功，跳转到登录页面");

    router.push({
      path: "/login"
    });
  } catch(err) {
    const axiosError = err as AxiosError<IResponse<Object>>;
    if (axiosError.response?.status != undefined && 
        axiosError.response?.status >= 400 && axiosError.response?.status < 500) {
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

/**
 * 验证姓名输入的合法性
 */
function validateName(): Promise<void> {

  name_is_legal.value = false;
  //姓名不能为空
  if (name.value === '') {
    return Promise.reject("姓名不能为空");
  }

  //只能由下划线、空格、字母、汉字和数字构成，但是不能由下划线和空格开头或结尾
  else if ((/^[a-zA-Z0-9\s_\u4e00-\u9fa5]+$/i.test(name.value))) {
    if (!(/^(?!_)(?!.*?_$)(?!\s)(?!.*?\s$)[\da-zA-Z0-9\s_\u4e00-\u9fa5]+$/i.test(name.value))) {

      return Promise.reject("姓名不能以下划线或空格开头或结尾");
    } else {
      name_is_legal.value = true;
      return Promise.resolve();
    }
  } else {
    return Promise.reject("姓名只能由字母、数字或下划线构成");
  }
}

/**
 * 验证电子邮件
 */
function validateEmail(): Promise<void> {
  email_is_legal.value = false;

  //邮箱地址不能为空
  if (email.value === '') {
    return Promise.reject("邮箱地址不能为空");
  }
  //检验是不是合法的邮件地址
  else if (/^([a-zA-Z0-9]+[-_]?)+@[a-zA-Z0-9]+\.[a-z]+$/i.test(email.value)) {
    email_is_legal.value = true;
    return Promise.resolve();
  } else {
    return Promise.reject("不是一个有效的邮箱地址");
  }
}

/**
 * 验证密码是否合法
 */
function validatePassword(): Promise<void> {

  password_is_legal.value = false;
  registerForm.value.validateFields('confirm');

  //密码不能为空
  if (password.value === '') {
    return Promise.reject("密码不能为空");
  } else {
    password_is_legal.value = true;
    return Promise.resolve();
  }
}

/**
 * 验证两次输入的密码是否一致
 */
function validateConfirm(): Promise<void> {

  confirm_is_legal.value = false;

  if (password.value !== confirmPassword.value) {
    return Promise.reject("两次输入的密码不一致");
  } else if (confirmPassword.value === '') {
    return Promise.reject("验证密码不能为空");
  } else {
    confirm_is_legal.value = true;
    return Promise.resolve();
  }

}

// 校验规则
const rules: Record<string, Rule[]> = {
  name: [
    {required: true, validator: validateName, trigger: "change"}
  ],
  email: [
    {required: true, validator: validateEmail, trigger: "change"}
  ],
  password: [
    {required: true, validator: validatePassword, trigger: "change"}
  ],
  confirm: [
    {required: true, validator: validateConfirm, trigger: "change"}
  ]
}

</script>

<style scoped>

.registerPage {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("https://img0.baidu.com/it/u=759713920,3089363671&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800");
  background-size: cover;
}

.registerBox {
  position: relative;
  width: 26%;
  height: 68%;
  top: 15%;
  left: 37%;
}

.registerBoxBg {

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

.registerElement {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 10%;
  left: 0;
  opacity: 100%;

}

#registerButton {
  position: relative;
  width: 100%;
  height: 100%;
  top: 20px;
  left: 0;
  padding: 10px 0 10px 0;

}

#click-to-login {
  position: relative;
  width: 100%;
  height: 100%;
  top: 14px;
  left: 0;
  margin: 0 0 0 0;
  padding: 10px 0 10px 0;
}

* { /* CSS Reset */
  margin: 0;
  padding: 0;
}
</style>
