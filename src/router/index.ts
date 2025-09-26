import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import NavBarExample from '../components/Nav/NavBarExample.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: WelcomeView
        },
        {
            path: '/navbar-example',
            name: 'navbar-example',
            component: NavBarExample
        }
    ]
})

export default router
