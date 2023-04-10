import {createRouter, createWebHashHistory} from "vue-router";
import type {RouteRecordRaw} from "vue-router";

import MainPage from "@/components/MainPage.vue";
import Calendar from "@/components/Calendar.vue";
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";

const routers: RouteRecordRaw[] = [
    {
        path: '/',

        component: MainPage
    },
    {
        path: '/calendar',
        component: Calendar
    },
    {
        path: '/login',

        component:LoginPage
    },
    {
        path: '/register',
        component:RegisterPage
    }
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
});
