import Vue from 'vue'
import VueRouter from 'vue-router';
import VueStripeCheckout from 'vue-stripe-checkout';
import VueResource from 'vue-resource';
import App from './App.vue'
import { routes } from './routes';
import moment from 'moment'

Vue.prototype.moment = moment;

Vue.use(VueRouter);
Vue.use(VueStripeCheckout, 'pk_test_LNjJFLPIJXHC0vhQLe5yR6d900GIABJ1vq');

Vue.use(VueResource);

const router = new VueRouter({routes})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
