<template>
    <div>
        <h1>Outils</h1>
        <v-textarea v-model="text" class="m5px" />
        <div class="flex flex-center">
          <v-btn class="m5px bg" @click="searchCards(store.cards)">Chercher dans les cartes MDOS</v-btn>
          <v-btn class="m5px bg" @click="searchCards(allCards)">Chercher dans toutes les cartes YGO</v-btn>
        </div>
        {{result}}
        <panel-cards v-if="cards && cards.length > 0" 
                    :size="150" 
                    :cards="cards">
        </panel-cards>
    </div>
</template>


<script>
import { store } from '../data/store.js'
import ServiceBack from '../services/serviceBack'
import helperString from '../helpers/helperString'

import panelCards from '../components/panelCards';

export default {
  name: 'pageTool',
  components: {panelCards},
  data: () => ({
    store: store,
    text: '',
    cards: [],
    allCards: [],
    result: ''
  }),
  async mounted(){
      ServiceBack.getAll('cardMDM').then(result => {
        this.allCards = result;
      });
  },
  methods: {
    searchCards(cards){
      let ids = helperString.replaceAll(this.text,",","").split('\n').map(x=> helperString.cleanup(x));
      this.cards = cards.filter(x=> ids.includes(x.IdName));
      this.result = 'Founded : ' + this.cards.length + ' / ' + this.text.split('\n').length;
    }
  }
};
</script>
