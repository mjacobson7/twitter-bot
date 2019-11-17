import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'
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
    }
]