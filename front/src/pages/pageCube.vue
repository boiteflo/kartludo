<template>
    <div>
        <div v-if="loading">
            Chargement
        </div>
        <panel-cube-config v-else-if="cube" 
          :cube="cube"
          :boosters="boosters">
        </panel-cube-config>
        <div v-else>
            Création d'un cube
        </div>
    </div>
</template>


<script>
import { forkJoin } from 'rxjs';
import ServiceBack from '../services/serviceBack'

import { store } from '../data/store.js'
import panelCubeConfig from '../components/panelCubeConfig';

export default {
  name: 'pageDeck',
  components: {panelCubeConfig},
  data: () => ({
    store: store,
    loading:true,
    isNew: false,
    id: null,
    cube: null,
    boosters : null,
  }),
  mounted(){
    let uri = window.location.href;
    let i = uri.indexOf("id="); 
    this.isNew = i < 1;
    this.id = uri.substring(i+3);

    
    forkJoin([
        ServiceBack.get('cube', this.id),
        ServiceBack.getAll('booster'),
      ]).subscribe(results => {
        this.cube= results[0];
        this.boosters = results[1];
        this.loading=false;
      });   
  },
  methods: {
    openCube(){
        alert('Bientôt disponible');
    }
  }
};
</script>
