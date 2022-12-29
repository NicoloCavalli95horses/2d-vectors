import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Menu from "../views/Menu.vue";
import Demo from "../views/Demo.vue";
import Attraction from "../views/Attraction.vue";

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
      path: "/attraction",
      name: "Attraction",
      component: () => import("../views/Attraction.vue"),
    },
  ],
});

export default router;
