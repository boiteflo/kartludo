import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


const routes = [
    {
        path: '/deck',
        name: 'V1.1 MSOS Deck',
        component: () =>
            import ('../pages/pageDeck.vue')
    },
    {
        path: '/*',
        name: 'V1.1 MS Old School',
        component: () =>
            import ('../pages/pageHome.vue')
    },
]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.name;
    next();
  });


export default router
