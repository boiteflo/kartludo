import Vue from 'vue'
import VueRouter from 'vue-router'

let version = 'V1.9.2 ';

Vue.use(VueRouter)


const routes = [
    {
        path: '/error/:id',
        name: version + 'MSOS Error',
        component: () =>
            import ('../pages/pageError.vue')
    },
    {
        path: '/success/:id',
        name: version + 'MSOS Error',
        component: () =>
            import ('../pages/pageSuccess.vue')
    },
    {
        path: '/cardAdd',
        name: version + 'MSOS Carte',
        component: () =>
            import ('../pages/pageAddCard.vue')
    },
    {
        path: '/format',
        name: version + 'MSOS Format',
        component: () =>
            import ('../pages/pageFormat.vue')
    },
    {
        path: '/decks',
        name: version + 'MSOS Deck',
        component: () =>
            import ('../pages/pageDecks.vue')
    },
    {
        path: '/deck/:id',
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
