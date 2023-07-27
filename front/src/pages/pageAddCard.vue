<template>
    <div>
        <div class="flex flex-responsive">
            <div style="flex-grow:3; flex-basis: 0">
                <h1>AJOUTER UNE CARTE</h1>
                <v-text-field class="flex-grow p5px"
                            hide-details
                            v-model="searchString"
                            label="Chercher une carte (EN)"
                            @input="search">
                </v-text-field>
                <panel-cards v-if="cardsFiltered && cardsFiltered.length > 0" 
                            :size="100" 
                            :cards="cardsFiltered"
                            @hover="showCard"
                            @select="selectCard">
                </panel-cards>
                <div class="bg2">
                    <h3 class="p5px colorWhite">Les cartes a ajouter</h3>
                    <panel-cards v-if="cardToAdd && cardToAdd.length > 0" 
                                :size="100" 
                                :cards="cardToAdd"
                                @hover="showCard">
                    </panel-cards>
                </div>
            </div>
            <div style="flex-grow:1; flex-basis: 0" class="bg">
                <card-image v-if="cardHover" 
                    :card="cardHover"
                    :badgeoff="true"
                    :size="300">
                </card-image>
                <div v-else class="bg w100p" style="height:437px">
                </div>
                <h3 class="m5px" style="color:white">Cartes séléctionnées</h3>
                
                <panel-cards v-if="cardsSelected && cardsSelected.length > 0" 
                            :size="50" 
                            :cards="cardsSelected"
                            @hover="showCard"
                            @select="unselectCard">
                </panel-cards>

                <v-btn class="m5px bg2 w100p colorWhite" :disabled="cardsSelected.length <1" @click="addCards">
                    Sauvegarder
                </v-btn>
            </div>
        </div>
    </div>
</template>


<script>
import ServiceBack from '../services/serviceBack'
import panelCards from '../components/panelCards.vue'
import cardImage from '../components/cardImage.vue'

export default {
  name: 'pageDeck',
  components: {panelCards, cardImage},
  data: () => ({
    cards: null,
    cardToAdd : null,
    cardsFiltered: null,
    cardHover: null,
    cardsSelected: [],
    searchString: ""
  }),
  async mounted(){
      ServiceBack.getAll('cardMDM').then(result => {
        this.cards = result;
      });
      ServiceBack.getAll('cardToAdd').then(result => {
        this.cardToAdd = result;
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
