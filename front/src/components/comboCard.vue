<template>
    <div class="relative">
        <div class="absolute flex flex-wrap m5px" style="top:-20px; left:180px;">
            <card-image v-for="card in cards" 
                :key="'selected' + card.IdName"                   
                :card="card"
                :badgeoff="true"
                :size="25"
                @select="selectCard(card, false)">
            </card-image>
        </div>

        <v-text-field class="m5px"
            label="Chercher une carte"
            v-model="search"
            @input="searchCard()">
        </v-text-field>

         <v-expand-transition>
            <div v-show="cardsSearched && cardsSearched.length > 0">
                <div class="m5px bg2" style="min-height:128px">
                    <card-image v-for="card in cardsSearched" 
                        :key="'search' + card.IdName"                   
                        :card="card"
                        :badgeoff="true"
                        :size="80"
                        @select="selectCard(card, true)">
                    </card-image>
                </div>
            </div>
        </v-expand-transition>

    </div>
</template>

<script>
import { store } from '../data/store.js'
import cardImage from './cardImage.vue'
import ServiceMain from '../services/serviceMain'

  export default {
    name: 'combo-card',
    props: [],
    components: {cardImage},
    data: () => ({
        store: store,
        cards: [],
        cardsSearched: [],
        search : ''
    }),
    methods: {
        searchCard(){
            this.cardsSearched = ServiceMain
                .filterCard(this.store.cards, null, {search: this.search, sort:'<IdName'})
                .slice(0,13);
        },
        selectCard(card, add){
            this.cards = (add && !this.cards.find(x=> x.IdName === card.IdName)) 
                ? this.cards.concat([card])
                : !add ? this.cards.filter(x=> x.IdName !== card.IdName)
                : this.cards;
            this.$emit('change', this.cards);
        }
    }
  }
</script>
