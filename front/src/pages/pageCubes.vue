<template>
    <div>
        <h1>LES CUBES DE DRAFT</h1>
        <div class="bg p5px"> 
            Le format Draft consiste a ouvrir un booster, chosir une seule carte et passez le reste a ses voisins. Puis répéter l'opération jusqu'a ce que chacun puisse créer un deck et faire des duels.
            Un cube de Draft est un ensemble de carte utilisées pour jouer en Draft. Au lieu d'ouvrir des boosters scellés, vous draftez des "boosters" de cartes que vous avez créé à partir de votre cube.
            Ce format permet de reproduire l'engouement d'ouvrir un lot de carte aléatoire avec des bonnes et mauvaises surprises. De devoir trouver une synergie et d'affronter ces adversaires dans un cadre non META.
        </div>

        <div v-for="cube in cubes" v-bind:key="cube.Id" class="bg2">
            <div class="flex p5px">
                <div class="p5px" style="width:180px">
                    <v-img :src="cube.Image" />
                </div>
                <div class="flex-grow w100p" style="border-radius:20px">
                    <v-chip class="bg w100p text-center">{{cube.Title}}</v-chip>
                    <div class="flex bgWhite">
                        <div class="flex-grow m5px h100p">
                            <div class="flex" style="flex-direction:column">
                                <div class="flex-grow m5px">
                                    {{cube.Description}}
                                </div>
                                <div >
                                    <router-link :to="'/cube/id=' + cube.Id">
                                        <v-btn text class="bg m5px">
                                            <v-icon>mdi-cube</v-icon>
                                            <span class="mr-2">Ouvrir un cube</span>
                                        </v-btn>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <v-img style="width:250px" :src="cube.SubImage" />
                    </div>
                </div>
            </div>
        </div>

        <h1>LES BOOSTERS</h1>
        <div class="flex flex-wrap bg2">
            <div v-for="booster in boosters"
                v-bind:key="booster.Id"
                class="m5px cursorHand">
                <router-link :to="'/cube/id=' + booster.Ref">                        
                    <card-booster :booster="booster"
                        :title="booster.Title" 
                        :image="booster.Image">
                    </card-booster>
                </router-link>
            </div>
        </div>
    </div>
</template>


<script>
import { forkJoin } from 'rxjs';
import { store } from '../data/store.js'
import ServiceBack from '../services/serviceBack'

import cardBooster from '../components/cardBooster';

export default {
  name: 'pageDeck',
    components: {cardBooster},
  data: () => ({
    store: store,
    cubes:null,
    boosters: null
  }),
  mounted(){
    forkJoin([
        ServiceBack.getAll('cube'),
        ServiceBack.getAll('booster'),
      ]).subscribe(results => {
        this.cubes= results[0];
        this.boosters = results[1];
      });   
  },
  methods: {
    openCube(){
        alert('Bientôt disponible');
    }
  }
};
</script>
