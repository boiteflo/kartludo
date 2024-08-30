<template>
    <header-yugioh>
        <h1>Boosters</h1>
        <p>Page en cours de création</p>
        <div v-if="extensions" class="flex-wrap flex-center">
            <div v-for="extension in extensions" v-bind:key="extension.set_code" class="w100">
              <img  :src="extension.set_image" />
              <div class="w100" style="font-size:8px; text-align:center">{{extension.set_code}}-{{extension.set_name}}</div>
            </div>
        </div>
      </header-yugioh>
</template>


<script>

//import panelCards from '../components/panelCards';

//import helperArray from '../helpers/helperArray';
import ServiceBack from '../../services/serviceBack'
import headerYugioh from '../../components/headerYugioh';

export default {
  name: 'pageDeck',
  components: {headerYugioh},
  data: () => ({
    extensions: null
  }),
  async mounted(){
      ServiceBack.getAll('extension').then(result => {
        this.extensions = result; //helperArray.sort(, 'tcg_date');
      });
  },
  methods: {
  }
};
</script>
