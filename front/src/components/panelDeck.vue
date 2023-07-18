<template>
    <v-card v-if="deck">
        <v-card-title>{{deck.Title}}</v-card-title>
        <v-card-subtitle>{{deck.Autor}} - {{deck.Date}}</v-card-subtitle>
        <v-card-text>{{deck.Combo}}</v-card-text>
        <div class="flex-wrap flex-center" v-if="deck.DeckListCards">
          <div v-for="cardObject in deck.DeckListCards" 
                v-bind:key="cardObject.Card.IdName" 
                style="position:relative">
            <card-image :card="cardObject.Card" :badgeoff="false"></card-image>
            <img class="w150" v-if="cardObject.Quantity === '2'" :src="cardObject.Card.Image" style="position:absolute; top:32px; left:5px"/>
          </div>
            <!--<div class="m5px" style="position:relative" v-for="imageObj in deck.DeckListImages" v-bind:key="imageObj.image">
              <v-tooltip text="Tooltip">
                <template v-slot:activator="{ props }">
                  <div v-bind="props">
                    <img class="w100" :src="imageObj.Image"/>
                  </div>
                </template>
              </v-tooltip>
            </div>-->
        </div>
        <div class="flex-reverse">
          <v-btn class="m5px" @click="$emit('unselect')">
            Retour
          </v-btn>
        </div>
    </v-card>
</template>

<script>
import cardImage from './cardImage';

  export default {
    name: 'panel-deck',
    props: ['deck'],
    components: {cardImage},
  }
</script>
