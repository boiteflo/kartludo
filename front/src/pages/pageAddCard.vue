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
                <text-spoiler v-for="idText in result" 
                    :key="idText.title" 
                    :title="idText.title"
                    :text="idText.text">
                </text-spoiler>    
                <panel-cards v-if="cardsFiltered && cardsFiltered.length > 0" 
                            key=""
                            :size="100" 
                            :cards="cardsFiltered"
                            @hover="showCard"
                            @select="selectCard">
                </panel-cards>
                <h2>Ajouter plusieurs cartes en même temps</h2>          
                <v-textarea v-model="text" class="flex-grow m5px" label="Chercher les cartes (séparé par un retour a la ligne)" />
                <v-btn class="m5px" @click="searchCards">Chercher les cartes Master Duel non MDOS</v-btn>
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
import helperString from '../helpers/helperString'
import { store } from '../data/store.js'

import panelCards from '../components/panelCards.vue'
import cardImage from '../components/cardImage.vue'
import textSpoiler from '../components/textSpoiler'

export default {
  name: 'pageDeck',
  components: {panelCards, cardImage, textSpoiler},
  data: () => ({
    store : store,
    cards: null,
    cardsFiltered: null,
    cardHover: null,
    cardsSelected: [],
    searchString: "",
    text: '',
    result: []
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
    },
    searchCards(){
      let ids = helperString.replaceAll(this.text,",","")
        .split('\n')
        .filter(x=> x && x.trim().length > 0);

      ids = [...new Set(ids)]
        .map(x=> {return {id: helperString.cleanup(x), name:x};});

      let cardsFiltered = [];
      let cardsFinded = [];
      let cardsNotFinded = [];
      let cardsMdos = [];

      ids.forEach(idName => {
        let card = this.cards.find(x=> x.IdName === idName.id && x.Rarity);
        if(!card) card = this.cards.find(x=> x.IdName === idName.id);
        if(!card){
            cardsNotFinded.push(idName.name);
            return;
        }

        let mdosCard = this.store.cards.find(x=> x.IdName === idName.id);
        if(mdosCard){
            cardsMdos.push(idName.name);
            return;
        }

        cardsFinded.push(idName.name);
        cardsFiltered.push(card);        
      });

      this.cardsFiltered  = cardsFiltered;
      this.result=[];
      if(cardsNotFinded.length > 0)
        this.result.push({title:`❌ Carte non trouvées ${cardsNotFinded.length}/${ids.length}`, text:cardsNotFinded.join('\n')});

      if(cardsMdos.length > 0)
        this.result.push({title:`❔ Carte MODS ${cardsMdos.length}/${ids.length}`, text:cardsMdos.join('\n')});

      if(cardsFinded.length > 0)
        this.result.push({title:`✔️ Carte trouvées ${cardsFinded.length}/${ids.length}`, text:cardsFinded.map(x=> x.NameEn).join('\n')});
    },
  }
};
</script>
