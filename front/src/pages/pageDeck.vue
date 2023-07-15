<template>
    <div>
        <div>
            <h1 class="m5px">Voir les decks de la communauté</h1>
            <p class="flex-center"> Work In Progress</p>
        </div>
    </div>
</template>


<script>
//import ServiceBack from '../services/serviceBack'

//import cardFood from '@/components/cardFood.vue';
//const axios = require('axios');

export default {
  name: 'pageDeck',
  components: {
    //cardFood,
  },
  data: () => ({
  }),
  mounted() {
    //ServiceBack.getAll('cards').then(res => this.cards = res);
  },
  methods: {
    searchCard(){
        //this.searchResult = this.cards.filter(x=> x.NameEn.toLowerCase().includes(value.toLowerCase())).slice(0, 50);
    },
  }
};
</script>
