<template>
    <div>
        <menuBar :filteractive="filter.isActive" :version="version" @search="search" @filter="showOrHideFilter"
            @format="selectFormat">
        </menuBar>
        <div v-if="$vuetify.breakpoint.width >= 800" class="bg" style="height:60px;"></div>

        <div class="bg w100p h100p flex-center" v-if="!store.formatSelected">
            <v-progress-circular indeterminate :size="200" :width="20" style="margin-top:100px"></v-progress-circular>
        </div>
        <div v-else>
            <img v-if="konamiCode" class="bg" style="width:100%; height:100%"
                :srcset="require('../assets/konamiCode.webp')">
            <div v-else>

                <v-dialog v-model="showFilter">
                    <panel-card-filter v-if="showFilter" :keyid="'home'" :filter="filter" v-on:hide="showOrHideFilter"
                        v-on:filter="defineFilter" v-on:reset="resetFilter">
                    </panel-card-filter>
                </v-dialog>

                <div v-if="selectedCards && selectedCards.length > 0" class="bg2">
                    <panel-cards :cards="selectedCards.slice(0, filter.limit)" tooltip="text" :size="filter.imageWidth">
                    </panel-cards>
                    <v-chip class="bg w100p m5px">Cartes Affichées : {{ Math.min(filter.limit, filter.length) }} /
                        {{ filter.length }}</v-chip>
                </div>

                <slot></slot>

                <div v-if="store.animatedImage">
                    <transition :name="store.animatedImage.Animation" appear>
                        <img :src="store.animatedImage.Image"
                            :style="{ width: store.animatedImage.Width + 'px', position: 'absolute', top: store.animatedImage.Y + 'px', left: store.animatedImage.X + 'px', 'z-index': 2 }">
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { forkJoin } from 'rxjs';
import { store } from '../data/store.js'
import Konami from 'konami';
import ServiceBack from '../services/serviceBack'
import ServiceMain from '../services/serviceMain'
import ServiceFormat from '../services/serviceFormat'

import menuBar from '../components/menuBarYuGiOh';
import panelCards from '../components/panelCards';
import panelCardFilter from '../components/panelCardFilter.vue';

export default {
    name: 'header-yugioh',
    props: [],
    components: {
        menuBar, panelCards, panelCardFilter
    },

    data: () => ({
        version: '',
        store: store,
        selectedCards: [],
        konamiCode: false,
        animatedCard: null,
        showFilter: false,
        filter: {},
        filterInit: {
            search: '',
            type: null,
            subType: null,
            attribute: null,
            race: null,
            levelmax: 12,
            levelmin: 1,
            searchEffect: null,
            limit: 50,
            length: 0,
            imageWidth: 150,
            sort: '<Type,<MonTyp,>Level,<IdName',
            showAll: false,
            isActive: false
        },
    }),

    mounted() {
        // this.$toastr.s("Message", "Title");

        this.version = this.$version;
        this.filter = { ... this.filterInit };
        new Konami(() => this.konamiCode = true);
        forkJoin([
            ServiceBack.getAll('card'),
            ServiceBack.getAll('format')
        ]).subscribe(results => {
            store.formats = results[1];
            let formatResult = ServiceFormat.setFormat(store.formats[store.formats.length - 2], results[0]);
            store.cards = formatResult.cards;
            store.formatSelected = formatResult.format;
        });
    },
    methods: {
        selectFormat(format) {
            let result = ServiceFormat.setFormat(format, store.cards);
            store.format = result.format;
            store.cards = result.cards;
        },
        refreshSearch() {
            this.selectedCards = ServiceMain.filterCard(store.cards, store.formatSelected, this.filter);
            window.scrollTo(0, 0);
        },
        search(value) {
            if (!value || value.trim().length < 1)
                this.resetFilter();
            else {
                this.filter.search = value;
                this.refreshSearch();
            }
        },
        showOrHideFilter() {
            this.showFilter = !this.showFilter;
        },
        resetFilter() {
            this.filter = { ... this.filterInit };
            this.showFilter = false;
            this.refreshSearch();
        },
        defineFilter(filter) {
            this.filter = filter;
            this.showFilter = false;
            this.refreshSearch();
        }
    }
};
</script>