import Vue from 'vue'
import VueRouter from 'vue-router'

let version = 'V3.2.18';

Vue.use(VueRouter)

Vue.prototype.$version = version;

const routes = [
    // Yu-Gi-Oh!
    {
        path: '/yugioh',
        name: version + ' MDOS Yu-Gi-Oh!',
        component: () =>
            import ('../pages/yugioh/pageHomeYGO.vue')
    },
    {
        path: '/cardAdd',
        name: version + ' MDOS Carte',
        component: () =>
            import ('../pages/yugioh/pageAddCard.vue')
    },
    {
        path: '/format',
        name: version + ' MDOS Format',
        component: () =>
            import ('../pages/yugioh/pageFormat.vue')
    },
    {
        path: '/decks',
        name: version + ' MDOS Deck',
        component: () =>
            import ('../pages/yugioh/pageDecks.vue')
    },
    {
        path: '/deck/:id',
        name: version + ' MDOS Deck',
        component: () =>
            import ('../pages/yugioh/pageDeck.vue')
    },
    {
        path: '/tool',
        name: version + ' MDOS Outils',
        component: () =>
            import ('../pages/yugioh/pageTool.vue')
    },
    {
        path: '/boosters',
        name: version + ' MDOS Boosters',
        component: () =>
            import ('../pages/yugioh/pageBoosters.vue')
    },
    {
        path: '/cube/:id',
        name: version + ' MDOS Cube',
        component: () =>
            import ('../pages/yugioh/pageCube.vue')
    },
    {
        path: '/cubes',
        name: version + ' MDOS Cubes',
        component: () =>
            import ('../pages/yugioh/pageCubes.vue')
    },

    // Daggerheart
    {
        path: '/daggerheart',
        name: version + ' Daggerheart',
        component: () =>
            import ('../pages/daggerheart/pageDaggerheart.vue')
    },
    {
        path: '/character',
        name: version + ' Daggerheart Personnage ',
        component: () =>
            import ('../pages/daggerheart/pageCharacter.vue')
    },
    {
        path: '/cards',
        name: version + ' Daggerheart Cartes',
        component: () =>
            import ('../pages/daggerheart/pageCards.vue')
    },
    {
        path: '/template',
        name: version + ' Créateur',
        component: () =>
            import ('../pages/daggerheart/pageTemplate.vue')
    },
    {
        path: '/fight',
        name: version + ' Fight RPG',
        component: () =>
            import ('../pages/daggerheart/pageFight.vue')
    },
    
    // Gundam
    {
        path: '/gundam',
        name: version + ' Gundam',
        component: () =>
            import ('../pages/gundam/index.vue')
    },
    {
        path: '/gundamTcgFight',
        name: version + ' Gundam TCG',
        component: () =>
            import ('../pages/gundam/GundamTcgFight.vue')
    },
    {
        path: '/gundamTcgTest',
        name: version + ' Gundam TCG',
        component: () =>
            import ('../pages/gundam/GundamTcgTest.vue')
    },

    // Global
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
        path: '/*',
        name: version + ' MDOS',
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
