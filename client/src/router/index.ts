import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import MainView from "@/views/index.vue";
import RoomView from "@/views/room/index.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "main-view",
        component: MainView,
    },

    {
        path: "/room/:roomId",
        name: "room-view",
        component: RoomView,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export { router };
export default router;
