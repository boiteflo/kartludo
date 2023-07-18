<template>
    <div class="pageTop">
        <v-img :src="require('../assets/RulesTopOnly.jpg')" />
        <h1>BANLIST</h1>
        <h2><v-icon color="red">mdi-cancel</v-icon> CARTES INTERDITES</h2>
        <panel-cards :cards="filterLimit(store.cards,'0')" :badgeoff="false">
        </panel-cards>
      
        <h2><v-icon color="red">mdi-alert</v-icon> CARTES LIMITÉS</h2>
        <panel-cards :cards="filterLimit(store.cards,'1')" :badgeoff="false">
        </panel-cards>
      
        <h2><v-icon color="yellow">mdi-star</v-icon> CARTES JOKER</h2>
        <panel-cards :cards="filterLimit(store.cards,'K')" >
        </panel-cards>

        <v-card class="bg">
          <v-card-title>Remerciement</v-card-title>
          <v-card-text class="bg">Ce format a été inventé par Zouloux (07/2023). Le Site Web a été créé par FlorentOutan. (Contactez moi sur le discord). Avec la participation de Aelle et Lockai. Utilisation de la base de données : https://db.ygoprodeck.com.</v-card-text>
        </v-card>
          
    </div>
</template>


<script>
import { store } from '../data/store.js'
import panelCards from '../components/panelCards';

export default {
  name: 'pageDeck',
  components: {panelCards},
  data: () => ({
    store: store
  }),
  methods: {
    filterLimit(cards, key){
      return cards.filter(x=> x.Limit===key);
    }
  }
};
</script>
