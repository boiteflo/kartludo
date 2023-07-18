<template>
    <div class="pageTop">
        <div>
            <h1>Les Decks de la communauté</h1>
            <v-dialog v-model="showDeck">
              <panel-deck :deck="deckSelected"
                v-on:unselect="unselect">
              </panel-deck>
            </v-dialog>
            
            <div class="flex-wrap flex-space-around">
                <iconDeck v-for="deck in decks" :deck="deck" v-bind:key="deck.Id" v-on:selected="selectDeck(deck)">
                </iconDeck>
            </div>
        </div>
    </div>
</template>


<script>
import ServiceBack from '../services/serviceBack'
// const axios = require('axios');

import iconDeck from '../components/iconDeck';
import panelDeck from '../components/panelDeck';

export default {
  name: 'pageDeck',
  components: {iconDeck, panelDeck},
  data: () => ({
    decks: null,
    deckSelected: null,
    showDeck: false
  }),
  mounted(){
    ServiceBack.getAll('decks').then(res => {
      this.decks = res;
    });   
  },
  methods: {
    selectDeck(deck){
      this.deckSelected=deck;
      this.showDeck = true;
    },
    unselect(){
      this.deckSelected=null;
      this.showDeck = false;
    }
  }
};
</script>
