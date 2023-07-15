
<template>
  <v-app>
    <v-main>

      <menuBar :database="databaseFront" v-on:search="search"></menuBar>
      <panelSearchCard v-if="selectedCards && selectedCards.length > 0" :cards="selectedCards">
      </panelSearchCard>
      <router-view v-else>
      </router-view>
    </v-main>
  </v-app>
</template>

<style>
  @import './style.css';
</style>

<script>
import DatabaseFront from "./data/databaseFront.json";

import menuBar from './components/menuBar';
import panelSearchCard from './components/panelSearchCard';

export default {
  name: 'App',

  components: {
    menuBar, panelSearchCard
  },

  data: () => ({
    cards: null,
    selectedCards: [],
    databaseFront : DatabaseFront
  }),
  
  mounted() {    
    this.databaseFront.cards.filter(x=> x.LimitFriends).forEach(x => {
      let ids = x.LimitFriends.split(',');
      x.LimitFriendsCards = this.databaseFront.cards.filter(x=> ids.includes(x.Id));
    });    
  },
  methods: {
    search(value){
      this.selectedCards = !value || value.length < 3 ? []
        : this.databaseFront.cards.filter(x=> 
          x.NameEn.toLowerCase().includes(value.toLowerCase())
          || (x.NameFr && x.NameFr.toLowerCase().includes(value.toLowerCase()))).slice(0, 50);
    },
  }
};
</script>
