import Vue from "vue";
// 导入组件
import login from "../views/login.vue";
import index from "../views/index.vue";
import notfound from "../views/notfound.vue";

// 导入vue路由
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
  { path: "/login", component: login },
  { path: "/index", component: index, meta: { requireLogin: true } },
  { path: "/notfound", component: notfound },
  { path: "*", redirect: "/notfound" }
];
const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin) {
    if (window.localStorage.getItem("token")) {
      next();
    } else {
      new Vue().$message("请先登录");
      router.push("/login");
    }
  } else {
    next();
  }
});
export default router;
