import { createRouter, createWebHistory } from "vue-router";
import Menu from "../views/Menu.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Menu",
      component: Menu,
    },
    {
      path: "/demo",
      name: "Demo",
      component: () => import("../views/Demo.vue"),
    },
    {
      path: "/attraction",
      name: "Attraction",
      component: () => import("../views/Attraction.vue"),
    },
    {
      path: "/mouse",
      name: "Mouse",
      component: () => import("../views/MouseTracker.vue"),
    },
  ],
});

export default router;
