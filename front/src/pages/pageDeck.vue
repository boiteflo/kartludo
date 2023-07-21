<template>
    <div>
        <div v-if="loading">
          Chargement
        </div>
        <div v-else>
          <div v-if="isNew">
              <panel-create-deck @save='saveDeck'
              ></panel-create-deck>
          </div>
          
          <div v-if="deck">
            <panel-deck :deck="deck">
            </panel-deck>
          </div>
        </div>
    </div>
</template>


<script>
import helperString from '../helpers/helperString'
import ServiceBack from '../services/serviceBack'
//const axios = require('axios');

import { store } from '../data/store.js'
import panelDeck from '../components/panelDeck';
import panelCreateDeck from '../components/panelCreateDeck';

export default {
  name: 'pageDeck',
  components: {panelCreateDeck, panelDeck},
  data: () => ({
    loading:false,
    isNew: false,
    id: null,
    deck: null
  }),
  mounted(){
    let uri = window.location.href;
    let i = uri.indexOf("id="); 
    this.isNew = i < 1;

    if(!this.isNew){
      this.id = uri.substring(i+3);
      
      ServiceBack.get('decks', this.id).then(res => {
        this.showDeck(res);
      }); 
    }
  },
  methods: {
    showDeck(deck){
      deck.DeckListCards = [];
      let deckList = deck.DeckList.split(',');
      for(let cardIndex =0 ; cardIndex< deckList.length; cardIndex++)
      {
          const cardNameEn = deckList[cardIndex];
          let quantity = helperString.includesX2(cardNameEn) ? '2' : '1';
          let cardIdName = helperString.removeX2(helperString.cleanup(cardNameEn));
          const card = store.cards.find(x=> x.IdName === cardIdName);
          if(card)
              deck.DeckListCards.push({Order:cardIndex, Quantity: quantity, Card: card});
      }
        this.deck = deck;
    },
    saveDeck(deck){
      this.loading=true;
      delete deck.Themes;
      ServiceBack.insert('decks', deck).then(res=> {
        if(res.status === 201)
          ServiceBack.getAll('refresh').then(()=> window.location.href = '/decks');
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
