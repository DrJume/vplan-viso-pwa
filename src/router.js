import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import VPlanView from './views/VPlanView.vue'

Vue.use(Router)

export default new Router({
  base: '/vplan/',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/schueler/',
      component: VPlanView,
      props: { type: 'students' }
    },
    {
      path: '/lehrer/',
      component: VPlanView,
      props: { type: 'teachers' }
    },
    {
      path: '*',
      redirect: '/'
    }
    // {
    // path: '/teachers',
    // name: 'teachers',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
