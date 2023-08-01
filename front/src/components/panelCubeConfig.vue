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
            <v-text-field class="m5px" 
                label="Probabilité des Super Rare (%)" 
                v-model="probabilitySr">
            </v-text-field>
            <v-text-field class="m5px" 
                label="Probabilité des Ultra Rare (%)" 
                v-model="probabilityUr">
            </v-text-field>
            <v-text-field class="m5px" 
                label="Probabilité des Secret Rare (%)" 
                v-model="probabilityScr">
            </v-text-field>
        </div>
        <div class="p5px flex-wrap">
            <div class="flex">
                <v-switch disabled v-model="NoDuplicate" label="Carte unique" class="m5px w250"></v-switch>
                <text-border text="Aucun doublon parmis toutes les cartes."></text-border>
            </div>
            <div class="flex">
                <v-switch disabled v-model="NoDuplicateHolo" label="Holographique unique" class="m5px w250"></v-switch> 
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
        <h2>Les cartes obtenues</h2>
        <div class="bg2" v-for="(cubeOpened,cubeOpenedIndex) in cubesOpened" v-bind:key="'cubeOpened' + cubeOpenedIndex">
            <panel-spoiler class="p5px colorWhite" :title="cubeOpened.cube" :show="true">
            <panel-cards class="bg2" 
                v-for="(batch,batchIndex) in cubeOpened.batchs" 
                v-bind:key="cubeOpenedIndex + 'Batch' + batchIndex" 
                :cards="batch.Cards"  
                :keyid="cubeOpenedIndex + 'Batch' + batchIndex + 'Cards'"
                tooltip="image">
            </panel-cards>
            </panel-spoiler>
        <!--
        <h3 class="p5px colorWhite bg w100p">{{cubeOpened.cube}}</h3>
          <panel-cards class="bg2" 
            v-for="(batch,batchIndex) in cubeOpened.batchs" 
            v-bind:key="cubeOpenedIndex + 'Batch' + batchIndex" 
            :cards="batch.Cards"  
            tooltip="image">
          </panel-cards>
          -->
        </div>
        <div class="bg2 h50"></div>
    </div>
</template>

<script>
const seedrandom = require('seedrandom');
import { store } from '../data/store.js'
import helperString from '../helpers/helperString';

import panelCards from './panelCards';
import cardBooster from './cardBooster';
import textBorder from './textBorder';
import panelSpoiler from './panelSpoiler';

  export default {
    name: 'panel-cube-config',
    props: ['seed', 'cube', 'boosters'],
    components: {textBorder, cardBooster, panelCards, panelSpoiler},
    data: () => ({
        store : store,
        generator : null,
        NoDuplicate: false,
        NoDuplicateHolo: false,
        commonCardPerBatch: 7,
        rareCardPerBatch: 1,
        holoCardPerBatch: 1,
        batchPerCube: 25,
        probabilitySr:20,
        probabilityUr:8,
        probabilityScr:1,
        cubesOpened: [],
        cubesOpenedIds: [],
    }),
    mounted(){
        this.generator = seedrandom(this.seed);
    },
    methods: {
        getBooster(step){
            if(!step.Booster) return [];
            let booster = this.boosters.find(x=> x.Ref === step.Booster);
            if(!booster) return [];
            return [booster];
        },
        getRandomInt(max){
            return Math.floor(this.generator() * max);
        },
        getRandomItem(array){
            return array[this.getRandomInt(array.length)];
        },
        openCubeBooster(booster){
            let result = [];
            let cards = [];
            let errors = [];
            booster.Cards.forEach(boosterCard => {
                let card = this.store.cards.find(x=> x.IdName === helperString.cleanup(boosterCard.NameEn));
                if(!card) errors.push(`${boosterCard.Id}-${boosterCard.NameEn}`);
                else cards.push({...card, Rarity:boosterCard.Rarity});
            });
            if(errors.length > 0)
                alert("Ces cartes n'ont pas été trouvées : " + errors.join('\n'));
            let commonCards = cards.filter(x=> x.Rarity.split(',').includes('C'));
            let rareCards = cards.filter(x=> x.Rarity.split(',').includes('R'));
            let superRareCards = cards.filter(x=> x.Rarity.split(',').includes('SR'));
            let ultraRareCards = cards.filter(x=> x.Rarity.split(',').includes('UR'));
            let secretRareCards = cards.filter(x=> x.Rarity.split(',').includes('SCR'));
            //let ultimateRareCards = cards.filter(x=> x.Rarity.split(',').includes('UL'));
            //let ghostRareCards = cards.filter(x=> x.Rarity.split(',').includes('GL'));

            for(let batchIndex=0; batchIndex< this.batchPerCube; batchIndex++){
                
                let batch = {CardList:[], Cards:[]};
                for(let i=0; i< this.commonCardPerBatch; i++) 
                    batch.Cards.push(this.getRandomItem(commonCards));
                    
                for(let i=0; i< this.rareCardPerBatch; i++) 
                    batch.Cards.push(this.getRandomItem(rareCards));
                    
                for(let i=0; i< this.holoCardPerBatch; i++) {
                    let randomNumber = this.getRandomInt(100);
                    let arrayCards = randomNumber < this.probabilityScr ? secretRareCards
                        : randomNumber < this.probabilityUr ? ultraRareCards
                        : randomNumber < this.probabilitySr ? superRareCards
                        : commonCards;
                    batch.Cards.push(this.getRandomItem(arrayCards));
                }

                result.push(batch);
            }

            this.cubesOpened.push({cube: `${booster.Ref}-${booster.Title}`, batchs:result});
            this.cubesOpenedIds.push(booster.Ref);
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        },
  }
  }
</script>
