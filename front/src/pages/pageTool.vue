<template>
    <div>
        <h1>CHERCHER UNE CARTE</h1>
        <h2 style="padding-bottom:4px;">DANS MASTER DUEL</h2>
        <div class="flex flex-wrap">
          <div class="flex-grow">
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
          <div style="width:310px; height:440px;">
                <card-image v-if="cardHover" 
                    :card="cardHover"
                    :badgeoff="true"
                    :size="300">
                </card-image>
          </div>
        </div>
        <h2>PAR LISTE DE NOM</h2>
        <p class="bg p5px">Parfois il peut être utile de vérifier si des cartes existent ou non dans le format MDOS. Pour cela, il vous suffit de renseigner le nom (en anglais) des cartes dans le champ ci-dessous séparés par un retour a la ligne.</p>
        <v-textarea v-model="text" class="m5px" />
        <div class="flex flex-center flex-wrap">
          <v-btn :class="{m5px:true, bg:lastCall==='mdos'}" @click="searchCards(store.cards, 'mdos')">Les cartes MDOS</v-btn>
          <v-btn :class="{m5px:true, bg:lastCall==='ygo'}" @click="searchCards(allCards, 'ygo')">Les cartes Master Duel</v-btn>
          <v-btn :class="{m5px:true, bg:lastCall==='ygo-mods'}" @click="searchCards(allCards, 'ygo-mods')">Les cartes Master Duel non MDOS</v-btn>
        </div>
        {{result}}
        <panel-cards v-if="cards && cards.length > 0" 
                    :size="150" 
                    tooltip="text"
                    :cards="cards">
        </panel-cards>
        <h2>Liens utiles</h2>
        <div class="p5px bg">
          <p class="m5px">Le lien ci-dessous vont conduit sur un site dédié à Yu-Gi-Oh!. Depuis cette page, on peux retrouver la liste de toutes les cartes qui ont un effet spécifique, ensuite on peux utiliser l'outil ci-dessus pour savoir si oui ou non elles font parties du format MDOS. Par exemple : "Changes battle positions", dans cette liste, on va retrouver des cartes comme "Destiny HERO - Dasher" ou "Guardian Sphinx".</p>
          <a class="m5px" href="https://yugioh.fandom.com/wiki/Category:Cards_by_effect_properties"> Lien vers yugioh.fandom.com </a>
          <p class="m5px">La procédure a suivre est simple, on va sur la page wiki, on suit un lien vers une catégorie d'effet, on copie le contenu des tableaux dans un tableur (Libre Office par exemple), puis on copie la colonne A du tableur que l'on colle dans le champ ci-dessus. Ne reste plus qu'a appuyer sur le bouton : "Chercher dans les cartes MDOS" et voila...</p>
          <p class="m5px">Remarque : Pour certaines catégories d'effet, il y a tellement de carte que le contenu des tableaux est tronqué. Pour cela il faut cliquer sur "... further results (xxx more)" puis dans la nouvelle page, on peux sélectionner le bouton blanc : 500 afin qu'il affiche 500 elements. Ensuite, on utilise le bouton "Previous" afin qu'il affiche les résultats de 1 à 500. Enfin on peux appuyer sur le bouton CSV afin d'obtenir le tableur.</p>
          
        </div>
        <h1>CREER UN DECK</h1>
        <v-btn class="m5px" @click="createDeckByImage()">A partir d'une image</v-btn>
    </div>
</template>


<script>
import { store } from '../data/store.js'
import ServiceBack from '../services/serviceBack'
import helperString from '../helpers/helperString'

import panelCards from '../components/panelCards';
import cardImage from '../components/cardImage.vue'

export default {
  name: 'pageTool',
  components: {panelCards, cardImage},
  data: () => ({
    store: store,
    text: 'Blue-Eyes Chaos MAX Dragon\nBlue-Eyes Shining Dragon',
    cards: [],
    allCards: [],
    result: '',
    lastCall:'',
    searchString:'',
    cardsFiltered:null,
    cardHover:null,
  }),
  async mounted(){
      ServiceBack.getAll('cardMDM').then(result => {
        this.allCards = result;
        this.searchCards(this.allCards, 'ygo');
      });
  },
  methods: {
    search(valueString){
        let value = valueString.toLowerCase();
        this.cardsFiltered = !value || value.length < 2 
        ? []
        : this.allCards
            .filter(x=> x.IdName.includes() || x.NameEn.toLowerCase().includes(value))
            .slice(0, 50);
    },
    showCard(card){
        this.cardHover = card;
    },
    selectCard(){

    },
    searchCards(cards, call){
      let ids = helperString.replaceAll(this.text,",","").split('\n').map(x=> helperString.cleanup(x));
      this.cards = cards.filter(x=> ids.includes(x.IdName));
      if(call==='ygo-mods')
        this.cards = this.cards.filter(x=> !this.store.cards.find(y=> y.IdName === x.IdName));
      this.result = 'Founded : ' + this.cards.length + ' / ' + this.text.split('\n').length;
      this.lastCall = call;
    },
    createDeckByImage(){
      alert('test');
    }
  }
};
</script>
