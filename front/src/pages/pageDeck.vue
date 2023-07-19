<template>
    <div>
        <div v-if="loading">
          Chargement
        </div>
        <div v-else>
          <div v-if="createDeck">
              <panel-create-deck @save='saveDeck' @cancel="createDeck=false"
              ></panel-create-deck>
          </div>
          <div v-else>
              <v-dialog v-model="showDeck">
                <panel-deck :deck="deckSelected"
                  v-on:unselect="unselect">
                </panel-deck>
              </v-dialog>
              
              <div v-if="decksObject">
                <h1>Les Decks </h1>
                <h2><v-icon color="white">mdi-check-decagram</v-icon>Validé par les modérateurs du Discord </h2>
                <div class="flex-wrap flex-center">
                    <iconDeck v-for="deck in decksObject.Decks" :deck="deck" v-bind:key="deck.Id" v-on:selected="selectDeck(deck)">
                    </iconDeck>
                </div>
                
                <h1>Les Decks de la communauté</h1>
                <h2><v-icon color="white">mdi-alert</v-icon>La validation reste a faire </h2>
                <div class="flex-wrap flex-center">
                    <iconDeck v-for="deck in decksObject.DecksCommunity" :deck="deck" v-bind:key="deck.Id" v-on:selected="selectDeck(deck)">
                    </iconDeck>
                </div>
              </div>
              <div class="flex-center">
                <v-btn class="m5px bg" @click="createDeck=true">
                    <v-icon color="white">mdi-plus</v-icon>Ajouter un deck
                </v-btn>
              </div>
          </div>
        </div>
    </div>
</template>


<script>
import ServiceBack from '../services/serviceBack'
//const axios = require('axios');

import iconDeck from '../components/iconDeck';
import panelDeck from '../components/panelDeck';
import panelCreateDeck from '../components/panelCreateDeck';

export default {
  name: 'pageDeck',
  components: {iconDeck, panelDeck, panelCreateDeck},
  data: () => ({
    loading:false,
    decksObject: null,
    deckSelected: null,
    showDeck: false,
    createDeck: false
  }),
  mounted(){
    ServiceBack.getAll('decks').then(res => {
      this.decksObject = res;
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
    },
    saveDeck(deck){
      this.loading=true;
      ServiceBack.insert('decks', deck).then(res=> {
        if(res.status === 201)
          ServiceBack.getAll('refresh').then(()=> window.location.reload());
        else
        {
          this.loading = false;
          alert('Une erreur est survenue. Veuillez contacter FlorentOutan sur le discord.')
        }
      });
    }
  }
};
</script>
