
<template>
  <v-app>
    <v-main>
      <div class="bg w100p h100p" v-if="!store.formatSelected">
        CHARGEMENT EN COURS
      </div>
      <div v-else >
        <img v-if="konamiCode" class="bg" style="width:100%; height:100%" :srcset="require('./assets/konamiCode.webp')">
        <div v-else>
          <menuBar v-on:search="search" v-on:filter="showOrHideFilter"></menuBar>
          <v-dialog v-model="showFilter">
            <panel-card-filter v-if="showFilter" :keyid="'home'" :filter="filter" v-on:hide="showOrHideFilter" v-on:filter="defineFilter">
            </panel-card-filter>
          </v-dialog> 

          <div v-if="selectedCards && selectedCards.length > 0" class="bg2">
            <panel-cards   :cards="selectedCards.slice(0,filter.limit)"  tooltip="text" :size="filter.imageWidth">
            </panel-cards>
            <v-chip class="bg w100p m5px">Cartes Affichées : {{Math.min(filter.limit,filter.length)}} / {{filter.length}}</v-chip>
          </div>

          <router-view>
          </router-view>

          <div v-if="store.animatedImage">
            <transition :name="store.animatedImage.Animation" appear>
              <img :src="store.animatedImage.Image" 
                :style="{width: store.animatedImage.Width + 'px', position: 'absolute', top: store.animatedImage.Y +'px', left: store.animatedImage.X+'px', 'z-index':2}">
            </transition>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style>
  @import './style.css';
</style>

<script>
import { forkJoin } from 'rxjs';
import { store } from './data/store.js'
import Konami from 'konami';
import ServiceBack from './services/serviceBack'
import ServiceMain from './services/serviceMain'
import ServiceFormat from './services/serviceFormat'

import menuBar from './components/menuBar';
import panelCards from './components/panelCards';
import panelCardFilter from './components/panelCardFilter.vue';

export default {
  name: 'App',

  components: {
    menuBar, panelCards, panelCardFilter
  },

  data: () => ({
    store: store,
    selectedCards: [],
    konamiCode : false,
    animatedCard: null,
    showFilter:false,
    filter: {
      search: '',
      type : null,
      subType : null,
      attribute: null,
      race : null,
      searchEffect: null,
      limit: 50,
      length:0,
      imageWidth: 150
    }
  }),
  
  mounted() {
    new Konami(() => this.konamiCode=true);
    forkJoin([
        ServiceBack.getAll('card'), 
        ServiceBack.getAll('format')
      ]).subscribe(results => {
      store.formats = results[1];
      let formatResult = ServiceFormat.setFormat(store.formats[store.formats.length-2], results[0]);
      store.cards = formatResult.cards;
      store.formatSelected = formatResult.format;
    });
  },
  methods: {
    refreshSearch(){
      this.selectedCards = ServiceMain.filterCard(store.cards, store.formatSelected, this.filter);
      window.scrollTo(0, 0);
    },
    search(value){
      this.filter.search = value;
      if(!value || value.trim().length < 1)
        this.selectedCards=[];
      else
        this.refreshSearch();
    },
    showOrHideFilter(){
      this.showFilter=!this.showFilter;
    },
    defineFilter(filter){
      this.filter = {...filter, search: this.filter.search};
      this.showFilter=false;
      this.refreshSearch();
    }
  }
};
</script>
