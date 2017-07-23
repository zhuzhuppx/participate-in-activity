import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('../components/Activity.vue')
    },
    {
      path: '/Hello',
      name: 'Hello',
      component: require('../components/Hello.vue')
    },  {
        path: '/Activity',
        name: 'Activity',
        component: require('../components/Activity.vue')
      },  {
          path: '/ShareUsers/:id',
          name: 'ShareUsers',
          component: require('../components/ShareUsers.vue')
        },  {
            path: '/Already',
            name: 'Already',
            component: require('../components/Already.vue')
          }
  ]
})
