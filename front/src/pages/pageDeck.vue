<template>
    <div>
        <div v-if="loading">
          Chargement
        </div>
        <div v-else>
          <div v-if="isNew || deck.IsDraft">
              <panel-create-deck :deck="deck" :themes="themes" :staples="staples" @save='saveDeck' 
              ></panel-create-deck>
          </div>
          
          <div v-else-if="deck">
            <panel-deck :deck="deck">
            </panel-deck>
          </div>
        </div>
    </div>
</template>


<script>
import { forkJoin } from 'rxjs';
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
    loading:true,
    ranks: null,
    staples : null,
    themes: null,
    isNew: false,
    id: null,
    deck: null
  }),
  mounted(){
    let uri = window.location.href;
    let i = uri.indexOf("id="); 
    this.isNew = i < 1;

    let calls = [
      ServiceBack.getAll('data'),
      ServiceBack.getAll('theme'),
      ServiceBack.getAll('deck')
    ];

    if(!this.isNew){
      this.id = uri.substring(i+3);
      calls.push(ServiceBack.get('deck', this.id));
    }

    forkJoin(calls).subscribe(results => {
      this.staples = {
          stapleMonster: results[0].find(x=> x.Id === 'stapleMonster'),
          stapleSpell: results[0].find(x=> x.Id === 'stapleSpell'),
          stapleTrap: results[0].find(x=> x.Id === 'stapleTrap')
      };
      this.ranks = JSON.parse(results[0].find(x=> x.Id === 'ranks').Value);
      this.themes = results[1].concat([this.themeAll]);
      this.decks = results[2];
      if(results.length > 3)
        this.showDeck(results[3]);
      this.loading=false;
    });
  },
  methods: {
    showDeck(deck){
      if(!deck)
        window.location.href = '/error/text=Ce%20deck%20n%20existe%20pas'

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
      deck.Themes = [];
      deck.Rank = 3;
      ServiceBack.insert('deck', deck)
        .then(res=> window.location.href = '/deck/id=' + res.data);
    }
  }
};
</script>
