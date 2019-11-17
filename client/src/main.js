import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue'
import { routes } from './routes';
import moment from 'moment'

Vue.prototype.moment = moment;

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({routes})


new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
