import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/admin-login",
      name: "admin-login",
      component: () => import("../views/AdminLoginView.vue"),
    },
    {
      path: "/doctor-login",
      name: "doctor-login",
      component: () => import("../views/DoctorLoginView.vue"),
    },
    {
      path: "/student-login",
      name: "student-login",
      component: () => import("../views/StudentLoginView.vue"),
    },
    {
      path: "/dashbord",
      name: "dashbord",
      component: () => import("../views/DashbordView.vue"),
    },
    {
      path: "/add-doctor",
      name: "add-doctor",
      component: () => import("../views/AddDoctorView.vue"),
    },
    {
      path: "/add-project",
      name: "add-project",
      component: () => import("../views/AddProjectView.vue"),
    },
  ],
});

export default router;
