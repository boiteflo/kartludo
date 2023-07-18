<template>
    <v-card v-if="deck">
        <v-card-title>{{deck.Title}}</v-card-title>
        <v-card-subtitle>{{deck.Autor}} - {{deck.Date}}</v-card-subtitle>
        <v-card-text>{{deck.Combo}}</v-card-text>
        
        <div class="flex-wrap flex-center">
            <div class="m5px" style="position:relative" v-for="imageObj in deck.DeckListImages" v-bind:key="imageObj.image">
              <v-tooltip text="Tooltip">
                <template v-slot:activator="{ props }">
                  <div v-bind="props">
                    <img class="w100" :src="imageObj.Image"/>
                    <img class="w100" v-if="imageObj.Quantity === '2'" :src="imageObj.Image" style="position:absolute; top:20px; left:0px"/>
                  </div>
                </template>
              </v-tooltip>
            </div>
        </div>
        <div class="flex-reverse">
          <v-btn class="m5px" @click="$emit('unselect')">
            Retour
          </v-btn>
        </div>
    </v-card>
</template>

<script>
  export default {
    name: 'panel-deck',
    props: ['deck']
  }
</script>
