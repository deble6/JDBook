import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import CopClass from '@/components/EnterPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login.vue')
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/user-manage',
      component: () => import('@/pages/home.vue'),
      children: [
        {
          path: '/user-manage',
          name: 'user-manage',
          component: () => import('@/pages/user-manage/index.vue')
        },
        {
          path: '/menu-manage',
          name: 'menu-manage',
          component: () => import('@/pages/menu-manage/index.vue')
        },
        {
          path: '/comm-manage',
          name: 'comm-manage',
          component: () => import('@/pages/comm-manage/index.vue')
        },
        {
          path: '/home-pic-manage',
          name: 'home-pic-manage',
          component: () => import('@/pages/home-pic-manage/index.vue')
        },
        {
          path: '/comm-classify-manage',
          name: 'comm-classify-manage',
          component: () => import('@/pages/comm-classify-manage/index.vue')
        },
        {
          path: '/client-manage',
          name: 'client-manage',
          component: () => import('@/pages/client-manage/index.vue')
        },
        {
          path: '/order-manage',
          name: 'order-manage',
          component: () => import('@/pages/order-manage/index.vue')
        },
        {
          path: '/hot-comm-manage',
          name: 'hot-comm-manage',
          component: () => import('@/pages/hot-comm-manage/index.vue')
        },
        {
          path: '/shop-info-manage',
          name: 'shop-info-manage',
          component: () => import('@/pages/shop-info-manage/index.vue')
        },
        {
          path: '/driver-info-manage',
          name: 'driver-info-manage',
          component: () => import('@/pages/driver-info-manage/index.vue')
        }
      ]
    }
  ]
})
