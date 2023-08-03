<template>
    <div v-if="selectMainCard">   
        <panel-deck-cards :cards="deck.DeckListCards"
                    @select="selectFav"
                    :size="100" >
        </panel-deck-cards> 
    </div>
    <div v-else-if="cube" style="position:relative">
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
                        :key="booster.Ref + 'Batch' + batchIndex" 
                        tooltip="text"
                        :cards="batch.Cards"  
                        :shadowArrayIds="deckCardsIds"
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
        <template v-if="deck">
            <div class="flex-wrap flex-center">
                <v-text-field class="m5px" label="Nom du deck" hide-details
                            v-model="deck.Title">
                </v-text-field>
                <v-text-field class="m5px" label="Auteur" hide-details
                            v-model="deck.Author">
                </v-text-field>
            </div>
            <div class="flex flex-responsive">
                <panel-deck-cards class="bg2 flex-grow" 
                    :cards="deck.DeckListCards"  
                    :keyid="'DeckCards'"
                    :size="100" 
                    :key="refreshCards"
                    @select="removeCardFromDeck"
                    @hover="showCard">
                </panel-deck-cards>   
                <div>
                    <card-image v-if="cardHover" 
                        class="p5px bg2" style="margin:0px !important"                     
                        :card="cardHover"
                        :badgeoff="true"
                        :showname="true"
                        :size="300">
                    </card-image>
                    <div v-else class="bg2" style="width:300px; height:437px">
                    </div>
                </div>
            </div>   
            <div class="flex flex-reverse">
                <v-btn class="m5px bg2 colorWhite" @click="saveDeck" :disabled="!isValidDeck()">
                    Sauvegarder
                </v-btn>
                <v-btn class="m5px bg2 colorWhite" @click="selectMainCard=true">
                    Sélectionner la carte principale
                </v-btn>
            </div>
        </template>    
    </div>
</template>

<script>
const seedrandom = require('seedrandom');
import { store } from '../data/store.js'
import ServiceDeck from '../services/serviceDeck';
import helperString from '../helpers/helperString';

import panelCards from './panelCards';
import textBorder from './textBorder';
import cardBooster from './cardBooster';
import cardImage from './cardImage';
import panelSpoiler from './panelSpoiler';
import panelDeckCards from './panelDeckCards';

  export default {
    name: 'panel-cube-config',
    props: ['seed', 'cube', 'boosters', 'deckobj'],
    components: {textBorder, cardBooster, panelCards, panelSpoiler, panelDeckCards, cardImage},
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
        deck: {},
        deckCardsIds: [],
        showOptions: false,
        refreshCards:0,
        cardHover: null,
        selectMainCard: false
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

        this.deck = this.deckobj ? this.showDeck(this.deckobj) : this.initDeck();
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
        getRandomItem(array, alreadyAddedIds, idProperty){
            let filteredArray = array.filter(x=> !alreadyAddedIds.includes(x[idProperty]));
            let result = filteredArray[this.getRandomInt(filteredArray.length)];
            if(!result){
                alert("Cette carte n'existe pas :" + result);
                return null;
            }
            alreadyAddedIds.push(result[idProperty]);
            return result;
        },
        addCardToDeck(card){
            let event = card.event;
            delete card.event;
            if(this.deck.DeckListCards.find(x=> x.Ids.includes(card.Id))){
                alert("Cette carte a déjà été ajoutée.");
                return;
            }

            let alreadyExistCard = this.deck.DeckListCards.find(x=> x.IdName === card.IdName);
            if(alreadyExistCard && alreadyExistCard.Quantity === "3"){
                alert("Cette carte existe déjà en trois exemplaire dans le deck.");
                return;
            }
            if(alreadyExistCard){
                alreadyExistCard.Quantity = alreadyExistCard.Quantity === "1" ? "2" : "3";
                alreadyExistCard.Ids.push(card.Id);
            }
            else
                this.deck.DeckListCards.push({Ids: [card.Id], IdName: card.IdName, Card:card, Quantity:"1"});

            this.deckCardsIds.push(card.Id);
            this.moveImage({Image:card.ImageMDM, Animation:'slideToDown'}, event);
            this.refreshCardsDeck();
        },
        removeCardFromDeck(card){
            let event = card.event;
            delete card.event;
            let cardObj = this.deck.DeckListCards.find(x=> x.Card.IdName === card.IdName);
            if(!cardObj)return;
            let lastId = cardObj.Ids[cardObj.Ids.length-1];

            if(cardObj.Quantity !== "1"){
                cardObj.Quantity = cardObj.Quantity === "3" ? "2" : "1";
                cardObj.Ids = cardObj.Ids.slice(0, parseInt(cardObj.Quantity));
            }
            else{
                this.deck.DeckListCards = this.deck.DeckListCards.filter(x=> x.Card.IdName !== card.IdName);
            }

            this.deckCardsIds = this.deckCardsIds.filter(x=> x!= lastId);
            this.moveImage({Image:card.ImageMDM, Animation:'slideToUp'}, event);
            this.refreshCardsDeck();
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
            let holoRareCards = secretRareCards.concat(ultraRareCards).concat(superRareCards);
            //let ultimateRareCards = cards.filter(x=> x.Rarity.split(',').includes('UL'));
            //let ghostRareCards = cards.filter(x=> x.Rarity.split(',').includes('GL'));

            for(let batchIndex=0; batchIndex< this.batchPerCube; batchIndex++){
                let batchCardIds = [];
                
                let batch = {Cards:[]};
                for(let i=0; i< this.commonCardPerBatch; i++) {
                    batch.Cards.push(this.getRandomItem(commonCards, batchCardIds, 'IdName'));
                }
                    
                for(let i=0; i< this.rareCardPerBatch; i++) 
                    batch.Cards.push(this.getRandomItem(rareCards, batchCardIds, 'IdName'));
                    
                for(let i=0; i< this.holoCardPerBatch; i++) {
                    let randomNumber = this.getRandomInt(100);
                    let arrayCards = randomNumber < this.probabilityScr ? secretRareCards
                        : randomNumber < this.probabilityUr ? ultraRareCards
                        : randomNumber < this.probabilitySr ? superRareCards
                        : commonCards;
                    if(arrayCards.length <1) 
                        arrayCards= holoRareCards;
                    batch.Cards.push(this.getRandomItem(arrayCards, batchCardIds, 'IdName'));
                }
                
                batch.Cards = batch.Cards.map((x,i)=> {
                    return {
                        ...x,
                        Id: 'B' + batchIndex.toString().padStart(2, "0")+ '_C' + i.toString().padStart(2, "0") + "_" + x.IdName
                    };
                });

                result.push(batch);
            }
            
            return result;
        },
        refreshCardsDeck(){
            this.deck.DeckListCards =  ServiceDeck.sort(this.deck.DeckListCards);
            this.refreshCards++;
        },
        showCard(card){
            this.cardHover = card;
        },
        selectFav(card){
            this.deck.MainCard = card.NameEn;
            this.selectMainCard = false;
        },
        isValidDeck(){
            return (this.deck.Title && this.deck.Title.length > 0)
                && (this.deck.Author && this.deck.Author.length > 0)
                && (this.deck.DeckListCards && this.deck.DeckListCards.length > 0)
                && (this.deck.MainCard && this.deck.MainCard.length > 0);
        },
        saveDeck(){
            this.$emit('saveDeck', this.deck);
        },       
        getCardIds(cardIdname, quantity){
            let cards = this.boosters.map(x=> x.Batchs)
                .reduce((pre,cur)=> pre && cur ? pre.concat(cur) : pre ? pre : cur)
                .map(x=> x.Cards)
                .reduce((pre,cur)=> pre && cur ? pre.concat(cur) : pre ? pre : cur)
                .filter(x=> x.IdName === cardIdname);

            return cards.slice(0, Math.min(cards.length, quantity)).map(x=> x.Id);
        } ,
        initDeck(){
            return {DeckListCards:[], MainCards: [], ThemesId: ['cube'], Rank: 5, Format:this.cube.Id, Seed:this.seed };
        },
        showDeck(deck){
            deck.DeckListCards = [];
            let deckList = deck.DeckList.split(',');
            for(let cardIndex =0 ; cardIndex< deckList.length; cardIndex++)
            {
                const cardNameEn = deckList[cardIndex];
                let quantity = helperString.includesX3(cardNameEn) ? '3' : helperString.includesX2(cardNameEn) ? '2' : '1';
                let cardIdName = helperString.removeX3(helperString.removeX2(helperString.cleanup(cardNameEn)));
                const card = store.cards.find(x=> x.IdName === cardIdName);
                if(card){
                    let ids= this.getCardIds(card.IdName, parseInt(quantity));
                    if(ids.length > 0){
                        if(ids.length < quantity)
                            quantity = ids.length;
                            
                        deck.DeckListCards.push({Ids: ids, Order:cardIndex, Quantity: quantity, Card: card});
                    }
                }
            }
            this.deckCardsIds = deck.DeckListCards.map(x=> x.Ids).reduce((pre,cur) => pre.concat(cur));
            return deck;
        },
    }
  }
</script>
