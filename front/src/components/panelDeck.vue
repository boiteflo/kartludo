<template>
    <v-card v-if="deck">
        <v-card-title>{{deck.Title}}</v-card-title>
        <v-card-subtitle>{{deck.Author}} - {{deck.Date}} - {{deck.Format}}</v-card-subtitle>
        <v-card-text>{{deck.Combo}}</v-card-text>
        
        <template v-if="!deck.Seed">
          <v-alert v-if="deck.Errors" type="error" class="m5px w100p">
              Ce deck ne respecte pas le format : {{deck.Format && deck.Format.length > 0 ? deck.Format : 'Test'}} pour les raisons suivantes : {{deck.Errors}}
          </v-alert>
          <v-alert v-else type="success" class="m5px w100p">
              Ce deck respecte bien le format : {{deck.Format && deck.Format.length > 0 ? deck.Format : 'Test'}}
          </v-alert>
        </template>

        <div v-if="buttonpage" class="flex" style="position:absolute; right:5px; top:5px">
          <v-btn class="m5px" @click="$emit('unselect')">
            Retour
          </v-btn>
          <template v-if="deck.Seed">
            <router-link :to="'/cube/id=' + deck.Cube + '&deck=' + deck.Id" >
              <v-btn target="_blank" text  class="bg m5px" >
                <v-icon>mdi-cube</v-icon>
                Ouvrir le cube pour modifier ce deck
              </v-btn>
            </router-link>
          </template>
          <template v-else>
            <router-link :to="'/deck/id=' + deck.Id" >
              <v-btn target="_blank" text  class="bg m5px" >
                <v-icon>mdi-arrow-right-thin</v-icon>
                Ouvrir la page dédiée a ce deck <span v-if="deck.IsDraft || (deck.Errors && deck.Errors.length > 0)"> pour le modifier</span>
              </v-btn>
            </router-link>
          </template>
        </div>
        <div v-if="$vuetify.breakpoint.width >= 930" class="flex" style="align-items:center">
          <div style="flex-basis: 0; min-height:400px; width:310px" class="m5px">  
            
            <v-alert type="info" class="m5px w100p" style="background: #212A3C !important">
              Deck: {{deck.DeckLength}}, Monstres: {{deck.MonsterLength}}, Magies: {{deck.SpellLength}}, Pièges: {{deck.TrapLength}}, Extra: {{deck.ExtraLength}}
            </v-alert>
            <v-btn target="_blank" text  class="bg m5px w100p" @click="saveDecklist" >
              <v-icon>mdi-download</v-icon>
              Télécharger la decklist
            </v-btn>  
            <v-btn target="_blank" text  class="bg m5px w100p" @click="$emit('duplicate', deck)" >
              <v-icon>mdi-content-duplicate</v-icon>
              Dupliquer ce deck
            </v-btn>  
            <div style="width:310px; height:5px;"></div>        
            <card-image v-if="cardHover" 
                :card="cardHover"
                :badgeoff="true"
                :size="300"
                :showname="true"
                style="position:sticky; top:20px;">
            </card-image>
            <div v-else class="bg2 w100p" style="height:500px">
            </div>
          </div>
          <div style="flex-basis: 0; flex-grow:5; min-height:400px" class="m5px">
            <panelDeckCards :cards="getCards(false)"
              :size="$vuetify.breakpoint.width *40 /600"
              keyid= "deckMain"
              @hover="showCard">
            </panelDeckCards>
            <panelDeckCards :cards="getCards(true)"
              :size="$vuetify.breakpoint.width *40 /600"
              keyid= "deckExtra"
              @hover="showCard">
            </panelDeckCards>
          </div>
        </div>
        
        <div v-else >
          <v-alert type="info" class="m5px w100p" style="background: #212A3C !important">
            Nombre de carte du deck : {{deck.DeckLength}}
          </v-alert>
          <v-btn target="_blank" text  class="bg m5px w100p" @click="saveDecklist" >
            <v-icon>mdi-download</v-icon>
            Télécharger la decklist
          </v-btn>  
          <v-btn target="_blank" text  class="bg m5px w100p" >
            <v-icon>mdi-content-duplicate</v-icon>
            Dupliquer ce deck
          </v-btn>
          <div class="flex" style="align-items:flex-start;">
            <div class="bg2" style="flex-basis: 0; flex-grow:1">
              <card-image v-if="cardHover" 
                  :card="cardHover"
                  :badgeoff="true"
                  :showname="true"
                  style="position:sticky; top:20px;">
              </card-image>
              <div v-else class="bg2" style="height:507px; width:100px">
              </div>
            </div>
            <div style="flex-basis: 0; flex-grow:2">
              <panelDeckCards :cards="getCards(false)"
                  :size="50"
                  keyid= "VdeckMain"
                  @hover="showCard">
              </panelDeckCards>
              <panelDeckCards :cards="getCards(true)"
                  :size="50"
                  keyid= "VdeckExtra"
                  @hover="showCard">
              </panelDeckCards>
            </div>
          </div>
        </div>


        <div class="flex-reverse">
          <template v-if="buttonpage">
            <template v-if="deck.Seed">
              <router-link :to="'/cube/id=' + deck.Cube + '&deck=' + deck.Id" >
                <v-btn target="_blank" text  class="bg m5px" >
                  <v-icon>mdi-cube</v-icon>
                  Ouvrir le cube pour modifier ce deck
                </v-btn>
              </router-link>
            </template>
            <template v-else>
              <router-link :to="'/deck/id=' + deck.Id" >
                <v-btn target="_blank" text  class="bg m5px" >
                  <v-icon>mdi-arrow-right-thin</v-icon>
                  Ouvrir la page dédiée a ce deck
                </v-btn>
              </router-link>
            </template>
            <v-btn v-if="buttonpage" class="m5px" @click="$emit('unselect')">
              Retour
            </v-btn>
          </template>
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
import helperJs from '../helpers/helperJs';
import serviceDeck from '../services/serviceDeck';

import panelDeckCards from './panelDeckCards';
import cardImage from './cardImage';

  export default {
    name: 'panel-deck',
    props: ['deck', 'buttonpage'],
    components: {panelDeckCards, cardImage},
    data: () => ({
        size: 150,
        cardHover: null
    }),
    methods : {
      switchSize(value){
        this.size = value ? 50 : 150;
      },
      showCard(card){
          this.cardHover = card;
      },
      getCards(extra){
        if(!this.deck || !this.deck.DeckListCards)
          return [];
        return serviceDeck.sort(this.deck.DeckListCards.filter(x=> x.Card.ToExtraDeck === extra));
      },
      saveDecklist(){
        helperJs.saveFile(this.deck.Title + '_decklist.txt', `${this.deck.Title} - ${ this.deck.Author} - ${ this.deck.Date}\n${this.deck.DeckList.replace(/,/g,'\n')}`);
      }
    }
  }
</script>
