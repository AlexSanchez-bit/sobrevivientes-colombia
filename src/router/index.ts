import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../components/Layout/components/MainLayout.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useSplashStore } from "@/stores/SplashScreen";
import { userRoutes } from "./modules/user";
import { testimonyRoutes } from "./modules/testimonies";
import { laicsRoutes } from "./modules/laics";
import { promotionsRoutes } from "./modules/promotions/promotions";

const router = createRouter({
  history: createWebHistory("#"),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "default",
          component: () => import("@/components/Default/Default.vue"),
        },
        ...testimonyRoutes,
        ...laicsRoutes,
        ...userRoutes,
        ...promotionsRoutes,
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/Auth/Login.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("@/pages/404.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const { enable } = useSplashStore();
  enable();
  if (!authStore.authenticated && to.name != "login") {
    next("login");
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  const { disable } = useSplashStore();
  disable();
});

export default router;
