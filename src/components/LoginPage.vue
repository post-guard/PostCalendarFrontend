<template>

<div class="loginPage">
  <div class="loginBox">
    <div class="loginBoxBg">

    </div>
    <div class="loginElement">
      <a-form :model="loginState" :wrapperCol="{ span: 20, offset: 2 }" :label-col="{span: 4, offset: 0}">
        <a-form-item style="text-align: center">
          <h1>
            登录
          </h1>
        </a-form-item>

        <a-form-item>
          <a-input v-model:value="this.name" placeholder="Email" size="large">
            <template #prefix>
              <MailOutlined type="user" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-input-password v-model:value="this.password" placeholder="password" size="large">
            <template #prefix>
              <LockOutlined/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" size="large" block style="" id="loginbutton">
            登录
          </a-button>
        </a-form-item>

        <a-form-item>
          <a href="/#/register" id="click-to-register">
            没有账号？点我注册
          </a>
        </a-form-item>

      </a-form>
    </div>
  </div>
</div>

</template>

<script>
import {MailOutlined,LockOutlined} from "@ant-design/icons-vue";


export default {
  name: "LoginPage",
  data (){
    return{
      name: '',
      password: ''
    }
  },

  components: {
    MailOutlined,
    LockOutlined
  },

  methods:{
      login()
      {
        if (this.name === '') {
          alert("fuck");
        }
      }
  }
}
</script>

<style scoped>

.loginPage{
  position : absolute;
  width: 100%;
  height: 100%;
  background-image: url("https://img.mp.itc.cn/upload/20161215/51aeb8b813824936856e0f613aca83a7_th.jpg");
  background-size: cover;
}

.loginBox{
position: relative;
  width: 26%;
  height: 50%;
  top: 25%;
  left: 37%;
}

.loginBoxBg{

  position: absolute;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  background: white;
  opacity: 90%;
  border-radius: 5%;
  z-index: auto;
}
.loginElement{
position: absolute;
  width: 100%;
  height: 100%;
  top: 10%;
  left: 0%;
  opacity: 100%;

}
#loginbutton{
  position: relative;
  width: 100%;
  height: 100%;
  top: 70px;
  left: 0px;
}

#click-to-register{
  position: relative;
  width: 100%;
  height: 100%;
  top:-30px;
  left: 0px;
}

*{        /* CSS Reset */
  margin : 0;
  padding : 0;
}
</style>
