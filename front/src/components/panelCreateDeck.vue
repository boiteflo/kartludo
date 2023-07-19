<template>
    <div v-if="selectMainCards">   
        <panel-deck-cards :cards="deck.DeckListCards"
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
    <v-card v-else class="m5px">
        <v-card-title>Créer un deck</v-card-title>
        
        <div class="m5px">
            <div class="flex-wrap flex-center">
                <v-text-field class="m5px" label="Nom du deck"
                            v-model="deck.Title">
                </v-text-field>
                <v-text-field class="m5px" label="Auteur"
                            v-model="deck.Autor">
                </v-text-field>
            </div>
            <div v-if="$vuetify.breakpoint.width >= 800" class="flex">
                <div class="bg" style="flex-grow:3">
                    <panel-deck-cards :cards="deck.DeckListCards"
                                :size="50"
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
                                :cards="selectedCards"
                                @select="selectCard">
                    </panel-cards>
                </div>
                <panel-deck-cards :cards="deck.DeckListCards"
                            @select="selectCardToRemove"
                            :size="50" 
                            v-bind:key="refreshCards">
                </panel-deck-cards>
            </div>
            <br>
            <div class="flex-reverse">
                <v-btn class="m5px bg" :disabled="deck.MainCards.length <1" @click="$emit('save', deck)">
                    Sauvegarder
                </v-btn>
                <v-btn class="m5px bg" @click="selectMainCards=true">
                    Sélectionner les 3 cartes principales
                </v-btn>
                <v-btn class="m5px" :disabled="deck.MainCards.length <1" @click="$emit('cancel')">
                    Annuler
                </v-btn>
            </div>
        </div>
    </v-card>
</template>

<script>
import { store } from '../data/store.js'
import cardImage from './cardImage.vue'
import panelCards from './panelCards.vue'
import panelDeckCards from './panelDeckCards.vue'

  export default {
    name: 'panel-create-deck',
    components: {
        cardImage, panelCards, panelDeckCards
    },
    data: () => ({
        deck: {DeckListCards:[], MainCards: []},
        searchString: '',
        selectedCards: [],
        refreshCards:0,
        refreshFavCards:0,
        selectMainCards: false
    }),
    methods: {
        search(value){
            this.selectedCards = !value || value.length < 3 ? []
                : store.cards.filter(x=> 
                    x.NameEn.toLowerCase().includes(value.toLowerCase())
                    || (x.NameFr && x.NameFr.toLowerCase().includes(value.toLowerCase())))
                .slice(0, 50);
        },
        selectCard(card){
            this.searchString= '';
            this.selectedCards = [];
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
        }
    }
  }
</script>
