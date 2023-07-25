
<template>
  <v-app>
    <v-main>
      <div class="bg w100p h100p" v-if="!store.formatSelected">
        CHARGEMENT EN COURS
      </div>
      <div v-else class="bg" style="width:100%; height:100%">
        <img v-if="konamiCode" style="width:100%" :srcset="require('./assets/konamiCode.webp')">
        <div v-else>
          <menuBar v-on:search="search"></menuBar>
          <panel-cards class="bg2" v-if="selectedCards && selectedCards.length > 0" :cards="selectedCards"  tooltip="text">
          </panel-cards>
          <router-view>
          </router-view>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style>
  @import './style.css';
</style>

<!--
<script setup>
  const easterEgg = () => {
    alert('easterEgg');
  };
</script>
-->

<script>
import { forkJoin } from 'rxjs';
import { store } from './data/store.js'
import Konami from 'konami';
import ServiceBack from './services/serviceBack'
import ServiceMain from './services/serviceMain'
import ServiceFormat from './services/serviceFormat'

import menuBar from './components/menuBar';
import panelCards from './components/panelCards';

export default {
  name: 'App',

  components: {
    menuBar, panelCards
  },

  data: () => ({
    store: store,
    selectedCards: [],
    konamiCode : false
  }),
  
  mounted() {
    new Konami(() => this.konamiCode=true);
    forkJoin([
        ServiceBack.getAll('cards'), 
        ServiceBack.getAll('formats')
      ]).subscribe(results => {
      store.formats = results[1];
      let formatResult = ServiceFormat.setFormat(store.formats[store.formats.length-2], results[0]);
      store.cards = formatResult.cards;
      store.formatSelected = formatResult.format;
    });
  },
  methods: {
    search(value){
      this.selectedCards = ServiceMain.filterCard(store.cards, value);
      window.scrollTo(0, 0);
    },
  }
};
</script>
