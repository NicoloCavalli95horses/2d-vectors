import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Menu from "../views/Menu.vue";
import Demo from "../views/Demo.vue";
import Chase from "../views/Chase.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/menu",
      name: "Menu",
      component: () => import("../views/Menu.vue"),
    },
    {
      path: "/demo",
      name: "Demo",
      component: () => import("../views/Demo.vue"),
    },
    {
      path: "/chase",
      name: "Chase",
      component: () => import("../views/Chase.vue"),
    },
  ],
});

export default router;
