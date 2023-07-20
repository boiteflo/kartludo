import Vue from 'vue'
import VueRouter from 'vue-router'

let version = 'V1.5.1 ';

Vue.use(VueRouter)


const routes = [
    {
        path: '/deck',
        name: version + 'MSOS Deck',
        component: () =>
            import ('../pages/pageDeck.vue')
    },
    {
        path: '/duel',
        name: version + 'MSOS Duel',
        component: () =>
            import ('../pages/pageDuel.vue')
    },
    {
        path: '/boosters',
        name: version + 'MSOS Boosters',
        component: () =>
            import ('../pages/pageBoosters.vue')
    },
    {
        path: '/*',
        name: version + 'MS Old School',
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
