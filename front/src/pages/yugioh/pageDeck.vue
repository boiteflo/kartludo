<template>
    <header-yugioh>
        <div v-if="loading" class="flex-center">            
          <v-progress-circular indeterminate :size="200" :width="20" style="margin-top:100px"></v-progress-circular>
        </div>
        <div v-else>
          <v-alert type="warning" class="m5px" v-if="deck && deck.IdTournament && deck.TournamentObject?.Actif">
              Notez bien l'url de cette page quelque part car ce deck n'est pas public. Vous ne serez plus capable d'y retourner par la suite.
          </v-alert>

          <div v-if="isNew || deck.IsDraft">
              <panel-create-deck :deck="deck" :themes="themes" :staples="staples" :tournaments="tournaments" @save='saveDeck' 
              ></panel-create-deck>
          </div>
          
          <div v-else-if="deck">
            <panel-deck :deck="deck"
                @duplicate="duplicate">
            </panel-deck>
          </div>
        </div>
      </header-yugioh>
</template>


<script>
import { forkJoin } from 'rxjs';
import helperString from '../../helpers/helperString.js'
import ServiceBack from '../../services/serviceBack.js'
import ServiceFormat from '../../services/serviceFormat.js'
import serviceDeck from '../../services/serviceDeck.js';

import { store } from '../../data/store.js'
import headerYugioh from '../../components/headerYugioh';
import panelDeck from '../../components/panelDeck';
import panelCreateDeck from '../../components/panelCreateDeck';

export default {
  name: 'pageDeck',
  components: {headerYugioh, panelCreateDeck, panelDeck},
  data: () => ({
    loading:true,
    ranks: null,
    tournaments:null,
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
      ServiceBack.getAll('deck'),
      ServiceBack.getAll('tournament'),
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
      this.tournaments = results[3];
      if(results.length > 4)
        this.showDeck(results[4]);
      this.loading=false;
    });
  },
  methods: {
    showDeck(deck){
      if(!deck)
        window.location.href = '/error/text=Ce%20deck%20n%20existe%20pas'

      if(deck.IsDraft && deck.Format)
      {
        let format = store.formats.find(x=> x.Id === deck.Format);
        if(format){
          let formatResult = ServiceFormat.setFormat(format, store.cards);
          store.cards = formatResult.cards;
          store.formatSelected = formatResult.format;
        }
      }

      deck.DeckListCards = [];
      let deckList = deck.DeckList.split(',');
      for(let cardIndex =0 ; cardIndex< deckList.length; cardIndex++)
      {
          const cardNameEn = deckList[cardIndex];
          let quantity = helperString.includesX3(cardNameEn) ? '3' : helperString.includesX2(cardNameEn) ? '2' : '1';
          let cardIdName = helperString.removeX3(helperString.removeX2(helperString.cleanup(cardNameEn)));
          const card = store.cards.find(x=> x.IdName === cardIdName);
          if(card)
              deck.DeckListCards.push({Order:cardIndex, Quantity: quantity, Card: card});
      }

      if(deck.IdTournament)
        deck.TournamentObject = this.tournaments.find(x=> x.Id === deck.IdTournament);
      
      deck.Errors = serviceDeck.getErrors(deck, deck.DeckListCards);
      this.deck = deck;
    },
    saveDeck(deck){
      this.loading=true;
      ServiceBack.insert('deck', deck)
        .then(res=> this.moveUrl('/deck/id=' + res.data));
    },
    duplicate(deck){
      ServiceBack.insert('deck/duplicate', deck)
        .then(res=> window.location.href = '/deck/id=' + res.data);
    }
  }
};
</script>
