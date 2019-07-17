import Vue from "vue";
// 导入组件
import login from "../views/login.vue";
import index from "../views/index.vue";
import notfound from "../views/notfound.vue";
import users from "../views/users.vue";
import roles from "../views/roles.vue";
import rights from "../views/rights.vue";
import goods from "../views/goods.vue";
import categories from "../views/categories.vue";
import orders from "../views/orders.vue";
import params from "../views/params.vue";
import reports from "../views/reports.vue";

// 导入vue路由
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
  { path: "/login", component: login },
  {
    path: "/index",
    component: index,
    meta: { requireLogin: true },
    children: [
      { path: "users", component: users, meta: { requireLogin: true } },
      { path: "roles", component: roles, meta: { requireLogin: true } },
      { path: "rights", component: rights, meta: { requireLogin: true } },
      { path: "goods", component: goods, meta: { requireLogin: true } },
      {
        path: "categories",
        component: categories,
        meta: { requireLogin: true }
      },
      { path: "orders", component: orders, meta: { requireLogin: true } },
      { path: "params", component: params, meta: { requireLogin: true } },
      { path: "reports", component: reports, meta: { requireLogin: true } }
    ]
  },
  {path:'/',redirect:'/index'},
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
