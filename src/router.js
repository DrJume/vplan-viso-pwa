import Vue from 'vue'
import Router from 'vue-router'

import ChooseUserType from './views/ChooseUserType.vue'
import About from './views/About.vue'
import Settings from './views/Settings.vue'
import VPlanView from './views/VPlanView.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: '/vplan/',
  routes: [
    {
      path: '/',
      name: 'start',
      component: ChooseUserType
    },
    {
      path: '/einstellungen',
      name: 'settings',
      component: Settings,
      meta: { backMenuOption: true }
    },
    {
      path: '/ueber',
      name: 'about',
      component: About,
      meta: { backMenuOption: true }
    },
    {
      path: '/schueler/',
      name: 'students',
      component: VPlanView,
      props: { type: 'students' }
    },
    {
      path: '/lehrer/',
      name: 'teachers',
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
