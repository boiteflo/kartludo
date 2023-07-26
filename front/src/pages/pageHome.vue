<template>
    <div class="pageTop">
        <v-img :src="require('../assets/RulesTopOnly.jpg')" />
        <h1>BANLIST</h1>
        <h2><v-icon color="red">mdi-cancel</v-icon> CARTES INTERDITES</h2>
        <panel-cards :cards="filterLimit(store.cards,'0')" :badgeoff="true" :center="true" tooltip="text">
        </panel-cards>
        <h2><v-icon color="red">mdi-alert</v-icon> CARTES LIMITÉS</h2>
        <h3 class="h3">A 1 EXEMPLAIRE STRICTE</h3>
        <panel-cards :cards="filterLimit(store.cards,'1')" :badgeoff="true" :center="true" tooltip="text">
        </panel-cards>
        <br>
        <div class="flex-wrap">
          <div v-for="group in getLimitFriendsGroups(store.cards)" v-bind:key="group.id" style="position:relative; border: 5px solid red; margin: 5px 5px 5px 20px">
            <div style="position:absolute; top:-15px; left:-15px;">
                <div class="s25" style="color:red; text-align:center; font-style:bold; border-radius:15px; background:black; outline: 5px solid red">
                    1
                </div>
            </div>
            <panel-cards :cards="group.cards" :badgeoff="true" :center="false" :noflex="true" tooltip="text">
            </panel-cards>
          </div>
        </div>
      
        <h2><v-icon color="yellow">mdi-star</v-icon> CARTES JOKER</h2>
        <h3 class="h3">UNIQUEMENT 3 DANS VOTRE DECK ET SEULEMENT EN X1</h3>
        <panel-cards :cards="filterLimit(store.cards,'K')" :badgeoff="true" :center="true" tooltip="text" >
        </panel-cards>
      
        <h2><v-icon color="yellow">mdi-gift</v-icon> CARTES AJOUTÉES DANS LE FORMAT</h2>
        <panel-cards :cards="store.cards.filter(x=> x.Bonus && x.Limit !== '0')" :badgeoff="false" :center="true" tooltip="text" >
        </panel-cards>

        <v-card class="bg">
          <v-card-title>Remerciement</v-card-title>
          <v-card-text class="bg">Ce format a été inventé par Zouloux (07/2023). Le Site Web a été créé par FlorentOutan. (Contactez moi sur discord). Avec la participation de Lockai, Aelle, Tenebros, Bludzee, Yan_Ue4. Utilisation de la base de données : https://db.ygoprodeck.com.</v-card-text>
        </v-card>
          
    </div>
</template>


<script>
import { store } from '../data/store.js'
import panelCards from '../components/panelCards';

import helperArray from '../helpers/helperArray';

export default {
  name: 'pageDeck',
  components: {panelCards},
  data: () => ({
    store: store,
  }),
  methods: {
    filterLimit(cards, key){
      let filteredData = cards.filter(x=> x.Limit===key && (!x.LimitFriends || x.LimitFriends.length < 1));
      return helperArray.sortInverse(filteredData, 'OrderIndex');
    },
    getLimitFriendsGroups(cards){
      let filteredCards = cards.filter(x=> x.LimitFriends && x.LimitFriends.length >= 1);
      let groups = [];
      for(let i =0; i < filteredCards.length; i++){
        let card = filteredCards[i];
        let group = groups.find(x=> x.id === card.LimitFriends);
        if(!group){
          let cardIdNames = card.LimitFriends.split(',');
          let fullCards = cards.filter(x=> cardIdNames.includes(x.IdName));
          groups.push({id: card.LimitFriends, cards: fullCards});
        }
      }
      return groups;
    }
  }
};
</script>
