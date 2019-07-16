import Vue from 'vue'
// 导入组件
import login from '../views/login.vue'
import index from '../views/index.vue'

// 导入vue路由
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
  {path:'/login',component:login},
  {path:'/index',component:index},
]
const router = new VueRouter({
  routes
})
export default router