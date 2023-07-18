<template>
    <div>
        <h1>Boosters</h1>
        <p>Page en cours de création</p>
        <div v-if="extensions" class="flex-wrap flex-center">
            <div v-for="extension in extensions" v-bind:key="extension.set_code" class="w100">
              <img  :src="extension.set_image" />
              <div class="w100" style="font-size:8px; text-align:center">{{extension.set_code}}-{{extension.set_name}}</div>
            </div>
        </div>
    </div>
</template>


<script>

//import panelCards from '../components/panelCards';

//import helperArray from '../helpers/helperArray';
import ServiceBack from '../services/serviceBack'

export default {
  name: 'pageDeck',
  //components: {panelCards},
  data: () => ({
    extensions: null
  }),
  async mounted(){
      ServiceBack.getAll('extensions').then(result => {
        this.extensions = result; //helperArray.sort(, 'tcg_date');
      });
  },
  methods: {
  }
};
</script>
