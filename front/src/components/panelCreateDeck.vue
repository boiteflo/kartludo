<template>
    <div v-if="selectMainCards">   
        <panel-deck-cards :cards="deck.DeckListCards"
                    tooltip="image"
                    @select="selectFav"
                    :size="50" >
        </panel-deck-cards> 
        <div class="flex-center">
            <card-image v-for="card in deck.MainCards" 
                v-bind:key="'ForFav'+card.IdName" 
                :card="card"
                :badgeoff="badgeoff"
                :size="size"
                v-on:select="selectFavToRemove">
            </card-image>
        </div>  
        <div class="flex-center">
            <v-btn class="m5px bg" @click="selectMainCards=false">
                Valider
            </v-btn>
        </div>  
    </div>
    <div v-else-if="selectThemes">
        <div class="flex-wrap">
            <v-btn class="m5px bg" style="width:275px; height:340px;" @click="selectThemes=false">
                Valider
            </v-btn>
            <icon-theme v-for="theme in themes.filter(x=> x.Id!=='tous' && !deck.ThemesId.includes(x.Id))" 
                v-bind:key="theme.Id" 
                v-on:select="selectTheme(theme)" 
                :text="theme.Title" 
                :image="theme.CardImage">
            </icon-theme>
            <v-btn class="m5px bg" style="width:275px; height:340px;" @click="selectThemes=false">
                Valider
            </v-btn>
        </div>
    </div>
    <div v-else>
        <h2>Créer un deck</h2>
        
        <div class="m5px">
            <div class="flex-wrap flex-center">
                <v-text-field class="m5px" label="Nom du deck" hide-details
                            v-model="deck.Title">
                </v-text-field>
                <v-text-field class="m5px" label="Auteur" hide-details
                            v-model="deck.Author">
                </v-text-field>
                <v-combobox :disabled="!deck.Rank" v-model="deck.Rank" label="Classement" :items="ranks" item-text="Title">
                </v-combobox>
            </div>
            
            <div class="flex">
            <v-alert v-if="deck.Errors" type="error" class="m5px">
                {{deck.Errors}}
            </v-alert>
            <v-alert v-else type="success" class="m5px">
                Ce deck respecte la ban list du format
            </v-alert>
            <v-alert type="info" class="m5px bg">
                Nombre de carte du deck : {{deck.DeckLength}}
            </v-alert>
            </div>

            <div v-if="$vuetify.breakpoint.width >= 930" class="flex">
                <div class="bg" style="flex-grow:2; flex-basis: 0">
                    <div class="bg2 flex flex-center">
                        <div style="color:white; margin: 10px 5px 5px 5px">Lorsque je sélectionne une carte : </div>
                        <v-btn :class="{bg: deckClickMode===0, bg2: deckClickMode!==0, m5px:true}"  @click="deckClickMode=0">
                            Supprimer
                        </v-btn>
                        <v-btn :class="{bg: deckClickMode===1, bg2: deckClickMode!==1, m5px:true}"  @click="deckClickMode=1">
                            Changer l'ordre
                        </v-btn>
                    </div>
                    <panel-deck-cards :cards="deck.DeckListCards"
                                :size="75"
                                @select="selectCardFromDeck"
                                @hover="showCard"
                                v-bind:key="refreshCards">
                    </panel-deck-cards>
                </div>
                <div class="bg2" style="width:310px">
                    <h3 class="m5px" style="color:white">Ajouter des Staples</h3>
                    <div class="flex flex-space-around">
                        <v-btn class="" :disabled="!staples" @click="showStaples('stapleMonster')">
                            Monstre
                        </v-btn>
                        <v-btn class="" :disabled="!staples" @click="showStaples('stapleSpell')">
                            Magie
                        </v-btn>
                        <v-btn class="" :disabled="!staples" @click="showStaples('stapleTrap')">
                            Piège
                        </v-btn>
                    </div>
                    <card-image v-if="cardHover" 
                        :card="cardHover"
                        :badgeoff="true"
                        :size="300">
                    </card-image>
                    <br>
                </div>
                <div style="flex-grow:1; max-width:357px;flex-basis: 0">
                    <v-text-field
                            solo class="m5px"
                            hide-details
                            label="Chercher une carte (FR ou EN)"
                            color="#212A3C"
                            append-inner-icon="mdi-magnify"
                            v-model="searchString"
                            @input="search">
                    </v-text-field>
                    <panel-cards v-if="selectedCards && selectedCards.length > 0"
                                :size="75" 
                                :cards="selectedCards"
                                @select="selectCard"
                                @hover="showCard">
                    </panel-cards>                    
                </div>
            </div>
            <div v-else>
                <div class="bg">
                    <h3 class="m5px" style="color:white">Ajouter des Staples</h3>
                    <div class="flex flex-space-around">
                        <v-btn class="" :disabled="!staples" @click="showStaples('stapleMonster')">
                            Monstre
                        </v-btn>
                        <v-btn class="" :disabled="!staples" @click="showStaples('stapleSpell')">
                            Magie
                        </v-btn>
                        <v-btn class="" :disabled="!staples" @click="showStaples('stapleTrap')">
                            Piège
                        </v-btn>
                    </div>
                    <v-text-field
                            solo class="m5px"
                            hide-details
                            label="Chercher une carte (FR ou EN)"
                            color="#212A3C"
                            append-inner-icon="mdi-magnify"
                            v-model="searchString"
                            @input="search">
                    </v-text-field>
                    <panel-cards v-if="selectedCards && selectedCards.length > 0" 
                                :size="50" 
                                tooltip="image"
                                :cards="selectedCards"
                                @select="selectCard">
                    </panel-cards>
                </div>
                <panel-deck-cards :cards="deck.DeckListCards"
                            @select="selectCardFromDeck"
                            tooltip="image"
                            :size="50" 
                            v-bind:key="refreshCards">
                </panel-deck-cards>
                <div class="bg2 flex flex-center" style="color:white">Lorsque je sélectionne une carte :</div>
                <div class="bg2 flex flex-center">
                    <v-btn :class="{bg: deckClickMode===0, bg2: deckClickMode!==0, m5px:true}"  @click="deckClickMode=0">
                        Supprimer
                    </v-btn>
                    <v-btn :class="{bg: deckClickMode===1, bg2: deckClickMode!==1, m5px:true}"  @click="deckClickMode=1">
                        Changer l'ordre
                    </v-btn>
                </div>
            </div>
            <br>
            <h3 >Les Thèmes</h3>
            <div class="flex-wrap">
                <v-btn class="m5px bg" @click="selectThemes=true">
                    Modifier
                </v-btn>
                <v-chip class="m5px"
                    v-for="theme in deck.Themes" 
                    v-bind:key="'selected'+ theme.Id">{{theme.Title}}
                </v-chip>
            </div>

            <div class="flex-wrap flex-reverse">
                <v-btn class="m5px bg" :disabled="deck.DeckListCards.length <1 || deck.MainCards.length <1 || deck.Themes.length < 1" @click="$emit('save', deck)">
                    Sauvegarder
                </v-btn>
                <v-btn class="m5px bg" @click="selectMainCards=true">
                    Sélectionner la carte principale
                </v-btn>
                <v-btn class="m5px bg" @click="selectThemes=true">
                    Sélectionner les thèmes
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from '../data/store.js'
import ServiceMain from '../services/serviceMain'
import ServiceDeck from '../services/serviceDeck'
import ServiceBack from '../services/serviceBack'
import helperString from '../helpers/helperString'
import helperArray from '../helpers/helperArray'

import cardImage from './cardImage.vue'
import panelCards from './panelCards.vue'
import iconTheme from '../components/iconTheme';
import panelDeckCards from './panelDeckCards.vue'
let md5 = require('md5');

  export default {
    name: 'panel-create-deck',
    components: {
        cardImage, panelCards, panelDeckCards, iconTheme
    },
    data: () => ({
        themes: null,
        data: null,
        deck: {DeckListCards:[], MainCards: [], Themes: [], ThemesId: [], Rank: null},
        searchString: '',
        selectedCards: [],
        refreshCards:0,
        refreshFavCards:0,
        selectMainCards: false,
        selectThemes: false,
        cardHover:null,
        staples: null,
        ranks: null,
        deckClickMode : 0 // 0 = delete card, 1 = switch order
    }),
    mounted(){
        ServiceBack.getAll('themes').then(res => {
            this.themes = res;
        });  
        ServiceBack.getAll('data').then(res => {
            this.staples = {
                stapleMonster: res.find(x=> x.Id === 'stapleMonster'),
                stapleSpell: res.find(x=> x.Id === 'stapleSpell'),
                stapleTrap: res.find(x=> x.Id === 'stapleTrap')
            };
            this.ranks = JSON.parse(res.find(x=> x.Id === 'ranks').Value);
            this.deck.Rank= this.ranks.find(x=> x.Id ==3);
        }); 
        
        this.deck.Errors = ServiceDeck.getErrors(this.deck, this.deck.DeckListCards);
    },
    methods: {
        search(value){
            this.selectedCards = ServiceMain.filterCard(store.cards, value);
        },
        selectCard(card){
            let alreadyExist = this.deck.DeckListCards.find(x=> x.Card.IdName == card.IdName);
            if(alreadyExist){
                alreadyExist.Quantity = "2";
                this.refreshCards++;
            }
            else
                this.deck.DeckListCards.push({Id: card.IdName, Card:card});
            
            this.deck.Errors = ServiceDeck.getErrors(this.deck, this.deck.DeckListCards);
        },
        selectCardFromDeck(card){
            let cardObject = this.deck.DeckListCards.find(x=> x.Card.IdName === card.IdName);
            if(!cardObject)
                return;
            
            // Change Order
            if(this.deckClickMode === 1)
            {
                this.deck.DeckListCards = helperArray.move(this.deck.DeckListCards, 'Id', {Id:card.IdName}, -1);
                this.refreshCards++;
                return;
            }

            // Remove card
            if(cardObject.Quantity === "2")
            {
                cardObject.Quantity = null;
                this.refreshCards++;
                return;
            }

            this.deck.DeckListCards = this.deck.DeckListCards.filter(x=> x.Card.IdName !== cardObject.Card.IdName);
            
            this.deck.Errors = ServiceDeck.getErrors(this.deck, this.deck.DeckListCards);
        },
        selectFav(card){
            this.deck.MainCards.push(card);
            this.refreshFavCards++;
        },
        selectFavToRemove(card){
            this.deck.MainCards = this.deck.MainCards.filter(x=> x.IdName !== card.IdName);
            this.refreshFavCards++;
        },
        cryptPassword(){
            this.deck.Password = md5(this.deck.PasswordApparent);
        },
        selectTheme(theme){
            let alreadyExist = this.deck.Themes.find(x=> x.Id === theme.id);
            if(!alreadyExist){                
                this.deck.Themes.push(theme);
                this.deck.ThemesId.push(theme.Id);
            }
        },
        unselectTheme(theme){
            this.deck.ThemesId = this.deck.ThemesId.filter(x=> x !== theme.Id);
            this.deck.Themes = this.deck.Themes.filter(x=> x.Id !== theme.Id);
        },
        showCard(card){
            this.cardHover = card;
        },
        showStaples(key)
        {
            let stapleIdNames = this.staples[key].Value.split(",").map(x=> helperString.cleanup(x));
            this.searchString = this.staples[key].Title;
            this.selectedCards = store.cards
                .filter(x=> stapleIdNames.includes(x.IdName))
                .slice(0, 50);
        }
    }
  }
</script>
