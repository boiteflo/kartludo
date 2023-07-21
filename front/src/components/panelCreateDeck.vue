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
            <icon-theme v-for="theme in themes.filter(x=> x.Id!=='tous' && !deck.ThemesId.includes(x.Id))" 
                v-bind:key="theme.Id" 
                v-on:select="selectTheme(theme)" 
                :text="theme.Title" 
                :image="theme.CardImage">
            </icon-theme>
            <v-btn class="m5px bg" style="width:200px; height:250px;" @click="selectThemes=false">
                Valider
            </v-btn>
        </div>
    </div>
    <div v-else>
        <v-card-title>Créer un deck</v-card-title>
        
        <div class="m5px">
            <div class="flex-wrap flex-center">
                <v-text-field class="m5px" label="Nom du deck" hide-details
                            v-model="deck.Title">
                </v-text-field>
                <v-text-field class="m5px" label="Auteur" hide-details
                            v-model="deck.Author">
                </v-text-field>
                <!--
                <div class="tooltip">
                    <v-icon style="margin-top:20px">
                        mdi-alert
                    </v-icon>
                    <div class="tooltiptext">
                        A saisir lors de la mise a jour du deck. Ce mot de passe est crypté en MD5 dans notre BDD.
                    </div>
                </div>
                <v-text-field class="m5px" label="Mot de passe" type="password" hide-details
                            v-model="deck.PasswordApparent"
                            @blur="cryptPassword">
                </v-text-field>
                -->
            </div>
            <div v-if="$vuetify.breakpoint.width >= 800" class="flex">
                <div class="bg" style="flex-grow:3">
                    <panel-deck-cards :cards="deck.DeckListCards"
                                :size="50"
                                tooltip="image"
                                @select="selectCardToRemove"
                                v-bind:key="refreshCards">
                    </panel-deck-cards>
                </div>
                <div style="flex-grow:1; max-width:357px;">
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
            </div>
            <div v-else>
                <div class="bg">
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
                            @select="selectCardToRemove"
                            tooltip="image"
                            :size="50" 
                            v-bind:key="refreshCards">
                </panel-deck-cards>
            </div>
            <br>
            <h2 v-if="deck.Themes.length > 0"><v-icon color="white">mdi-animation</v-icon>Les Thèmes</h2>
            <div class="flex-wrap">
                <icon-theme v-for="theme in deck.Themes" 
                    v-bind:key="'selected'+ theme.Id" 
                    v-on:select="unselectTheme(theme)" 
                    :text="theme.Title" 
                    :image="theme.CardImage">
                </icon-theme>
            </div>
            <div class="flex-reverse">
                <v-btn class="m5px bg" :disabled="deck.MainCards.length <1" @click="$emit('save', deck)">
                    Sauvegarder
                </v-btn>
                <v-btn class="m5px bg" @click="selectMainCards=true">
                    Sélectionner les 3 cartes principales
                </v-btn>
                <v-btn class="m5px bg" @click="selectThemes=true">
                    Sélectionner les thèmes
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import ServiceBack from '../services/serviceBack'
import { store } from '../data/store.js'

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
        deck: {DeckListCards:[], MainCards: [], Themes: [], ThemesId: []},
        searchString: '',
        selectedCards: [],
        refreshCards:0,
        refreshFavCards:0,
        selectMainCards: false,
        selectThemes: false
    }),
    mounted(){

        ServiceBack.getAll('themes').then(res => {
            this.themes = res;
        });  
    },
    methods: {
        search(value){
            this.selectedCards = !value || value.length < 3 ? []
                : store.cards.filter(x=> 
                    x.NameEn.toLowerCase().includes(value.toLowerCase())
                    || (x.NameFr && x.NameFr.toLowerCase().includes(value.toLowerCase())))
                .slice(0, 50);
        },
        selectCard(card){
            let alreadyExist = this.deck.DeckListCards.find(x=> x.Card.IdName == card.IdName);
            if(alreadyExist){
                alreadyExist.Quantity = "2";
                this.refreshCards++;
            }
            else
                this.deck.DeckListCards.push({Card:card});
        },
        selectCardToRemove(card){
            let cardObject = this.deck.DeckListCards.find(x=> x.Card.IdName === card.IdName);
            if(!cardObject)
                return;
            
            console.log(cardObject);
            if(cardObject.Quantity === "2")
            {
                cardObject.Quantity = null;
                this.refreshCards++;
                return;
            }

            this.deck.DeckListCards = this.deck.DeckListCards.filter(x=> x.Card.IdName !== cardObject.Card.IdName);
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
        }
    }
  }
</script>
