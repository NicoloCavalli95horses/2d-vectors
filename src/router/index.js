import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Canvas from "../views/Canvas.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/canvas",
      name: "Canvas",
      component: () => import("../views/Canvas.vue"),
    },
  ],
});

export default router;
