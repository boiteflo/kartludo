<template>
    <div>
        <div v-if="loading">
          Chargement
        </div>
        <div v-else>
          <v-dialog v-model="showDeck">
            <panel-deck v-if="deckSelected" :deck="deckSelected" :buttonpage="true"
              v-on:unselect="unselect">
            </panel-deck>
          </v-dialog>

          <div v-if="themeSelected" style="position:relative">
            <icon-theme :text="themeSelected.Title" 
              :subtext="themeSelected.DecksLength + ' decks'"
              :image="themeSelected.CardImage" 
              style="position:absolute; right:5px; top:5px">
            </icon-theme>

            <div class="flex bg" style="">
              <h1>Thème : {{themeSelected.Title}}</h1>
              
              <v-btn class="m5px" style="margin-top:35px !important" @click="showTheme(null)">
                  <v-icon color="red">mdi-arrow-left-bottom</v-icon>Retour
              </v-btn>
            </div>
            <h1 style="padding-top:5px;">Les Decks </h1>
            <h2><v-icon color="white">mdi-check-decagram</v-icon>Validé par les modérateurs du Discord </h2>
            <div class="flex-wrap flex-center bg2">
                <iconDeck v-for="deck in themeSelected.Decks" 
                  :deck="deck" 
                  v-bind:key="deck.Id" 
                  v-on:select="selectDeck(deck)">
                </iconDeck>
            </div>
            
            <h1>Les Decks de la communauté</h1>
            <h2><v-icon color="white">mdi-alert</v-icon>La validation reste a faire </h2>
            <div class="flex-wrap flex-center bg2">
                <iconDeck v-for="deck in themeSelected.DecksCommunity" 
                  :deck="deck" 
                  v-bind:key="deck.Id" 
                  v-on:select="selectDeck(deck)">
                </iconDeck>
            </div>
          </div>

          <div v-else :key="refreshThemes">
            <h1>Les Themes</h1>
            <h2><v-icon color="white">mdi-animation</v-icon> Principaux</h2>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="theme in themes.filter(x=> x.Group === '1')" 
                v-bind:key="theme.Id" 
                v-on:select="showTheme(theme)" 
                :text="theme.Title" 
                :subtext="theme.DecksLength + ' decks'"
                :image="theme.CardImage">
              </icon-theme>
            </div>

            <h2><v-icon color="white">mdi-axe</v-icon> Thématique</h2>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="theme in themes.filter(x=> x.Group === '2')" 
                v-bind:key="theme.Id" 
                v-on:select="showTheme(theme)" 
                :text="theme.Title" 
                :subtext="theme.DecksLength + ' decks'"
                :image="theme.CardImage">
              </icon-theme>
            </div>
            
            <h2><v-icon color="white">mdi-arm-flex</v-icon> Autre</h2>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="theme in themes.filter(x=> x.Group === '3')" 
                v-bind:key="theme.Id" 
                v-on:select="showTheme(theme)" 
                :text="theme.Title" 
                :subtext="theme.DecksLength + ' decks'"
                :image="theme.CardImage">
              </icon-theme>
            </div>
          </div>
        </div>
        
        <div class="flex-center">
          <v-btn class="m5px" v-if="themeSelected" @click="showTheme(null)">
              <v-icon color="red">mdi-arrow-left-bottom</v-icon> Voir tous les thèmes
          </v-btn>
          <router-link :to="'/deck/new'" >
            <v-btn target="_blank" text class="bg m5px">
              <v-icon>mdi-plus</v-icon> Ajouter un deck
            </v-btn>
          </router-link>
        </div>
    </div>
</template>


<script>
import helperString from '../helpers/helperString'
import ServiceBack from '../services/serviceBack'

import { store } from '../data/store.js'
import panelDeck from '../components/panelDeck';
import iconTheme from '../components/iconTheme';
import iconDeck from '../components/iconDeck';

export default {
  name: 'pageDecks',
  components: {iconTheme, iconDeck, panelDeck},
  data: () => ({
    loading:true,
    store: store,
    refreshThemes: 0,
    decksObject: null,
    themes: null,
    themeSelected: null,
    deckSelected: null,
    showDeck: false,
    createDeck: false
  }),
  mounted(){
    ServiceBack.getAll('themes').then(res => {
      this.themes = res;
      this.loading=false;
      this.linkThemeWithDecks();
    });   
    ServiceBack.getAll('decks').then(res => {
      this.decksObject = res;
      this.linkThemeWithDecks();
    });   
  },
  methods: {
    linkThemeWithDecks(){
      if(!this.themes || !this.decksObject)
        return;
      
      this.themes.forEach(theme => {
        theme.Decks = this.decksObject.Decks.filter(x=> theme.Id==='tous' || x.Themes.split(',').includes(theme.Id));
        theme.DecksCommunity = this.decksObject.DecksCommunity.filter(x=> theme.Id==='tous' ||x.Themes.split(',').includes(theme.Id));
        theme.DecksLength = theme.Decks.length + theme.DecksCommunity.length;
      });
      
      this.refreshThemes++;
    },
    showTheme(theme){
      this.themeSelected = theme;
      window.scrollTo(0, 0);
    },
    selectDeck(deck){
      this.deckSelected=deck;
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
      this.showDeck = true;
    },
    unselect(){
      this.deckSelected=null;
      this.showDeck = false;
    }
  }
};
</script>
