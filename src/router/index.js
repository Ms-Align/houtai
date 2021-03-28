import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/index.vue'
import Layout from '../components/layout/index.vue'
import Article from '../components/article/index.vue'
import Publish from '../components/publish/index.vue'
import Image from '../components/images/index.vue'
import UserCommit from '../components/commit/index.vue'
import Fans from '../components/fans/index.vue'
import Setting from '../components/setting/index.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login' // 路由的name：在通过push实现跳转动态路由的功能时，通过传递name参数可以方便的创建动态路由
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '', // 路径为空的子路由会默认渲染
        component: Home,
        name: 'home'
      },
      {
        path: '/article',
        component: Article,
        name: 'article'
      },
      {
        path: 'publish',
        component: Publish,
        name: 'publish'
      },
      {
        path: 'image',
        component: Image,
        name: 'image'
      },
      {
        path: 'commit',
        component: UserCommit,
        name: 'userCommit'
      },
      {
        path: 'setting',
        component: Setting,
        name: 'setting'
      },
      {
        path: 'fans',
        component: Fans,
        name: 'fans'
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== '/login') {
    // 校验非登录状态
    if (user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
export default router
