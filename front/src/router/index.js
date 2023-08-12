import Vue from 'vue'
import VueRouter from 'vue-router'

let version = 'V2.2.6';

Vue.use(VueRouter)

Vue.prototype.$version = version;

const routes = [
    {
        path: '/error/:id',
        name: version + ' MDOS Error',
        component: () =>
            import ('../pages/pageError.vue')
    },
    {
        path: '/success/:id',
        name: version + ' MDOS Error',
        component: () =>
            import ('../pages/pageSuccess.vue')
    },
    {
        path: '/cardAdd',
        name: version + ' MDOS Carte',
        component: () =>
            import ('../pages/pageAddCard.vue')
    },
    {
        path: '/format',
        name: version + ' MDOS Format',
        component: () =>
            import ('../pages/pageFormat.vue')
    },
    {
        path: '/decks',
        name: version + ' MDOS Deck',
        component: () =>
            import ('../pages/pageDecks.vue')
    },
    {
        path: '/deck/:id',
        name: version + ' MDOS Deck',
        component: () =>
            import ('../pages/pageDeck.vue')
    },
    {
        path: '/duel',
        name: version + ' MDOS Duel',
        component: () =>
            import ('../pages/pageDuel.vue')
    },
    {
        path: '/tool',
        name: version + ' MDOS Outils',
        component: () =>
            import ('../pages/pageTool.vue')
    },
    {
        path: '/boosters',
        name: version + ' MDOS Boosters',
        component: () =>
            import ('../pages/pageBoosters.vue')
    },
    {
        path: '/cube/:id',
        name: version + ' MDOS Cube',
        component: () =>
            import ('../pages/pageCube.vue')
    },
    {
        path: '/cubes',
        name: version + ' MDOS Cubes',
        component: () =>
            import ('../pages/pageCubes.vue')
    },
    {
        path: '/*',
        name: version + 'MDOS',
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
