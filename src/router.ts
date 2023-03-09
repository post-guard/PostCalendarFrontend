import {createRouter, createWebHashHistory} from "vue-router";
import type {RouteRecordRaw} from "vue-router";

import MainPage from "@/components/MainPage.vue";
import Calendar from "@/components/Calendar.vue";

const routers: RouteRecordRaw[] = [
    {
        path: '/',
        component: MainPage
    },
    {
        path: '/calendar',
        component: Calendar
    }
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
});