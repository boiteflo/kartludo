<template>
    <div style="position:relative">
        <h1>LES CUBES DE DRAFT</h1>
        <h2></h2>
        <div class="bg p5px"> 
            Le format Draft consiste a ouvrir un booster, chosir une seule carte et passez le reste a ses voisins. Puis répéter l'opération jusqu'a ce que chacun puisse créer un deck et faire des duels.
            Un cube de Draft est un ensemble de carte utilisées pour jouer en Draft. Au lieu d'ouvrir des boosters scellés, vous draftez des "boosters" de cartes que vous avez créé à partir de votre cube.
            Ce format permet de reproduire l'engouement d'ouvrir un lot de carte aléatoire avec des bonnes et mauvaises surprises. De devoir trouver une synergie et d'affronter ces adversaires dans un cadre non META.
        </div>

        <v-dialog v-model="dialogCards">   
            <v-btn class="w100p p5px" @click="dialogCards=false"><v-icon>mid-cancel</v-icon>Fermer</v-btn> 
            <panel-cards class="bg2" 
                :cards="boosterCards"  
                :keyid="'BoosterCards'"
                tooltip="image">
            </panel-cards>
            <v-btn class="w100p p5px" @click="dialogCards=false"><v-icon>mid-cancel</v-icon>Fermer</v-btn> 
        </v-dialog>

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
                        <img v-if="$vuetify.breakpoint.width >= 800" style="width:250px" :src="cube.SubImage" />
                    </div>
                </div>
            </div>
            <v-img v-if="$vuetify.breakpoint.width < 800" class="w100p" :src="cube.SubImage" />
        </div>

        <h1>LES BOOSTERS</h1>
        <h2></h2>
        <div class="flex flex-wrap bg2">
            <div v-for="booster in boosters"
                v-bind:key="booster.Id"
                class="m5px cursorHand">
                <router-link :to="'/cube/id=' + booster.Ref">    
                </router-link>                    
                <card-booster :booster="booster"
                    :title="booster.Title" 
                    :image="booster.Image"
                    :actions="[
                        {Id:'open', Icon:'mdi-cube', Text:'Ouvrir le cube'}, 
                        {Id:'add', Icon:'mdi-plus-box-multiple', Text:'Multi Cube'}, 
                        {Id:'cards', Icon:'mdi-cards', Text:'Voir les cartes'}]"
                    @open="openCube"
                    @add="addToMultiCube"
                    @cards="showCards">
                </card-booster>
            </div>
        </div>
        
        <h1>MULTI-CUBE</h1>
        <div class="bg colorWhite p5px">Lorsque vous sélectionnez des boosters avec le bouton "Multi Cube", les boosters s'ajoutent dans une liste ci-dessous permettant de créer un multi cube.</div>
        <h2></h2>
        <div class="bg2 p5px" v-if="multiCubeBoosters && multiCubeBoosters.length >0">
            <div class="flex flex-wrap">
                <card-booster v-for="booster in multiCubeBoosters"
                    :key="'MultiCube' + booster.Ref"
                    class="m5px"
                    :booster="booster"
                    :title="booster.Title" 
                    :image="booster.Image"
                    :actions="[{Id:'cancel', Icon:'mdi-cancel', Text:'Retirer'}]"
                    @cancel="removeToMultiCube">
                </card-booster>
            </div>
            <div class="flex flex-center">
                <v-btn class="m5px bg" @click="openMultiCube"><v-icon>mdi-cube</v-icon>Ouvrir le multi cube</v-btn>
            </div>
        </div>
    </div>
</template>


<script>
import { forkJoin } from 'rxjs';
import { store } from '../data/store.js'
import ServiceBack from '../services/serviceBack'
import helperString from '../helpers/helperString';

import cardBooster from '../components/cardBooster';
import panelCards from '../components/panelCards';

export default {
  name: 'pageDeck',
    components: {cardBooster, panelCards},
  data: () => ({
    store: store,
    cubes:null,
    boosters: null,
    boosterCards: null,
    dialogCards:false,
    multiCubeBoosters: []
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
    openCube(booster){
        window.location.href = "/cube/id=" + booster.Ref + '&seed=' + ((new Date().getTime() * 10000) + 621355968000000000);
    },
    addToMultiCube(booster){
        this.multiCubeBoosters.push(booster);
        this.moveImage({Image:booster.Image, Animation:'slideToDown'}, booster.event, 70);
    },
    removeToMultiCube(booster){
        this.multiCubeBoosters = this.multiCubeBoosters.filter(x=> x.Ref !== booster.Ref);
        this.moveImage({Image:booster.Image, Animation:'slideToUp'}, booster.event, -60);
    },
    openMultiCube(){
        window.location.href = "/cube/id=" + this.multiCubeBoosters.map(x=> x.Ref).join('+') + '&seed=' + ((new Date().getTime() * 10000) + 621355968000000000);
    },
    showCards(booster){
        let cards = [];
        let errors = [];

        booster.Cards.forEach(boosterCard => {
            let card = this.store.cards.find(x=> x.IdName === helperString.cleanup(boosterCard.NameEn));
            if(!card) errors.push(`${boosterCard.Id}-${boosterCard.NameEn}`);
            else cards.push({...card, Rarity:boosterCard.Rarity});
        });

        if(errors.length > 0)
            alert("Ces cartes n'ont pas été trouvées : " + errors.join('\n'));

        this.boosterCards = cards;
        this.dialogCards = true;
    }
  }
};
</script>
