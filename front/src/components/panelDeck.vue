<template>
    <v-card v-if="deck">
        <v-card-title>{{deck.Title}}</v-card-title>
        <v-card-subtitle>{{deck.Author}} - {{deck.Date}}</v-card-subtitle>
        <v-card-text>{{deck.Combo}}</v-card-text>
        <router-link :to="'/deck/id=' + deck.Id" >
          <v-btn target="_blank" text v-if="buttonpage" 
            class="bg" 
            style="position:absolute; right:5px; top:5px" >
            <v-icon>mdi-arrow-right-thin</v-icon>
            Ouvrir la page dédiée a ce deck
          </v-btn>
        </router-link>
        <div class="flex">
          <div style="flex-basis: 0; flex-grow:1; min-height:400px" class="m5px"> 
            <h3>Deck List</h3>           
            <v-textarea readonly variant="outlined" auto-grow
              :value="deck.DeckList.replaceAll(',','\n')">
            </v-textarea>
          </div>
          <div style="flex-basis: 0; flex-grow:5; min-height:400px" class="m5px">            
            <panelDeckCards :cards="deck.DeckListCards"
              :size="$vuetify.breakpoint.width *50 /600"
              tooltip="image">
            </panelDeckCards>
          </div>
        </div>
        <div class="flex">
        </div>
        <div class="flex-reverse">
          <v-btn v-if="buttonpage" class="m5px" @click="$emit('unselect')">
            Retour
          </v-btn>
          <router-link v-else to="/decks" >
            <v-btn target="_blank" text class="bg m5px" >
              <v-icon>mdi-arrow-right-thin</v-icon>
              Decks
            </v-btn>
          </router-link>
        </div>
    </v-card>
</template>

<script>
import panelDeckCards from './panelDeckCards';

  export default {
    name: 'panel-deck',
    props: ['deck', 'buttonpage'],
    components: {panelDeckCards},
    data: () => ({
        size: 150,
    }),
    methods : {
      switchSize(value){
        this.size = value ? 50 : 150;
      }
    }
  }
</script>
