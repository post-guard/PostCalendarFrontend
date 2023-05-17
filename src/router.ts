import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import MainPage from "@/pages/MainPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import CalendarPage from "@/pages/CalendarPage.vue";
import MapPage from "@/pages/MapPage.vue";
import PersonalPage from "@/pages/PersonalPage.vue";
import DDLPage from "@/pages/DDLPage.vue";
import AlarmPage from "@/pages/AlarmPage.vue";

const routers: RouteRecordRaw[] = [
    {
        path: '/',

        component: MainPage,

        children: [
            {
                path: '/calendar',
                component: CalendarPage
            },
            {
                path: '/deadline',
                component: DDLPage
            },
            {
                path: '/alarm',
                component: AlarmPage
            },
            {
                path: '/map',
                component: MapPage
            },
            {
                path: '/home',
                component: PersonalPage
            },

        ]
    },
    {
        path: '/login',
        component: LoginPage
    },
    {
        path: '/register',
        component: RegisterPage
    }
];

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routers
});
