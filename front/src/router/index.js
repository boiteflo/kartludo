import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


const routes = [
    {
        path: '/deck',
        name: 'deck',
        component: () =>
            import ('../pages/pageDeck.vue')
    },
    {
        path: '/*',
        name: 'home',
        component: () =>
            import ('../pages/pageHome.vue')
    },
]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


export default router
