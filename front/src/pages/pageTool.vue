<template>
    <div>
        <h1>CHERCHER UNE CARTE</h1>
        <h2>PAR LISTE DE NOM</h2>
        <p class="bg p5px">Parfois il peut être utile de vérifier si des cartes existent ou non dans le format MDOS. Pour cela, il vous suffit de renseigner le nom (en anglais) des cartes dans le champ ci-dessous séparés par un retour a la ligne.</p>
        <div class="flex flew-wrap">
          <v-textarea v-model="text" class="flex-grow m5px" label="Chercher les cartes :" />
          <div class="flex-grow">
            <text-spoiler v-for="idText in result" 
              :key="idText.title" 
              :title="idText.title"
              :text="idText.text">
            </text-spoiler>
          </div>
        </div>
        <div class="flex flex-center flex-wrap">
          <v-btn :class="{m5px:true, bg:lastCall==='mdos'}" @click="searchCards(store.cards, 'mdos')">Les cartes MDOS</v-btn>
          <v-btn :class="{m5px:true, bg:lastCall==='ygo'}" @click="searchCards(allCards, 'ygo')">Les cartes Master Duel</v-btn>
          <v-btn :class="{m5px:true, bg:lastCall==='ygo-mods'}" @click="searchCards(allCards, 'ygo-mods')">Les cartes Master Duel non MDOS</v-btn>
        </div>
        <panel-cards v-if="cards && cards.length > 0" 
                    :keyid="lastCall"
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
        <h2 style="padding-bottom:4px;">CHERCHER DANS MASTER DUEL</h2>
        <div class="flex flex-wrap">
          <div class="flex-grow">
            <v-text-field class="flex-grow p5px"
                        hide-details
                        v-model="searchString"
                        label="Chercher une carte (EN)"
                        @input="search">
            </v-text-field>
            <panel-cards v-if="cardsFiltered && cardsFiltered.length > 0" 
                        keyid="search"
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
        <h1>CREER UN DECK</h1>
        <v-btn class="m5px" @click="createDeckByImage()">A partir d'une image</v-btn>
    </div>
</template>


<script>
import { store } from '../data/store.js'
import ServiceBack from '../services/serviceBack'
import helperString from '../helpers/helperString'

import panelCards from '../components/panelCards';
import cardImage from '../components/cardImage'
import textSpoiler from '../components/textSpoiler'

export default {
  name: 'pageTool',
  components: {panelCards, cardImage, textSpoiler},
  data: () => ({
    store: store,
    text: 'Blue-Eyes Chaos MAX Dragon\nBlue-Eyes Shining Dragon',
    cards: [],
    allCards: [],
    lastCall:'',
    searchString:'',
    cardsFiltered:null,
    cardHover:null,
    notfinded:'',
    result: []
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
    selectCard(){},
    searchCards(cards, call){
      let ids = helperString.replaceAll(this.text,",","")
        .split('\n')
        .filter(x=> x && x.trim().length > 0);

      ids = [...new Set(ids)]
        .map(x=> {return {id: helperString.cleanup(x), name:x};});

      let cardsFinded = [];
      let cardsNotFinded = [];
      let cardsNotMdos = [];
      ids.forEach(idName => {
        let card = cards.find(x=> x.IdName === idName.id && x.Rarity);
        if(!card) card = cards.find(x=> x.IdName === idName.id);

        if(!card) {
          cardsNotFinded.push(idName.name);
          return;
        }

        if(call==='ygo-mods'){
          let mdosCard = this.store.cards.find(x=> x.IdName === idName.id);
          if(!mdosCard) {
            cardsNotMdos.push(idName.name);
          }
          else  return;
        }        

        cardsFinded.push(card);
        
      });

      this.lastCall = call;
      this.cards = cardsFinded;
      this.notfinded = cardsNotFinded.join('\n');
      this.result=[];
      if(cardsNotFinded.length > 0)
        this.result.push({title:`❌ Carte non trouvées ${cardsNotFinded.length}/${ids.length}`, text:cardsNotFinded.join('\n')});

      if(cardsNotMdos.length > 0)
        this.result.push({title:`❔ Carte non MODS ${cardsNotMdos.length}/${ids.length}`, text:cardsNotMdos.join('\n')});

      if(cardsFinded.length > 0)
        this.result.push({title:`✔️ Carte trouvées ${cardsFinded.length}/${ids.length}`, text:cardsFinded.map(x=> x.NameEn).join('\n')});
    },
    createDeckByImage(){
      alert('test');
    }
  }
};
</script>
