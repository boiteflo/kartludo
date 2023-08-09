<template>
    <div v-if="selectMainCard">   
        <panel-deck-cards :cards="deckObj.DeckListCards"
                    @select="selectFav"
                    :size="100" >
        </panel-deck-cards> 
    </div>
    <div v-else-if="selectThemes && deckObj" v-bind:key="refreshThemes">
        <h1>Thèmes sélectionnable</h1>
        <div class="flex-wrap bg2">
            <icon-theme-mini v-for="theme in themes.filter(x=> x && x.Id!=='tous' && !deckObj.ThemesId.includes(x.Id))" 
                v-bind:key="theme.Id" 
                v-on:select="selectTheme(theme)" 
                :text="theme.Title" 
                :image="theme.CardImage">
            </icon-theme-mini>
        </div>
        <h1>Thème(s) sélectionné(s) pour le deck</h1>
        <div class="flex-wrap bg2" >
            <icon-theme-mini v-for="theme in themes.filter(x=> x && deckObj.ThemesId.includes(x.Id))" 
                v-bind:key="theme.Id" 
                v-on:select="unselectTheme(theme)" 
                :text="theme.Title" 
                :image="theme.CardImage">
            </icon-theme-mini>
        </div>
        <v-btn class="m5px bg" style="width:100%; height:30px; position:static" @click="selectThemes=false">
            Valider
        </v-btn>
    </div>
    <div v-else class="bgWhite">
    
        <v-dialog v-model="showFilter">
            <panel-card-filter v-if="showFilter" :filter="filter" v-on:hide="showOrHideFilter" v-on:filter="defineFilter">
            </panel-card-filter>
        </v-dialog> 

        <template v-if="deckObj">
            <h2>Modifier un deck</h2>
            <div>
                <div class="flex-wrap flex-center">
                    <v-text-field class="m5px" label="Nom du deck" hide-details
                                v-model="deckObj.Title">
                    </v-text-field>
                    <v-text-field class="m5px" label="Auteur" hide-details
                                v-model="deckObj.Author">
                    </v-text-field>
                </div>
                
                <template v-if="deckObj">
                    <v-alert v-if="deckObj.Errors" type="error" class="m5px w100p">
                        Ce deck ne respecte pas le format : {{deckObj.Format && deckObj.Format.length > 0 ? deckObj.Format : 'Test'}} pour les raisons suivantes : {{deckObj.Errors}}
                    </v-alert>
                    <v-alert v-else type="success" class="m5px w100p">
                        Ce deck respecte bien le format : {{deckObj.Format && deckObj.Format.length > 0 ? deckObj.Format : 'Test'}}
                    </v-alert>
                </template>

                <div v-if="$vuetify.breakpoint.width >= 930" class="flex">
                    <div class="bg" style="flex-grow:2; flex-basis: 0" v-bind:key="refreshCards">
                        <panel-deck-cards :cards="getCards(false)"
                                    keyid= "deckMain"
                                    :size="75"
                                    @select="selectCardFromDeck"
                                    @hover="showCard">
                        </panel-deck-cards>
                        <panel-deck-cards :cards="getCards(true)"
                                    keyid= "deckExtra"
                                    :size="75"
                                    @select="selectCardFromDeck"
                                    @hover="showCard">
                        </panel-deck-cards>
                    </div>
                    <div v-if="deckObj" class="bg2" style="width:310px">                 
                        <v-alert type="info" class="m5px" style="background: #212A3C !important">
                            Deck: {{deckObj.DeckLength}}, Monstres: {{deckObj.MonsterLength}}, Magies: {{deckObj.SpellLength}}, Pièges: {{deckObj.TrapLength}}, Extra: {{deckObj.ExtraLength}}
                        </v-alert>
                        <h3 class="m5px" style="color:white">Ajouter des Staples</h3>
                        <div class="flex flex-space-around">
                            <v-btn class="" @click="showStaples('stapleMonster')">
                                Monstre
                            </v-btn>
                            <v-btn class="" @click="showStaples('stapleSpell')">
                                Magie
                            </v-btn>
                            <v-btn class="" @click="showStaples('stapleTrap')">
                                Piège
                            </v-btn>
                        </div>   
                        <card-image v-if="cardHover" 
                            :card="cardHover"
                            :badgeoff="true"
                            :showname="true"
                            :size="300"
                            style="position:sticky; top:20px;">
                        </card-image>
                        <div v-else class="bg2 w100p" style="height:437px">
                        </div>
                        <br>
                    </div>
                    <div style="flex-grow:1; max-width:357px;flex-basis: 0">
                        <div class="flex">
                            <v-btn class="w32 m5px" @click="showOrHideFilter()" style="min-width:32px; height:48px;">
                                <v-icon>mdi-filter</v-icon>
                            </v-btn>
                            <v-text-field
                                    solo class="m5px flex-grow"
                                    hide-details
                                    label="Chercher une carte (FR ou EN)"
                                    color="#212A3C"
                                    append-inner-icon="mdi-magnify"
                                    v-model="searchString"
                                    @input="search">
                            </v-text-field>
                        </div>
                        <panel-cards v-if="selectedCards && selectedCards.length > 0"
                                    keyid= "searchCards"
                                    :size="filter.imageWidth" 
                                    :cards="selectedCards.slice(0,filter.limit)"
                                    @select="selectCard"
                                    @hover="showCard">
                        </panel-cards>   
                        <v-chip class="bg w100p m5px">Cartes Affichées : {{Math.min(filter.limit,filter.length)}} / {{filter.length}}</v-chip>                 
                    </div>
                </div>
                <div v-else>
                    <div class="bg">
                        <h3 class="m5px" style="color:white">Ajouter des Staples</h3>
                        <div class="flex flex-space-around">
                            <v-btn class="" @click="showStaples('stapleMonster')">
                                Monstre
                            </v-btn>
                            <v-btn class="" @click="showStaples('stapleSpell')">
                                Magie
                            </v-btn>
                            <v-btn class="" @click="showStaples('stapleTrap')">
                                Piège
                            </v-btn>
                        </div>
                        <div class="flex">                            
                            <v-btn class="w32 m5px" @click="showOrHideFilter()" style="min-width:32px; height:48px;">
                                <v-icon>mdi-filter</v-icon>
                            </v-btn>
                            <v-text-field
                                    solo class="m5px flex-grow"
                                    hide-details
                                    label="Chercher une carte (FR ou EN)"
                                    color="#212A3C"
                                    append-inner-icon="mdi-magnify"
                                    v-model="searchString"
                                    @input="search">
                            </v-text-field>
                        </div>
                        <panel-cards v-if="selectedCards && selectedCards.length > 0" 
                                    :size="filter.imageWidth" 
                                    :cards="selectedCards.slice(0,filter.limit)"
                                    @select="selectCard"
                                    @hover="showCard">
                        </panel-cards>
                        <v-chip class="bg w100p m5px">Cartes Affichées : {{Math.min(filter.limit,filter.length)}} / {{filter.length}}</v-chip>        
                        <v-alert type="info" class="m5px" style="background: #212A3C !important">
                            Deck: {{deckObj.DeckLength}}, Monstres: {{deckObj.MonsterLength}}, Magies: {{deckObj.SpellLength}}, Pièges: {{deckObj.TrapLength}}, Extra: {{deckObj.ExtraLength}}
                        </v-alert>
                    </div>
                    <panel-deck-cards :cards="getCards(false)"
                                @select="selectCardFromDeck"
                                @hover="showCard"
                                keyid= "vdeckMain"
                                :size="50" 
                                v-bind:key="refreshCards">
                    </panel-deck-cards>
                    <panel-deck-cards :cards="getCards(true)"
                                @select="selectCardFromDeck"
                                @hover="showCard"
                                keyid= "vdeckExtra"
                                :size="50" 
                                v-bind:key="refreshCards">
                    </panel-deck-cards>
                    <card-image v-if="cardHover" 
                        :card="cardHover"
                        :badgeoff="true"
                        :showname="true"
                        :size="$vuetify.breakpoint.width-20">
                    </card-image>
                </div>
                <h1>Tournoi</h1> 
                <v-combobox class="m5px w100p" 
                    v-model="deckObj.Tournament" 
                    label="Tournoi" 
                    :items="tournaments.filter(x=>x.Actif)" 
                    item-text="Title"
                    hide-details>
                </v-combobox>
                <v-alert type="info">Si vous sélectionnez un tournoi dans la liste déroulante ci-dessus, votre deck ne sera pas visible par la communauté. A l'exception des organisateurs de tournoi, vous serez le seul a pouvoir le consulter si vous prenez soin de noter l'url du deck une fois l'enregistrement terminé.</v-alert>
                
                <v-alert type="warning" v-if="!isValidForSave()">
                    Pour sauvegarder un deck, il faut qu'il y ait au moins 1 carte dans le deck, une carte principale définie, un thème minimum, un titre et un auteur.
                </v-alert>
                <v-alert type="warning" v-if="isValidForSave() && (deckObj.Errors && deckObj.Errors.length >0)">
                    Pour valider un deck, il faut que le format sélectionné soit respecté.
                </v-alert>
                <div class="flex-wrap flex-reverse">
                    <v-btn class="m5px bg" :disabled="!isValidForSave() || (deckObj.Errors && deckObj.Errors.length >0)" @click="validate">
                        Valider (ne sera plus modifiable)
                    </v-btn>
                    <v-btn class="m5px bg2 colorWhite" :disabled="!isValidForSave()" @click="save">
                        Sauvegarder
                    </v-btn>
                    <v-btn class="m5px bg2 colorWhite" @click="selectMainCard=true">
                        Sélectionner la carte principale
                    </v-btn>
                    <v-btn class="m5px bg2 colorWhite" @click="selectThemes=true">
                        Sélectionner les thèmes
                    </v-btn>                    
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { watch } from 'vue'
import { store } from '../data/store.js'
import ServiceMain from '../services/serviceMain'
import ServiceDeck from '../services/serviceDeck'
import helperString from '../helpers/helperString'

import cardImage from './cardImage.vue'
import panelCards from './panelCards.vue'
import iconThemeMini from '../components/iconThemeMini';
import panelDeckCards from './panelDeckCards.vue'
import panelCardFilter from './panelCardFilter.vue'
let md5 = require('md5');

  export default {
    name: 'panel-create-deck',
    props: ['deck', 'themes', 'staples', 'tournaments'],
    components: {
        cardImage, panelCards, panelDeckCards, iconThemeMini, panelCardFilter
    },
    data: () => ({
        store: store,
        deckObj: null,
        searchString: '',
        selectedCards: [],
        refreshCards:0,
        refreshThemes: 0,
        selectMainCard: false,
        selectThemes: false,
        cardHover:null,
        showFilter:false,
        filter: null,
        filterInit: {
            search: '',
            type : null,
            subType : null,
            attribute: null,
            race : null,
            levelmax: 12,
            levelmin: 1,
            searchEffect: null,
            limit: 50,
            length:0,
            imageWidth: 60,
            sort:'<Type,<MonTyp,>Level,<IdName',
            showAll : false,
            isActive:false
        }
    }),
    mounted(){
        this.filter = {...this.filterInit};
        this.deckObj = this.deck ?? {DeckListCards:[], MainCards: [], Themes: [], ThemesId: [], Rank: '3', Format: store.formatSelected.Title};
        this.deckObj.ThemesId= this.deckObj.Themes && this.deckObj.Themes.length > 0 
            ? this.themes.filter(x=> x && this.deckObj.Themes.split(',').includes(x.Id)).map(x=> x.Id)
            : [];
        this.deckObj.Tournament= this.deckObj.IdTournament && this.deckObj.IdTournament.length > 0 
            ? this.tournaments.find(x=> x && x.Id === this.deckObj.IdTournament)?.Id
            : '';            
        this.deckObj.Errors = ServiceDeck.getErrors(this.deckObj, this.deckObj.DeckListCards, store.formats, store.formatSelected.Id);
        watch(store, () => { 
            this.refreshCardsDeck();
        })
    },
    methods: {
        refreshCardsDeck(){
            this.deckObj.DeckListCards =  ServiceDeck.sort(this.deckObj.DeckListCards);
            this.deckObj.Errors = ServiceDeck.getErrors(this.deckObj, this.deckObj.DeckListCards, store.formats, store.formatSelected.Id);
            this.refreshCards++;
        },
        getCards(extra){
            if(!this.deckObj || !this.deckObj.DeckListCards)
                return [];
            return this.deckObj.DeckListCards.filter(x=> x.Card.ToExtraDeck === extra);
        },
        refreshSearch(){
            this.selectedCards = ServiceMain.filterCard(store.cards, store.formatSelected, this.filter);
        },
        search(value){
            this.filter.search = value;
            this.refreshSearch();
        },
        resetFilter(){
            this.filter = {...this.filterInit}
            this.refreshSearch();
        },
        showOrHideFilter(){
            this.showFilter=!this.showFilter;
        },
        defineFilter(filter){
            this.filter = {...filter, search: this.filter.search};
            this.showFilter=false;
            this.refreshSearch();
        },
        selectCard(card){
            let event = card.event;
            delete card.event;
            let alreadyExist = this.deckObj.DeckListCards.find(x=> x.Card.IdName == card.IdName);

            if(alreadyExist) alreadyExist.Quantity = "2";
            else this.deckObj.DeckListCards.push({Id: card.IdName, Card:card});
            
            this.refreshCardsDeck();
            let animation = this.isMobileScreen() ? 'slideToDown' : 'slideToRight';
            this.moveImage({Image:card.ImageMDM, Animation:animation}, event);
        },
        selectCardFromDeck(card){
            let event = card.event;
            delete card.event;
            let cardObject = this.deckObj.DeckListCards.find(x=> x.Card.IdName === card.IdName);
            if(!cardObject)
                return;

            if(cardObject.Quantity === "2")
            {
                cardObject.Quantity = null;
                this.refreshCardsDeck();
                this.moveImage({Image:card.ImageMDM, Animation:'slideToUp'}, event);
                return;
            }

            this.deckObj.DeckListCards = this.deckObj.DeckListCards.filter(x=> x.Card.IdName !== cardObject.Card.IdName);
            this.refreshCardsDeck();
            let animation = this.isMobileScreen() ? 'slideToUp' : 'slideToLeft';
            this.moveImage({Image:card.ImageMDM, Animation:animation}, event);
        },
        selectFav(card){
            this.deckObj.MainCard = card.NameEn;
            this.selectMainCard = false;
        },
        cryptPassword(){
            this.deckObj.Password = md5(this.deckObj.PasswordApparent);
        },
        selectTheme(theme){
            let alreadyExist = this.deckObj.ThemesId.find(x=> x === theme.id);
            if(!alreadyExist){                
                this.deckObj.ThemesId.push(theme.Id);
                this.refreshThemes++;
            }
        },
        unselectTheme(theme){
            this.deckObj.ThemesId = this.deckObj.ThemesId.filter(x=> x !== theme.Id);
            this.refreshThemes++;
        },
        showCard(card){
            this.cardHover = card;
        },
        showStaples(key)
        {
            let stapleIdNames = this.staples[key].Value.split(",").map(x=> helperString.cleanup(x));
            this.searchString = this.staples[key].Title;
            this.selectedCards = store.cards
                .filter(x=> stapleIdNames.includes(x.IdName))
                .slice(0, 50);
        },
        save(){
            this.deckObj.IdTournament = this.deckObj.Tournament ? this.deckObj.Tournament.Id : '';
            this.deckObj.Themes= this.deckObj.ThemesId? this.deckObj.ThemesId.join(', ') : '';
            delete this.deckObj.Tournament;
            this.$emit('save', this.deckObj);
        },
        validate(){
            this.deckObj.IsDraft=false;
            this.save();
        },
        isValidForSave(){
            return (this.deckObj.Title && this.deckObj.Title.length > 0)
                && (this.deckObj.Author && this.deckObj.Author.length > 0)
                && (this.deckObj.DeckListCards && this.deckObj.DeckListCards.length > 0)
                && (this.deckObj.MainCard && this.deckObj.MainCard.length > 0)
                && (this.deckObj.ThemesId && this.deckObj.ThemesId.length > 0);
        }
    }
  }
</script>
