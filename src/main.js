import Vue from 'vue'
import App from './App.vue'

// 导入饿了么UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 导入reset样式
import './assets/reset.scss'

// 导入vue router
import router from './router/router'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
