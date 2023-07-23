
<template>
  <v-app>
    <v-main>
      <menuBar v-on:search="search"></menuBar>
      <panel-cards class="bg" v-if="selectedCards && selectedCards.length > 0" :cards="selectedCards"  tooltip="text">
      </panel-cards>
      <router-view v-else>
      </router-view>
    </v-main>
  </v-app>
</template>

<style>
  @import './style.css';
</style>

<script>
import { store } from './data/store.js'
import ServiceBack from './services/serviceBack'
import serviceMain from './services/serviceMain'

import menuBar from './components/menuBar';
import panelCards from './components/panelCards';

export default {
  name: 'App',

  components: {
    menuBar, panelCards
  },

  data: () => ({
    cards: null,
    selectedCards: [],
    store: store
  }),
  
  mounted() {    
    ServiceBack.getAll('cards').then(result => {
      this.cards = result;
      store.cards = this.cards;
    });   
  },
  methods: {
    search(value){
      this.selectedCards = serviceMain.filterCard(this.cards, value);
    },
  }
};
</script>
