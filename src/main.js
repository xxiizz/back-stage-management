import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'

// 导入饿了么UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 导入面包屑导航组件
import breadNav from './components/breadNav.vue'
Vue.component('breadNav',breadNav)

// 导入reset样式
import './assets/reset.scss'

// 导入vue router
import router from './router/router'

Vue.config.productionTip = false

Vue.filter('timeFormat',data=>{
  return moment(data).format('YYYY-MM-DD HH:mm:ss')
})

import Distpicker from 'v-distpicker'
Vue.component('v-distpicker', Distpicker)
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
