import { createApp } from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import {router} from "@/router";
import ant from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(ant);
app.use(pinia);

app.mount("#app");
