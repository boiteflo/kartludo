<template>
    <v-card v-if="deck">
        <v-card-title>{{deck.Title}}</v-card-title>
        <v-card-subtitle>{{deck.Autor}} - {{deck.Date}}</v-card-subtitle>
        <v-card-text>{{deck.Combo}}</v-card-text>
        <panelDeckCards :style="{'max-width':$vuetify.breakpoint.width +'px'}"
          :cards="deck.DeckListCards" 
          :size="$vuetify.breakpoint.width *50 /650">
        </panelDeckCards>
        <div class="flex-reverse">
          <v-btn class="m5px" @click="$emit('unselect')">
            Retour
          </v-btn>
        </div>
    </v-card>
</template>

<script>
import panelDeckCards from './panelDeckCards';

  export default {
    name: 'panel-deck',
    props: ['deck'],
    data: () => ({
        size: 150,
    }),
    components: {panelDeckCards},
    methods : {
      switchSize(value){
        this.size = value ? 50 : 150;
      }
    }
  }
</script>
