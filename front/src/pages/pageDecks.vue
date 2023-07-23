<template>
    <div>
        <div v-if="loading">
          Chargement
        </div>
        <div v-else>

          <hierarchy class="bg" :items="hierarchyArray" @select="selectHierarchy"></hierarchy>

          <!-- Deck sélectionné -->
          <v-dialog v-model="showDeck">
            <panel-deck v-if="deckSelected" :deck="deckSelected" :buttonpage="true"
              v-on:unselect="unselect">
            </panel-deck>
          </v-dialog>

          <!-- Theme sélectionné -->
          <div v-if="themeSelected" style="position:relative">
            <div style="position:absolute; right:30px; top:5px; width:100px; height:100px; overflow: hidden;">
              <img style="width: 150px; object-fit: cover; object-position: -20px -50px;" :src="themeSelected.CardImage" />
            </div>

            <h1>Thème : {{themeSelected.Title}}</h1>
            <h1 style="padding-top:5px;">Les Decks </h1>
            <div class="flex-wrap flex-center bg2">
              <div v-for="deck in themeSelected.Decks" v-bind:key="deck.Id">
                <iconDeck  :deck="deck" 
                  v-on:select="selectDeck(deck)">
                </iconDeck>
              </div>
              <div v-for="deck in themeSelected.DecksCommunity" v-bind:key="deck.Id" style="position:relative">
                <iconDeck  :deck="deck" 
                  v-on:select="selectDeck(deck)">
                </iconDeck>
                <div class="s25 tooltip" style="color:red; text-align:center; font-style:bold; border-radius:15px; position:absolute; top:5px; right:5px">
                    <v-icon color="red">mdi-alert</v-icon>
                    <div class="tooltipcard">A Valider</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Classement -->
          <div v-else-if="!rankSelected" :key="refreshRanks">
            <h1>Le classement des decks</h1>
            <p class="bg" style="padding:10px; margin:0px">Même avec toute la volonté du monde, il est quasiment impossible pour le deck de Joey Wheeler de battre un deck Protecteur du tombeau. Mais il a toute ces chances contre les autres decks de sa catégorie. Voici un classement approximatif des decks du format.</p>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="rank in ranks" 
                v-bind:key="rank.Id" 
                v-on:select="selectRank(rank)" 
                :text="rank.Title" 
                :text1="rank.DecksLength + ' decks'"
                :image="rank.Image">
              </icon-theme>
            </div>
          </div>

          <!-- Themes -->
          <div v-else :key="refreshThemes">
            <h1>Les Themes</h1>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="theme in themes.filter(x=> rankSelected.Id==0 || x.DecksLength > 0)" 
                v-bind:key="theme.Id" 
                v-on:select="showTheme(theme)" 
                :text="theme.Title" 
                :text1="theme.DecksLength + ' decks'"
                :image="theme.CardImage">
              </icon-theme>
            </div>
          </div>
        </div>
        
          <!-- Boutons -->
        <div class="flex-wrap flex-center">
          <v-btn class="m5px" v-if="rankSelected" @click="selectRank(null)">
              <v-icon color="red">mdi-arrow-left-bottom</v-icon> Revenir au classement
          </v-btn>
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
import hierarchy from '../components/hierarchy';
import panelDeck from '../components/panelDeck';
import iconTheme from '../components/iconTheme';
import iconDeck from '../components/iconDeck';

export default {
  name: 'pageDecks',
  components: {iconTheme, iconDeck, panelDeck, hierarchy},
  data: () => ({
    loading:true,
    store: store,
    hierarchyArray: [{Id:0, Text:'Classement'}],
    refreshRanks: 0,
    refreshThemes: 0,
    ranks: null,
    decksObject: null,
    themes: null,
    rankSelected: null,
    themeSelected: null,
    deckSelected: null,
    showDeck: false,
    createDeck: false,
    themeAll : {
      "Group": "1",
      "Id": "tous",
      "Title": "Tous",
      "CardImage": "https://images.ygoprodeck.com/images/cards/94163677.jpg"
    }
  }),
  mounted(){
    ServiceBack.get('data', 'ranks').then(res => {
      this.ranks = JSON.parse(res.Value);
      this.linkThemeWithDecks();
    }); 
    ServiceBack.getAll('themes').then(res => {
      this.themes = res.concat([this.themeAll]);
      this.loading=false;
      this.linkThemeWithDecks();
    });   
    ServiceBack.getAll('decks').then(res => {
      this.decksObject = res;
      this.linkThemeWithDecks();
    });   
  },
  methods: {
    selectHierarchy(item){
      this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id <= item.Id);
      if(item.Id === 0) this.selectRank(null);
      if(item.Id === 1) this.showTheme(null);
    },
    linkThemeWithDecks(){
      if(!this.themes || !this.decksObject || !this.ranks)
        return;

      this.ranks = this.ranks.concat([{ "Id":"0","Title": "Tous", "NameEn":"infinite cards"}]);
      
      this.ranks = this.ranks.concat([{ "Id":"10","Title": "T2308#01", "NameEn":"Cup of Ace"}]);

      this.ranks.forEach(rank => {
        rank.Image = store.cards.find(x=> x.IdName === helperString.cleanup(rank.NameEn)).Image;
        rank.Decks = this.decksObject.Decks.filter(x=> rank.Id==0 || x.Rank === rank.Id);
        rank.DecksCommunity = this.decksObject.DecksCommunity.filter(x=> rank.Id==0 || x.Rank === rank.Id);
        rank.DecksLength = rank.Decks.length + rank.DecksCommunity.length;
      });
      this.refreshRanks++;
      
    },
    selectRank(rank){
      this.rankSelected = rank;   
      this.themeSelected = null;
      this.deckSelected = null; 
      if(rank) this.hierarchyArray.push({Id:1, Text:rank.Title});
      else this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id!=1);
      
      this.themes.forEach(theme => {
        theme.Decks = this.rankSelected.Decks.filter(x=> theme.Id==='tous' || x.Themes.split(',').includes(theme.Id));
        theme.DecksCommunity = this.rankSelected.DecksCommunity.filter(x=> theme.Id==='tous' ||x.Themes.split(',').includes(theme.Id));
        theme.DecksLength = theme.Decks.length + theme.DecksCommunity.length;
      });
      this.refreshThemes++;

      window.scrollTo(0, 0);
    },
    showTheme(theme){
      this.themeSelected = theme;
      if(theme) this.hierarchyArray.push({Id:2, Text:theme.Title});
      else this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id!=2);
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
