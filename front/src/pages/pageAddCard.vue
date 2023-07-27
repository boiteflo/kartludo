<template>
    <div>
        <div class="flex flex-responsive">
            <div style="flex-grow:3; flex-basis: 0" class="bgWhite">
                <h1 style="padding-bottom:4px;">AJOUTER UNE CARTE</h1>
                <v-text-field class="flex-grow p5px"
                            hide-details
                            v-model="searchString"
                            label="Chercher une carte (EN)"
                            @input="search">
                </v-text-field>
                <panel-cards v-if="cardsFiltered && cardsFiltered.length > 0" 
                            key=""
                            :size="100" 
                            :cards="cardsFiltered"
                            @hover="showCard"
                            @select="selectCard">
                </panel-cards>
            </div>
            <div style="flex-grow:1; flex-basis: 0">
                <div class="bg2">
                    <h3 class="p5px colorWhite">Les cartes séléctionnées</h3>
                    <panel-cards v-if="cardsSelected && cardsSelected.length > 0" 
                                :size="50" 
                                :cards="cardsSelected"
                                @hover="showCard"
                                @select="unselectCard">
                    </panel-cards>
                    <v-btn class="m5px bg w100p colorWhite" :disabled="cardsSelected.length <1" @click="addCards">
                        Ajouter dans l'onglet EXTRA
                    </v-btn>
                </div>
                <card-image v-if="cardHover" 
                    :card="cardHover"
                    :badgeoff="true"
                    :size="300">
                </card-image>
            </div>
        </div>
    </div>
</template>


<script>
import ServiceBack from '../services/serviceBack'
import { store } from '../data/store.js'

import panelCards from '../components/panelCards.vue'
import cardImage from '../components/cardImage.vue'

export default {
  name: 'pageDeck',
  components: {panelCards, cardImage},
  data: () => ({
    cards: null,
    cardsFiltered: null,
    cardHover: null,
    cardsSelected: [],
    searchString: ""
  }),
  async mounted(){
    let storeCardIds = store.cards.map(x=> x.IdName);
      ServiceBack.getAll('cardMDM').then(result => {
        this.cards = result.filter(x=> !storeCardIds.includes(x.IdName));
      });
  },
  methods: {
    search(valueString){
        let value = valueString.toLowerCase();
        this.cardsFiltered = !value || value.length < 2 
        ? []
        : this.cards
            .filter(x=> x.IdName.includes() || x.NameEn.toLowerCase().includes(value))
            .slice(0, 50);
    },
    selectCard(card){
        this.cardsSelected.push(card);
    },
    unselectCard(card){
        this.cardsSelected = this.cardsSelected.filter(x=> x.IdName !== card.IdName);
    },
    showCard(card){
        this.cardHover = card;
    },
    addCards(){
        ServiceBack.insert('cardToAdd', this.cardsSelected).then(res => {alert(res.data); window.location.reload();});
    }
  }
};
</script>
