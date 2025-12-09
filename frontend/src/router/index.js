import { createRouter, createWebHistory } from "vue-router";
import Weg from '../views/protected/weg.vue';


import accessDenied from '../views/open/accessDenied.vue';
import login from '@/views/open/loginView.vue';


// Trensfer routes
import HomeTransfer from "@/views/protected/ProtectedLayout.vue";
// payment routes

const routes = [

  // test routes

  {
    path: "/",
    component: login,
    meta: { requiresGuest: false },
  },


  {
    path: "/login",
    component: login,
    meta: { requiresGuest: false },
  },


  {
    path: "/dashboard",
    redirect: { name: 'transfer-home' },
    component: Weg,
    // meta: { requiresGuest: false },
    meta: { requiresAuth: false },
    // meta: { requiresAuth: false },
    children: [

      {
        path: 'transfer-home',
        name: 'transfer-home',
        component: HomeTransfer
      },
      
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    component: accessDenied,
    meta: { requiresGuest: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // Token to check if authenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth); // If the route requires auth
  console.log("requiresAuth", requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest); // If the route allows guests
  console.log("requiresGuest", requiresGuest);
  if (requiresAuth) {
    console.log("require auth detected");
    if (!isAuthenticated) {
      next("/");
    } else {

      next();
    }
  } else if (requiresGuest) {
    next();
  } else {
    next();
  }
});
export default router;






// router.beforeEach(async (to, from, next) => {
//   // Check if the route requires authentication
//   if (to.meta.requiresAuth) {
//     try {
//       // Try to verify the session without triggering CSRF failure
//       await api.get('/api/auth/me'); 
//       next();
//     } catch (err) {
//       next('/login-test'); // Not logged in
//     }
//   }
//   // If route should only be visited by guests (not logged in users)
//   else if (to.meta.requiresGuest) {
//     try {
//       await api.get('/api/auth/me');
//       next('/dashboard-test'); // Already logged in → send to dashboard
//     } catch {
//       next();
//     }
//   }
//   else {
//     next();
//   }
// });

// export default router;
