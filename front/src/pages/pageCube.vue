<template>
    <div>
        <h1>Les Cubes de Draft</h1>
        <p class="bg p5px"> 
            Le format Draft consiste a ouvrir un booster, chosir une seule carte et passez le reste a ses voisins. Puis répéter l'opération jusqu'a ce que chacun puisse créer un deck et faire des duels.
            Un cube de Draft est un ensemble de carte utilisées pour jouer en Draft. Au lieu d'ouvrir des boosters scellés, vous draftez des "boosters" de cartes que vous avez créé à partir de votre cube.
            Ce format permet de reproduire l'engouement d'ouvrir un lot de carte aléatoire avec ses bonnes et mauvaises surprises. De devoir trouver une synergie et d'affronter ces adversaires dans un cadre non META.
        </p>
        <div class="flex p5px">
            <div style="width:250px">
                <v-img  :src="require('../assets/25e.jpg')" />
            </div>
            <div class="flex-grow w100p bg2 m5px" style="border-radius:20px">
                <v-chip class="bg w100p text-center">Cube 25e Anniversaire</v-chip>
                <div class="flex">
                    <div class="flex-grow colorWhite m5px">
                        <div>
                            Ce cube regroupe les 6 boosters réeditées par Konami a l'occasion du 25eme anniversaire du jeu de cartes. C'est ce format qui a été utilisé pour la série 
                            <a style="width:200px" href="https://www.youtube.com/watch?v=NMd2Xcyq2AE">Duels Historiques</a> en Juin 2023 par Doc7 et Zouloux.
                        </div>
                        <v-btn text class="bg m5px" @click="openCube('cube25e')">
                            <v-icon>mdi-cube</v-icon>
                            <span class="mr-2">Ouvrir un cube</span>
                        </v-btn>
                    </div>
                    <a style="width:200px" href="https://www.youtube.com/watch?v=NMd2Xcyq2AE">                    
                        <v-img src="https://i.ytimg.com/vi/NMd2Xcyq2AE/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBUDMQPwqhyzFWTdFzP8wp0AT2FnQ" />
                    </a>
                </div>
            </div>
            
            
        </div>
    </div>
</template>


<script>
/*
import { store } from '../data/store.js'
import panelCards from '../components/panelCards';

import helperArray from '../helpers/helperArray';
*/
export default {
  name: 'pageDeck',
  //components: {panelCards},
  data: () => ({
    //store: store
  }),
  methods: {
    openCube(){
        alert('Bientôt disponible');
    }
  }
};
</script>
