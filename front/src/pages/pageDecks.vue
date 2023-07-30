<template>
    <div>
        <div v-if="loading">
          Chargement
        </div>
        <div v-else>

          <hierarchy class="bg" :items="hierarchyArray" @select="selectHierarchy"></hierarchy>

          <!-- Deck sélectionné -->
          <v-dialog v-model="showDeck">
            <div v-if="deckSelected">
              <panel-deck :deck="deckSelected" 
                :buttonpage="true" 
                v-on:unselect="unselect" 
                @duplicate="duplicate">
              </panel-deck>
            </div>
          </v-dialog>

          <!-- Tournoi sélectionné -->
          <div v-if="tournamentSelected" style="position:relative">
            <div style="position:absolute; right:30px; top:5px; width:100px; height:100px; overflow: hidden;">
              <img style="width: 150px; object-fit: cover; object-position: -20px -50px;" :src="tournamentSelected.CardImage" />
            </div>

            <h1>Tournoi : {{tournamentSelected.Title}}</h1>
            <h1 style="padding-top:5px;">Les Decks </h1>
            <div class="flex-wrap flex-center bg2">
              <div v-for="deck in tournamentSelected.Decks" v-bind:key="deck.Id" style="position:relative">
                <iconDeck  :deck="deck" v-on:select="selectDeck(deck)">
                </iconDeck>
              </div>
            </div>
          </div>

          <!-- Theme sélectionné -->
          <div v-else-if="themeSelected" style="position:relative">
            <div style="position:absolute; right:30px; top:5px; width:100px; height:100px; overflow: hidden;">
              <img style="width: 150px; object-fit: cover; object-position: -20px -50px;" :src="themeSelected.CardImage" />
            </div>

            <h1>Thème : {{themeSelected.Title}}</h1>
            <h1 style="padding-top:5px;">Les Decks </h1>
            <div class="flex-wrap flex-center bg2">
              <div v-for="deck in currentThemeDecks" v-bind:key="deck.Id" style="position:relative">
                <iconDeck  :deck="deck" v-on:select="selectDeck(deck)">
                </iconDeck>
              </div>
            </div>
          </div>

          <!-- Themes -->
          <div v-else-if="rankSelected" :key="refreshThemes">
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
          
          <!-- Classement -->
          <div v-else :key="refreshRanks">
            <h1>Le classement des decks</h1>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="rank in ranks" 
                v-bind:key="rank.Id" 
                v-on:select="selectRank(rank)" 
                :text="rank.Title" 
                :text1="rank.DecksLength + ' decks'"
                :image="rank.Image">
              </icon-theme>
            </div>
            <h1>Les Tournois</h1>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="tournament in tournaments" 
                v-bind:key="tournament.Id" 
                v-on:select="showTournament(tournament)" 
                :text="tournament.Title" 
                :text1="tournament.Date"
                :image="tournament.MainCardImage">
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
import { forkJoin } from 'rxjs';
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
    ranks: null,
    staples : null,
    themes: null,
    tournaments: null,
    decksObject: null,
    decks: null,
    rankDecks: [],
    themeDecks: [],
    currentThemeDecks : null,

    hierarchyArray: [{Id:0, Text:'Classement et Tournois'}],
    refreshRanks: 0,
    refreshThemes: 0,
    rankSelected: null,
    themeSelected: null,
    deckSelected: null,
    tournamentSelected:null,
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
    forkJoin([
        ServiceBack.getAll('data'),
        ServiceBack.getAll('theme'),
        ServiceBack.getAll('deck'),
        ServiceBack.getAll('tournament')
      ]).subscribe(results => {
        this.staples = {
            stapleMonster: results[0].find(x=> x.Id === 'stapleMonster'),
            stapleSpell: results[0].find(x=> x.Id === 'stapleSpell'),
            stapleTrap: results[0].find(x=> x.Id === 'stapleTrap')
        };
        this.ranks = JSON.parse(results[0].find(x=> x.Id === 'ranks').Value);
        this.themes = results[1].concat([this.themeAll]);
        this.decks = results[2];
        this.tournaments = results[3];
        this.linkThemeWithDecks();
      });   
  },
  methods: {
    linkThemeWithDecks(){
      if(!this.themes || !this.decks || !this.ranks)
        return;

      this.ranks = this.ranks.concat([{ "Id":"0","Title": "Tous", "NameEn":"infinite cards"}]);      

      this.ranks.forEach(rank => {
        rank.Image = store.cards.find(x=> x.IdName === helperString.cleanup(rank.NameEn)).ImageMDM;
        let decks = this.decks.filter(x=> rank.Id==0 || x.Rank === rank.Id);
        rank.DecksLength =decks.length;
        this.rankDecks.push({Id: rank.Id, Value:decks});
      });

      this.tournaments.filter(x=> !x.Actif).forEach(tournament => {
        tournament.Decks = [];
        tournament.Results.split(",").forEach(tournamendDeck => {
          let array = tournamendDeck.split(":");
          let deck = this.decks.find(x=> x.Id === array[1]);
          if(deck)
            tournament.Decks.push(deck);
        })
      });

      this.loading=false;
      this.refreshRanks++;      
    },
    selectHierarchy(item){
      this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id <= item.Id);
      if(item.Id === 0) this.selectRank(null);
      if(item.Id === 0) this.showTournament(null);
      if(item.Id === 1) this.showTheme(null);
    },
    selectRank(rank){
      this.rankSelected = rank;   
      this.themeSelected = null;
      this.deckSelected = null; 
      if(!rank) {
        this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id!=1);
        return;
      }

      this.hierarchyArray.push({Id:1, Text:rank.Title});
      this.themeDecks = [];
      let rankDecks = this.rankDecks.find(x=> x.Id === rank.Id).Value;
      
      this.themes.forEach(theme => {
        let decks = rankDecks.filter(x=> theme.Id==='tous' || helperString.replaceAll(x.Themes,' ','').split(',').includes(theme.Id));
        theme.DecksLength = decks.length;
        this.themeDecks.push({Id: theme.Id, Value: decks});
      });
      this.refreshThemes++;

      window.scrollTo(0, 0);
    },
    showTheme(theme){
      this.themeSelected = theme;
      if(!theme) {
        this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id!=2);
        return;
      }

      this.hierarchyArray.push({Id:2, Text:theme.Title});
      this.currentThemeDecks = this.themeDecks.find(x=> x.Id === theme.Id).Value;
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
    showTournament(tournament){
      this.tournamentSelected=tournament;
      if(tournament){
        this.hierarchyArray.push({Id:2, Text:tournament.Title});
      }
      window.scrollTo(0, 0);
    },
    unselect(){
      this.deckSelected=null;
      this.showDeck = false;
    },
    duplicate(deck){
      ServiceBack.insert('deck/duplicate', deck)
        .then(res=> window.location.href = '/deck/id=' + res.data);
    }
  }
};
</script>
