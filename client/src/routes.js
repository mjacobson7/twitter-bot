import Landing from './components/Landing.vue'
import Dashboard from './components/Dashboard.vue'
import Subscribe from './components/Subscribe.vue'
import Payment from './components/Payment.vue'
import Login from './components/Login.vue'
import MyAccount from './components/MyAccount.vue';
import axios from 'axios';

export const routes = [
    { path: '/', component: Landing },
    { path: '/subscribe', component: Subscribe },
    {
        path: '/dashboard', component: Dashboard, beforeEnter: (to, from, next) => {
            axios.get('/getAuthenticatedUser').then(response => {
                if (response.data) {
                    next()
                } else {
                    next({ path: '/login' })
                }
            })
        }
    },
    { path: '/payment', component: Payment },
    { path: '/login', component: Login },
    {
        path: '/my-account', component: MyAccount, beforeEnter: (to, from, next) => {
            axios.get('/getAuthenticatedUser').then(response => {
                if (response.data) {
                    next()
                } else {
                    next({ path: '/login' })
                }
            })
        }
    }
]