<template>
    <div>
        <div v-if="loading">
          Chargement
        </div>
        <div v-else>
          <div>
              <v-dialog v-model="showDeck">
                <panel-deck :deck="deckSelected"
                  v-on:unselect="unselect">
                </panel-deck>
              </v-dialog>
              <div v-if="decksObject">
                <h1>Les Decks </h1>
                <h2><v-icon color="white">mdi-check-decagram</v-icon>Validé par les modérateurs du Discord </h2>
                <div class="flex-wrap flex-center">
                    <iconDeck v-for="deck in decksObject.Decks" :deck="deck" v-bind:key="deck.Id" v-on:selected="selectDeck(deck)">
                    </iconDeck>
                </div>
                
                <h1>Les Decks de la communauté</h1>
                <h2><v-icon color="white">mdi-alert</v-icon>La validation reste a faire </h2>
                <div class="flex-wrap flex-center">
                    <iconDeck v-for="deck in decksObject.DecksCommunity" :deck="deck" v-bind:key="deck.Id" v-on:selected="selectDeck(deck)">
                    </iconDeck>
                </div>
              </div>
              <div class="flex-center">
                <router-link to="/deck">
                  <v-btn class="bg m5px"
                    target="_blank"
                    text
                  >
                    <v-icon>mdi-plus</v-icon>
                    <span class="mr-2">Ajouter un deck</span>
                  </v-btn>
                </router-link>
              </div>
              
              <div class="flex-wrap flex-space-around">
                <icon-theme v-on:select="showTheme" text="Fusions" image="https://images.ygoprodeck.com/images/cards/98502113.jpg"></icon-theme>
                <icon-theme text="Rituels" image="https://images.ygoprodeck.com/images/cards/5405694.jpg"></icon-theme>
                <icon-theme text="Dragons" image="https://images.ygoprodeck.com/images/cards/89631139.jpg"></icon-theme>
                <icon-theme text="Démons" image="https://images.ygoprodeck.com/images/cards/53982768.jpg"></icon-theme>
                <icon-theme text="Magiciens" image="https://images.ygoprodeck.com/images/cards/38033121.jpg"></icon-theme>
                <icon-theme text="Autres" image="https://images.ygoprodeck.com/images/cards/31122090.jpg"></icon-theme>
                <icon-theme text="Vent" image="https://images.ygoprodeck.com/images/cards/91932350.jpg"></icon-theme>
                <icon-theme text="Feu" image="https://images.ygoprodeck.com/images/cards/45231177.jpg"></icon-theme>
                <icon-theme text="Eau" image="https://images.ygoprodeck.com/images/cards/19801646.jpg"></icon-theme>
                <icon-theme text="Terre" image="https://images.ygoprodeck.com/images/cards/40659562.jpg"></icon-theme>
                <icon-theme text="Ténèbres" image="https://images.ygoprodeck.com/images/cards/49881766.jpg"></icon-theme>
                <icon-theme text="Lumière" image="https://images.ygoprodeck.com/images/cards/95956346.jpg"></icon-theme>
                <icon-theme text="Theme" image="https://images.ygoprodeck.com/images/cards/33244944.jpg"></icon-theme>
                <icon-theme text="Meta" image="https://images.ygoprodeck.com/images/cards/82301904.jpg"></icon-theme>
              </div>
          </div>
        </div>
    </div>
</template>


<script>
import ServiceBack from '../services/serviceBack'

import iconTheme from '../components/iconTheme';
import iconDeck from '../components/iconDeck';
import panelDeck from '../components/panelDeck';

export default {
  name: 'pageDecks',
  components: {iconDeck, panelDeck, iconTheme},
  data: () => ({
    loading:false,
    decksObject: null,
    deckSelected: null,
    showDeck: false
  }),
  mounted(){
    ServiceBack.getAll('decks').then(res => {
      this.decksObject = res;
    });   
  },
  methods: {
    selectDeck(deck){
      this.deckSelected=deck;
      this.showDeck = true;
    },
    unselect(){
      this.deckSelected=null;
      this.showDeck = false;
    },
    saveDeck(deck){
      this.loading=true;
      ServiceBack.insert('decks', deck).then(res=> {
        if(res.status === 201)
          ServiceBack.getAll('refresh').then(()=> window.location.reload());
        else
        {
          this.loading = false;
          alert('Une erreur est survenue. Veuillez contacter FlorentOutan sur le discord.')
        }
      });
    },
    showTheme(){
      alert('WIP');
    }
  }
};
</script>
