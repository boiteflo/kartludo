<template>
    <div v-if="cube" style="position:relative">
        <h1>{{cube.Title}}</h1>
        <img :src="cube.Image" style="position:absolute; top:10px; right:10px; width:180px;" />
        <div v-if="showOptions">
            <h2>Réglage des options</h2>
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
        </div>
        <h2>Les Cubes</h2>
        <div class="bg2">
            <div v-for="booster in cubeBoosters" v-bind:key="'booster' + booster.Ref">
                <panel-spoiler class="p5px colorWhite" :title="booster.Title" icon="mdi-cards" :image="booster.Image" :imagewidth="30">
                    <panel-cards class="bg2" 
                        v-for="(batch,batchIndex) in booster.Batchs" 
                        v-bind:key="booster.Ref + 'Batch' + batchIndex" 
                        :cards="batch.Cards"  
                        :keyid="booster.Ref + 'Batch' + batchIndex + 'Cards'"
                        @select="addCardToDeck">
                    </panel-cards>
                </panel-spoiler>
            </div>
            <div v-for="(step,index) in cube.Steps.filter(x=> !cubesOpenedIds.includes(x.Booster))" v-bind:key="'Step' + index">
                <div v-for="booster in getBooster(step)" 
                    v-bind:key="booster.Id">
                <card-booster  v-if="false"
                    :booster="booster"
                    :title="booster.Title" 
                    :image="booster.Image"
                    :actions="[{Id:'open', Icon:'mdi-cube', Text:'Ouvrir le cube'}]"
                    @open="openCubeBooster">
                </card-booster>
                </div>
            </div>
        </div>
        <h2>Créer un Deck</h2>
        <panel-cards class="bg2" 
            :cards="deckCards"  
            :keyid="'DeckCards'"
            @select="removeCardFromDeck">
        </panel-cards>        
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
        cubeBoosters: null,
        deckCards: [],
        showOptions: false
    }),
    mounted(){
        this.generator = seedrandom(this.seed);

        let boosters = [];
        this.cube.Steps.forEach(step=> {
            let booster = this.boosters.find(x=> x.Ref === step.Booster);
            booster.Batchs = this.openCubeBooster(booster);
            boosters.push(booster)
        });
        this.cubeBoosters = boosters;
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
        addCardToDeck(card){
            let event = card.event;
            delete card.event;
            this.deckCards.push(card);
            this.moveImage({Image:card.ImageMDM, Animation:'slideToDown'}, event);
        },
        removeCardFromDeck(card){
            let event = card.event;
            delete card.event;
            this.deckCards = this.deckCards.filter(x=> x.IdName !== card.IdName);
            this.moveImage({Image:card.ImageMDM, Animation:'slideToUp'}, event);
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

            //this.cubesOpened.push({cube: `${booster.Ref}-${booster.Title}`, batchs:result});
            //this.cubesOpenedIds.push(booster.Ref);
            //window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
            return result;
        },
  }
  }
</script>
