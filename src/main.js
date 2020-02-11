import Vue from 'vue'

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import VueGlobalVar from 'vue-global-var';
import AxiosService from '@/services/AxiosService'

Vue.use(VueGlobalVar, {
  globals: {
    $axios: new AxiosService().getAxios()
  },
});

import money from  'vuejs-money'
Vue.use(money)


import App from './App.vue'
import router from './router'
import store from './store'


import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles
Vue.use(Vuesax, {

});

import 'material-icons/iconfont/material-icons.css';

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
