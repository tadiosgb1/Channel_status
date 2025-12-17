import { createRouter, createWebHistory } from "vue-router";

import login from '@/views/open/loginView.vue';
import accessDenied from '@/views/open/accessDenied.vue';

// Protected layout and pages
import ProtectedLayout from "@/views/protected/ProtectedLayout.vue";
import CheckStatus from "@/views/protected/CheckStatus.vue";
import Cases from "@/views/protected/Cases.vue";
import CreateUsers from "@/views/protected/CreateUsers.vue";

const routes = [
  { path: "/", component: login, meta: { requiresGuest: true } },
  { path: "/login", name: "login", component: login, meta: { requiresGuest: true } },

  {
    path: "/dashboard",
    component: ProtectedLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "check-status", name: "check-status", component: CheckStatus },
      { path: "cases", name: "cases", component: Cases },
      { path: "create-users", name: "create-users", component: CreateUsers },
      { path: "", redirect: { name: "check-status" } } // default child
    ]
  },

  { path: "/:pathMatch(.*)*", component: accessDenied, meta: { requiresGuest: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
