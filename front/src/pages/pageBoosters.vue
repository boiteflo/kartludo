<template>
    <div>
        <h1>Boosters</h1>
        <p>Page en cours de création</p>
        <div v-if="store.extensions" class="flex-wrap flex-center">
            <div v-for="extension in store.extensions" v-bind:key="extension.set_code" class="w100">
              <img  :src="extension.set_image" />
              <div class="w100" style="font-size:8px; text-align:center">{{extension.set_code}}-{{extension.set_name}}</div>
            </div>
        </div>
    </div>
</template>


<script>

import { store } from '../data/store.js'
//import panelCards from '../components/panelCards';

//import helperArray from '../helpers/helperArray';
import ServiceBack from '../services/serviceBack'

export default {
  name: 'pageDeck',
  //components: {panelCards},
  data: () => ({
    store: store
  }),
  async mounted(){
    if(!store.extensions)
      ServiceBack.getAll('extensions').then(result => {
        store.extensions = result; //helperArray.sort(, 'tcg_date');
      });
  },
  methods: {
  }
};
</script>
