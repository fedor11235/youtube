import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/login',
        component: () => import('../pages/LoginPage.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: '/register',
        component: () => import('../pages/RegisterPage.vue'),
        meta: { requiresGuest: true }
      },
      { 
        path: '', 
        component: () => import('pages/IndexPage.vue') 
      },
      { 
        path: 'profile', 
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/channel/:url',
        component: () => import('layouts/MainLayout.vue'),
        children: [
          { 
            path: '', 
            component: () => import('pages/ChannelPage.vue'),
            props: true
          }
        ]
      },
      {
        path: 'search',
        component: () => import('pages/SearchPage.vue')
      },
      {
        path: 'feedback',
        component: () => import('pages/FeedbackPage.vue')
      },
      // {
      //   path: 'plans',
      //   component: () => import('pages/PlansPage.vue')
      // },
      {
        path: '/order-video',
        component: () => import('pages/OrderVideoPage.vue')
      },
      {
        path: 'roadmap',
        component: () => import('pages/RoadmapPage.vue')
      },
      { 
        path: 'watch/:id', 
        component: () => import('pages/WatchPage.vue') 
      },
      {
        path: 'upload',
        component: () => import('pages/UploadPage.vue'),
        meta: { requiresModel: true }
      },
      {
        path: 'trending',
        component: () => import('pages/TrendingPage.vue')
      },
      {
        path: 'library',
        component: () => import('pages/LibraryPage.vue')
      },
      {
        path: 'subscriptions',
        component: () => import('pages/SubscriptionsPage.vue')
      },
      {
        path: 'history',
        component: () => import('pages/HistoryPage.vue')
      }
    ]
  }
]

export default routes