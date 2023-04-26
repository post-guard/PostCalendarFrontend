import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import MainPage from "@/components/MainPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import CalendarPage from "@/components/CalendarPage.vue";
import MapPage from "@/components/MapPage.vue";
import PersonalPage from "@/components/PersonalPage.vue";

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
