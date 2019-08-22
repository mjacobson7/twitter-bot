import Landing from './components/Landing.vue'
import Dashboard from './components/Dashboard.vue'
import Subscribe from './components/Subscribe.vue'
import Payment from './components/Payment.vue'
import Login from './components/Login.vue'

export const routes = [
    { path: '/', component: Landing },
    { path: '/subscribe', component: Subscribe },
    { path: '/dashboard', component: Dashboard },
    { path: '/payment', component: Payment },
    { path: '/login', component: Login }
]