import Vue from 'vue'
import Router from 'vue-router'
import Layout from "@/page/Layout/layout.vue"
import Income from "@/page/Income/income.vue"
import Account from "@/page/Account/account.vue"
import Login from "@/page/Login/login" 
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/layout',
      component: Layout,
      children: [
        {
          path: '/layout/income',
          component: Income,
        },
        {
          path: '/layout/account',
          component: Account,
        }
      ]
    },
    {
      path: '/',
      redirect: '/layout/income'
    },
    {
      path: '/login',
      component: Login
    }

  ]
})

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('userTag') || '';
  if (token != '') {
    next()
  } else {
    if (to.path == "/login") {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})
export default router;
