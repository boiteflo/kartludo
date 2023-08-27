<template>
    <div>
        <div v-if="loading" class="flex-center">
          <v-progress-circular indeterminate :size="200" :width="20" style="margin-top:100px"></v-progress-circular>
        </div>
        <div v-else class="relative">

          <!-- Boutons -->
          <div :class="{flex:true, p5px:true, absolute:$vuetify.breakpoint.width >= 800, bg:$vuetify.breakpoint.width < 800}" style="top:0px; right:0px">
            <router-link :to="'/cubes'" >
              <v-btn target="_blank" text class="bg2 m5px">
                <v-icon>mdi-cube</v-icon> Draft
              </v-btn>
            </router-link>
            <router-link :to="'/deck/new'" >
              <v-btn target="_blank" text class="bg2 m5px">
                <v-icon>mdi-plus</v-icon> Ajouter deck
              </v-btn>
            </router-link>
          </div>
          <hierarchy class="bg" :items="hierarchyArray" @select="selectHierarchy"></hierarchy>

          <!-- Deck sélectionné -->
          <v-dialog v-model="showDeck">
            <div v-if="deckSelected">
              <panel-deck :deck="deckSelected" 
                :buttonpage="true" 
                v-on:unselect="unselectDeck" 
                @duplicate="duplicate">
              </panel-deck>
            </div>
          </v-dialog>

          <div v-if="themeSelected"></div>

          <!-- Format selected Cube -->
          <div v-else-if="formatSelected && formatSelected.Id==='cube'" :key="refreshFormat">
            <h1>Les Boosters</h1>
            <div class="flex-wrap flex-space-around p5px bg2">
                <card-booster v-for="booster in boostersFiltered"
                    :key="booster.Id"
                    :booster="booster"
                    :title="booster.Title" 
                    :image="booster.Image"
                    :color="boosterSelected && boosterSelected.Ref == booster.Ref ? '#3F51B5' : null"
                    @click="selectBooster(booster)">
                </card-booster>
            </div>
          </div>

          <!-- Format selected-->
          <div v-else-if="formatSelected" :key="refreshFormat">
            <h1>Les Themes</h1>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="theme in getThemes(formatSelected.Decks)" 
                v-bind:key="theme.Id" 
                v-on:select="selectTheme(theme)" 
                :text="theme.Title" 
                :text1="theme.DecksLength + ' decks'"
                :image="theme.CardImage">
              </icon-theme>
            </div>
          </div>
          
          <div v-else-if="tournamentSelected"></div>
          
          <!-- Les Formats -->
          <div v-else :key="refreshRanks" class="relative">
            <h1> LES FORMATS 
              <v-btn class="bg2 s40 m5px" @click="goToSearch()">
                <v-icon > mdi-magnify</v-icon> Rechercher
              </v-btn>
            </h1>
              

            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="format in formats" 
                v-bind:key="format.Id" 
                v-on:select="selectFormat(format)" 
                :text="format.Title" 
                :text1="format.Author"
                :text2="format.Date"
                :text3="format.DecksLength + ' decks'"
                :image="format.Image"
                :cards="store.cards"
                :card="format.MainCard">
              </icon-theme>
            </div>

            <h1>LES TOURNOIS</h1>
            <div class="flex-wrap flex-space-around p5px bg2">
              <icon-theme v-for="tournament in tournaments" 
                v-bind:key="tournament.Id" 
                v-on:select="selectTournament(tournament)" 
                :text="tournament.Title" 
                :text1="tournament.Date"
                :image="tournament.MainCardImage">
              </icon-theme>
            </div>
          </div>
        
        <div id="filterBar"></div>
        <hierarchy v-if="!themeSelected && !tournamentSelected" class="bg" :items="hierarchyArray" @select="selectHierarchy"></hierarchy>

        <!-- Filter bar -->
        <div class="flex flex-wrap p5px">
          <div class="flex-grow">
            <combo-card @change="setDeckCardsIncluded">
            </combo-card>
          </div>
          <div class="flex-grow">
            <v-combobox class="m5px"
              v-model="deckAuthor"
              :items="deckAuthors"
              hide-details
              label="Auteur"
              @input="refreshDecks()">
            </v-combobox>
          </div>
          <div class="flex-grow">
            <v-btn class="m5px" 
              @click="selectRank(1)"
              style="height:50px"
              :class="{'bg2':rankSelected && rankSelected.Id == 1}">
              <v-icon>mdi-podium-gold</v-icon>
              META
            </v-btn>
            <v-btn class="m5px" 
              @click="selectRank(2)"
              style="height:50px"
              :class="{'bg2':rankSelected && rankSelected.Id == 2}">
              <v-icon>mdi-podium-silver</v-icon>
              Tier 2
            </v-btn>
            <v-btn class="m5px" 
              @click="sortRarety()"
              style="height:50px"
              :class="{'bg2':sortByRarity}">
              <v-icon>mdi-gold</v-icon>
              Rareté
            </v-btn>
          </div>
        </div>
        
        <!-- Decks -->
        <div class="bg2 p5px">{{deckFiltered.length}} Decks</div>
        <div class="flex-wrap flex-space-around p5px bg2">
          <div v-for="deck in deckFiltered" v-bind:key="'filteredDeck' + deck.Id" style="position:relative">
            <iconDeck :deck="deck" 
              v-on:select="selectDeck(deck)" 
              :rarity="sortByRarity">
            </iconDeck>
          </div>
        </div>
        <h2>LA COMMUNAUTÉ</h2>
        <div class="flex-wrap p5px bg2">
          <v-chip v-for="author in this.deckAuthors" 
            :key="author" 
            :class="{'bg2':sortByRarity, 'm5px':true, 'cursorHand':true}"
            @click="selectAuthor(author)">
            {{author}}
          </v-chip>
        </div>
        
          <!-- Boutons -->
        <div class="flex-wrap flex-center">
          <v-btn class="m5px" v-if="formatSelected || tournamentSelected" @click="selectHierarchy({Id:0})">
              <v-icon color="red">mdi-arrow-left-bottom</v-icon> Revenir au classement
          </v-btn>
          <v-btn class="m5px" v-if="themeSelected" @click="selectHierarchy({Id:1})">
              <v-icon color="red">mdi-arrow-left-bottom</v-icon> Voir tous les thèmes
          </v-btn>
          <router-link :to="'/cubes'" >
            <v-btn target="_blank" text class="bg m5px">
              <v-icon>mdi-cube</v-icon> Ouvrir un cube de Draft
            </v-btn>
          </router-link>
          <router-link :to="'/deck/new'" >
            <v-btn target="_blank" text class="bg m5px">
              <v-icon>mdi-plus</v-icon> Ajouter un deck
            </v-btn>
          </router-link>
        </div>


        </div>

    </div>
</template>


<script>
import { forkJoin } from 'rxjs';
import helperString from '../helpers/helperString'
import helperArray from '../helpers/helperArray'
import ServiceBack from '../services/serviceBack'

import { store } from '../data/store.js'
import hierarchy from '../components/hierarchy';
import panelDeck from '../components/panelDeck';
import iconTheme from '../components/iconTheme';
import iconDeck from '../components/iconDeck';
import comboCard from '../components/comboCard';
import cardBooster from '../components/cardBooster';

export default {
  name: 'pageDecks',
  components: {iconTheme, iconDeck, panelDeck, hierarchy, comboCard, cardBooster},
  data: () => ({
    loading:true,
    store: store,
    formats: null,
    ranks: null,
    staples : null,
    themes: null,
    boosters: null,
    tournaments: null,
    decksObject: null,
    decksAll: null,
    decks: null,
    decksCube: null,
    themeDecks: [],
    currentThemeDecks : null,
    refreshFilteredDecks: true,
    sortByRarity:false,

    deckAuthor:'',
    deckFormat: null,
    deckCardSearch:'',
    deckCardsIncluded:[],
    deckFiltered : [],
    deckAuthors: [],

    hierarchyArray: [{Id:0, Text:'Formats et Tournois'}],
    refreshFormat: 0,
    refreshRanks: 0,
    refreshThemes: 0,
    formatSelected: null,
    rankSelected: null,
    themeSelected: null,
    boosterSelected: null,
    deckSelected: null,
    tournamentSelected:null,
    showDeck: false,
    createDeck: false,
    selectCubeMode:false,
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
        ServiceBack.getAll('tournament'),
        ServiceBack.getAll('booster'),
      ]).subscribe(results => {
        this.staples = {
            stapleMonster: results[0].find(x=> x.Id === 'stapleMonster'),
            stapleSpell: results[0].find(x=> x.Id === 'stapleSpell'),
            stapleTrap: results[0].find(x=> x.Id === 'stapleTrap')
        };
        this.ranks = JSON.parse(results[0].find(x=> x.Id === 'ranks').Value);
        this.ranks = this.ranks.concat([{ "Id":"0","Title": "Tous", "NameEn":"infinite cards"}]);   
        this.themes = results[1].concat([this.themeAll]);
        this.themes.forEach((x,index)=> x.Index = index);

        let formatIds = this.store.formats.map(x=> x.Id);
        this.decks= results[2];
        this.decks.forEach(x=> {
          x.FormatId = formatIds.indexOf(x.Format);
          x.RankTitle = this.ranks.find(y=> y.Id === x.Rank)?.Title
        });

        this.tournaments = results[3];
        this.boosters = results[4];

        this.boostersFiltered = helperArray.sortByProperties([ ...new Set(this.decks.filter(x=> x.Rank === '5').map(x=> x.Format.replace("Cube ",""))
                .reduce((partialSum, a) => partialSum + "+" + a, "")
                .split('+')
                .filter(x=> x && x.trim().length > 0))]
                .map(x=> this.boosters.find(y=> y.Ref === x))
                , "<Id");

        this.formats = this.store.formats
          .filter(x=> x.Title!= 'Test')
          .map(format=> {
            return {
              ...format,
              Image: this.getCardImage(helperString, this.store.cards, format.MainCard),
              DecksLength: this.decks.filter(x=> x.Format === format.Id && x.Rank < 4).length
            }})
          .reverse()
          .concat([
            {Id:'tous', Title:'Tous', MainCard:'Infinite Cards', DecksLength:this.decks.length},
            {Id:'anime', Title:'Animé', MainCard:'Yu-Jo Friendship', DecksLength:this.decks.filter(x=> x.Rank == 4).length},
            {Id:'club', Title:'Club Yu-Gi-Oh!', Image:require('../assets/club.jpg'), DecksLength:0},
            {Id:'cube', Title:'Draft Cube', Image:require('../assets/cube.jpg'), DecksLength:this.decks.filter(x=> x.Rank === '5').length},
          ]);

        this.refreshDecks();
        this.loading=false;
      });
  },
  methods: {
    selectHierarchy(item){
      this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id <= item.Id);
      if(item.Id <1) this.selectFormat(null);
      if(item.Id <1) this.selectTournament(null);
      if(item.Id <2) this.selectTheme(null);
    },
    addToHieararchy(item){
      this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id < item.Id);
      this.hierarchyArray.push(item);
    },
    refreshDecks(){  
        let decks = this.decks;
        if(this.formatSelected && this.formatSelected.Id !== 'tous') {
          if(this.formatSelected.Id === 'anime')
            decks = decks.filter(x=> x.Rank == 4);
          else if(this.formatSelected.Id === 'cube')
            decks = decks.filter(x=> x.Rank == 5);
          else
            decks = decks.filter(x=> x.Format === this.formatSelected.Id);
        }

        if(this.rankSelected) 
          decks = decks.filter(x=> x.Rank == this.rankSelected.Id);

        if(this.boosterSelected) 
          decks = decks.filter(x=> x.Format.replace("Cube ","").split('+').includes(this.boosterSelected.Ref));

        if(this.themeSelected) 
          decks = decks.filter(x=> x.Themes.split(',').includes(this.themeSelected.Id));

        if(this.tournamentSelected) 
          decks = decks.filter(x=> x.IdTournament && x.IdTournament === this.tournamentSelected.Id);
        
        if(this.deckAuthor && this.deckAuthor.length > 0)
          decks = decks.filter(x=> x.Author && x.Author.toLowerCase().includes(this.deckAuthor.toLowerCase()))

        if(this.deckCardsIncluded && this.deckCardsIncluded.length > 0){
          decks = decks.filter(deck=> {
            let deckList = helperString.replaceAll(deck.DeckList, 'x2', '').split(',').map(x=> helperString.cleanup(x));
            let matchs = helperArray.getMatch(deckList, this.deckCardsIncluded );
            return matchs.length === this.deckCardsIncluded.length; 
          });
        }

        this.deckAuthors = [...new Set(decks
          .filter(x=> x.Author)
          .map(x=> x.Author.trim()))]
          .sort();
          
        if(this.sortByRarity)
          this.deckFiltered =helperArray.sortByProperties(decks, '<UR,<SR,<R');
        else
          this.deckFiltered =helperArray.sortByProperties(decks, '>FormatId,<Rank,>Title');
        this.refreshFilteredDecks++;
    },
    getThemes(){
      let themes= [];
      this.deckFiltered.forEach(deck=> {
        let deckThemesIds = deck.Themes.split(',');
        let deckThemes = this.themes.filter(x=> deckThemesIds.includes(x.Id)).map(x=> {return {...x};});
        themes = helperArray.addMissing(themes, deckThemes, 'Id');

        themes
          .filter(x=> deckThemesIds.includes(x.Id))
          .forEach(x=> x.DecksLength = !x.DecksLength ? 1 : x.DecksLength+1);
      });

      return helperArray.sortByProperties(themes, '<Index');
    },
    selectFormat(format){
      this.formatSelected = format;
      this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id<1);

      if(format)
        this.addToHieararchy({Id:1, Text:format.Title});

      this.refreshDecks();
      window.scrollTo(0, 0);
    },
    selectTheme(theme){
      this.themeSelected = theme;
      this.hierarchyArray = this.hierarchyArray.filter(x=> x.Id!=2);

      if(theme)
        this.addToHieararchy({Id:2, Text:theme.Title});

      this.refreshDecks();
      window.scrollTo(0, 0);
    },
    selectRank(id){
      if(!id)
        this.rankSelected=null;
      else if (this.rankSelected && id == this.rankSelected.Id)
        this.selectRank(null);
      else 
        this.rankSelected=this.ranks.find(x=> x.Id == id);

      this.refreshDecks();
    },
    selectBooster(booster){
      if (this.boosterSelected && booster && booster.Ref == this.boosterSelected.Ref)
        this.selectBooster(null);
      else
        this.boosterSelected=booster;
      
      this.refreshDecks();
      this.goToSearch();
    },
    selectAuthor(author){
      if(this.deckAuthor && author && author == this.deckAuthor)
        this.selectAuthor(null);
      else
        this.deckAuthor = author;
      
      this.refreshDecks();
    },
    sortRarety(){
      this.sortByRarity=this.sortByRarity ? false : true;
      this.refreshDecks();
    },
    setDeckCardsIncluded(cards){
      this.deckCardsIncluded = cards.map(x=> x.IdName);
      this.refreshDecks();
    },
    goToSearch(){
      document.getElementById('filterBar').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
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
    selectTournament(tournament){
      this.tournamentSelected=tournament;
      if(tournament){
        this.addToHieararchy({Id:2, Text:tournament.Title});
      }
      this.refreshDecks();
    },
    unselectDeck(){
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
