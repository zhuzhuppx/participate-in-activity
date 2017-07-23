// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import IView from 'iView'
import App from './App'
import router from './router'
import 'iView/dist/styles/iview.css'
import 'vue-awesome/icons'
import AIcon from 'vue-awesome/components/Icon'

Vue.component('a-icon', AIcon)
Vue.config.productionTip = false
Vue.use(IView)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  created() {
    this.$Message.config({
      top: 50,
      duration: 3
    });
  }
})
