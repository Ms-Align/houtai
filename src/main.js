import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-tiptap/lib/index.css'
import { ElementTiptapPlugin } from 'element-tiptap'

Vue.config.productionTip = false
// 全局注册element组件库
Vue.use(ElementUI)
Vue.use(ElementTiptapPlugin)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
