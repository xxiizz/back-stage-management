import Vue from 'vue'
import App from './App.vue'

// 导入组件
import login from './components/login.vue'
import index from './components/index.vue'

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

// 导入饿了么UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 导入reset样式
import './assets/reset.scss'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
