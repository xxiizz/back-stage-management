import Vue from 'vue'
import App from './App.vue'

// 导入vue路由
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = {
  
}
const router = new VueRouter({
  routes
})

// 导入饿了么UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
