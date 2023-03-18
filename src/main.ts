import { createApp } from 'vue'

import App from './App.vue'
import {router} from "@/router";
import ant from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import axios from 'axios'

const app = createApp(App);
app.use(router);
app.use(ant);

//axios部分
axios.defaults.baseURL='http://localhost:8080';
axios.defaults.timeout=5000;


app.config.globalProperties.$axios = axios;

//

app.mount("#app");
