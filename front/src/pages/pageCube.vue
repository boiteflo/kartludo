<template>
    <div>
        <div v-if="loading">
            Chargement
        </div>
        <panel-cube-config v-else-if="seed && cube" 
          :seed="seed"
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
    seed: null,
    cube: null,
    boosters : null,
  }),
  mounted(){    
    let uri = window.location.href;
    let indexSeed = uri.indexOf("&seed="); 
    if(indexSeed<1)
    {
      window.location.href = window.location.href +'&seed=' + ((new Date().getTime() * 10000) + 621355968000000000);
      return;
    }
    this.seed = uri.substring(indexSeed+6);

    let i = uri.indexOf("id="); 
    this.isNew = i < 1;
    this.id = uri.substring(i+3).substring(0, indexSeed - i - 3);
    
    forkJoin([
        ServiceBack.get('cube', this.id),
        ServiceBack.getAll('booster')
      ]).subscribe(results => {
        this.boosters = results[1];
        let boostersIds = this.id.split('+');
        let boostersFromIds = this.boosters.filter(x=> boostersIds.includes(x.Ref)); 
        if(boostersFromIds && boostersFromIds.length > 0)
          this.cube = this.generateBoosterCube(boostersFromIds);
        else
          this.cube= results[0];
        this.loading=false;
      });   
  },
  methods: {
    generateBoosterCube(boosters){
      let ids = boosters.map(x=> x.Ref).join(' + ');
      return {
        "Id":'Cube '+ids,
        "Title":'MultiCube ' + ids ,
        "Image":boosters[0].Image,
        "Steps": boosters.map(x=> {return { "Booster" : x.Ref, "Quantity":"25" }})
    }
    }
  }
};
</script>
