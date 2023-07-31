<template>
    <div v-if="cube" style="position:relative">
        <h1>{{cube.Title}}</h1>
        <h2>Réglage des options</h2>
        <img :src="cube.Image" style="position:absolute; top:10px; right:10px; width:180px;" />
        <div class="p5px flex-wrap">
            <v-text-field class="m5px" 
                label="Nombre de Commune dans un lot" 
                v-model="commonCardPerBatch">
            </v-text-field>
            <v-text-field class="m5px" 
                label="Nombre de Rare dans un lot" 
                v-model="rareCardPerBatch">
            </v-text-field>
            <v-text-field class="m5px" 
                label="Nombre de Holo ou Commune dans un lot" 
                v-model="holoCardPerBatch">
            </v-text-field>
            <v-text-field class="m5px" 
                label="Nombre de lot dans un cube" 
                v-model="batchPerCube">
            </v-text-field>
        </div>
        <div class="p5px flex-wrap">
            <div class="flex">
                <v-switch v-model="NoDuplicate" label="Carte unique" class="m5px w250"></v-switch>
                <text-border text="Aucun doublon parmis toutes les cartes."></text-border>
            </div>
            <div class="flex">
                <v-switch v-model="NoDuplicateHolo" label="Holographique unique" class="m5px w250"></v-switch> 
                <text-border text="Aucun doublon parmis toutes les SR, UR et Scr."></text-border>
            </div>
        </div>
        <h2>Les Cubes à ouvrir</h2>
        <div class="flex flex-wrap bg2">
            <div v-for="(step,index) in cube.Steps.filter(x=> !cubesOpenedIds.includes(x.Booster))" v-bind:key="'Step' + index">
                <card-booster v-for="booster in getBooster(step)" 
                    v-bind:key="booster.Id" 
                    :booster="booster"
                    :title="booster.Title" 
                    :image="booster.Image"
                    @open="openCubeBooster">
                </card-booster>
            </div>
        </div>
        <h2>Les Cubes ouvert</h2>
        <div class="bg2" v-for="(cubeOpened,cubeOpenedIndex) in cubesOpened" v-bind:key="'cubeOpened' + cubeOpenedIndex">
        <h3 class="p5px colorWhite bg w100p">{{cubeOpened.cube}}</h3>
          <panel-cards class="bg2" 
            v-for="(batch,batchIndex) in cubeOpened.batchs" 
            v-bind:key="cubeOpenedIndex + 'Batch' + batchIndex" 
            :cards="batch.Cards"  
            tooltip="image">
          </panel-cards>
        </div>
    </div>
</template>

<script>
import { store } from '../data/store.js'
import helperString from '../helpers/helperString';

import panelCards from './panelCards';
import cardBooster from './cardBooster';
import textBorder from './textBorder';

  export default {
    name: 'panel-cube-config',
    props: ['cube', 'boosters'],
    components: {textBorder, cardBooster, panelCards},
    data: () => ({
        store : store,
        NoDuplicate: false,
        NoDuplicateHolo: false,
        commonCardPerBatch: 7,
        rareCardPerBatch: 1,
        holoCardPerBatch: 1,
        batchPerCube: 25,
        cubesOpened: [],
        cubesOpenedIds: [],
    }),
    methods: {
        getBooster(step){
            if(!step.Booster) return [];
            let booster = this.boosters.find(x=> x.Ref === step.Booster);
            if(!booster) return [];
            return [booster];
        },
        getRandomInt(max){
            return Math.floor(Math.random() * max);
        },
        getRandomItem(array){
            return array[this.getRandomInt(array.length)];
        },
        openCubeBooster(booster){
            let result = [];
            const holo = ['SR', 'UR', 'SCR'];
            let commonCards = booster.Cards.filter(x=> x.Rarity === 'C').map(x=> helperString.cleanup(x.NameEn));
            let rareCards = booster.Cards.filter(x=> x.Rarity === 'R').map(x=> helperString.cleanup(x.NameEn));
            let holoCards = booster.Cards.filter(x=> holo.includes(x.Rarity)).map(x=> helperString.cleanup(x.NameEn));

            for(let batchIndex=0; batchIndex< this.batchPerCube; batchIndex++){
                
                let batch = {CardList:[], Cards:[]};
                for(let i=0; i< this.commonCardPerBatch; i++) 
                    batch.CardList.push(this.getRandomItem(commonCards));
                    
                for(let i=0; i< this.rareCardPerBatch; i++) 
                    batch.CardList.push(this.getRandomItem(rareCards));
                    
                for(let i=0; i< this.holoCardPerBatch; i++) 
                    batch.CardList.push(this.getRandomInt(2) === 1 ? this.getRandomItem(holoCards) : this.getRandomItem(commonCards));

                batch.Cards = this.store.cards.filter(x=> batch.CardList.includes(x.IdName));
                result.push(batch);
            }

            this.cubesOpened.push({cube: `${booster.Ref}-${booster.Title}`, batchs:result});
            this.cubesOpenedIds.push(booster.Ref);
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        },
  }
  }
</script>
