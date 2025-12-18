import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/open/loginView.vue";
import AccessDenied from "@/views/open/accessDenied.vue";

// Protected layout and pages
import ProtectedLayout from "@/views/protected/ProtectedLayout.vue";
import Dashboard from "@/views/protected/Dashboard.vue";
import CheckStatus from "@/views/protected/CheckStatus.vue";
import Cases from "@/views/protected/Cases.vue";
import CreateUsers from "@/views/protected/CreateUsers.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresGuest: true },
  },

  {
    path: "/dashboard",
    component: ProtectedLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "check-status",
        name: "check-status",
        component: CheckStatus,
      },
      {
        path: "cases",
        name: "cases",
        component: Cases,
      },
      {
        path: "create-users",
        name: "create-users",
        component: CreateUsers,
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    component: AccessDenied,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* Navigation Guard */
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
