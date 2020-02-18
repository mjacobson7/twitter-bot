import Dashboard from './components/Dashboard.vue';
import Login from './components/Login.vue';
import Admin from './components/Admin.vue';
import axios from 'axios';

export const routes = [
    { path: '/', component: Login },
    {
        path: '/dashboard', component: Dashboard, beforeEnter: (to, from, next) => {
            axios.get('/getAuthenticatedUser').then(response => {
                if (response.data) {
                    next()
                } else {
                    next({ path: '/' })
                }
            })
        }
    },
    {
        path: '/admin', component: Admin, beforeEnter: (to, from, next) => {
            axios.get('/getAuthenticatedUser').then(response => {
                if(response.data && response.data.user.isAdmin) {
                    next()
                } else {
                    next({ path: '/'})
                }
            })
        }
    }
]