<template>
    <div class="relative w100p mask bg2" style="height: 100dvh" :key="refreshG">
        <span v-if="game">
            <!-- Drag and drop field-->
            <div class="absolute bg" :style="getFieldStyleObj(game.grid.halfPlayer2)"></div>
            <div class="absolute bg" :style="getFieldStyleObj(game.grid.centerZoneP2)"></div>
            <div class="absolute bg2" :style="getFieldStyleObj(game.grid.halfPlayer1)"></div>
            <div class="absolute diagonal-split" :style="getFieldStyleObj(game.grid.resources)">
            </div>
            <div class="absolute text-center textVerticalCenter fontSize075em"
                :style="{ ...getFieldStyleObj(game.grid.resources), transform: 'rotate(-45deg)' }">
                Resources
            </div>
            <banana-bars :p1yellow="game.player1.resourcesAvailable - game.player1.resourcesEx"
                :p1blue="game.player1.resourcesEx" :p1max="game.player1.resourcesMax"
                :p2yellow="game.player2.resourcesAvailable - game.player2.resourcesEx"
                :p2blue="game.player2.resourcesEx" :p2max="game.player2.resourcesMax" :max="game.resourcesMax"
                :style="getFieldStyleObj(game.grid.resources)" :width="game.grid.resources.width">
            </banana-bars>

            <!-- Player 1 -->
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player1Deck)" text="Deck"
                :length="game.player1.deck.length" :icon="game.player1.deckIcon"
                @click="showLocationCards('deck', true)">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player1Trash)" text="Trash"
                :length="game.player1.trash.length" :icon="game.player1.trashIcon"
                @click="showLocationCards('trash', true)">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player1Base)" text="Base"
                :icon="game.player1.baseIcon">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player1Shield)" text="Shield"
                :length="game.player1.shield.length" :icon="game.player1.shieldIcon"
                @click="showLocationCards('shield', true)">
            </deck-icon>
            <div v-if="game" class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.player1Hand)">
            </div>
            <div v-if="game" class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.player1Field)">
            </div>

            <!-- Player 2-->
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player2Deck)" text="Deck"
                :length="game.player2.deck.length" :icon="game.player2.deckIcon"
                @click="showLocationCards('deck', false)">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player2Trash)" text="Trash"
                :length="game.player2.trash.length" :icon="game.player2.trashIcon"
                @click="showLocationCards('trash', false)">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player2Base)" text="Base"
                :icon="game.player2.baseIcon">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player2Shield)" text="Shield"
                :length="game.player2.shield.length" :icon="game.player2.shieldIcon"
                @click="showLocationCards('shield', false)">
            </deck-icon>
            <div class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.player2Hand)">
            </div>
            <div class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.player2Field)">
            </div>

            <!-- Highlight and TextZone-->
            <div class="absolute vertical-scroll" v-html="game.logs" :style="getFieldStyleObj(game.grid.logZone)">
            </div>
            <div class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.textZone)">
            </div>
            <div class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.highlightCardCenter)">
            </div>
            <div class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.highlightCardLeft)">
            </div>
            <div class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.highlightCardRight)">
            </div>

            <!-- Buttons -->
            <div class="absolute bgYellow circle10px fontSize075em" :style="getFieldStyleObj(game.grid.buttonEffect)">
                <v-btn target="_blank"
                    :class="{ bg: true, shine: !freeze && game.player1.hasEffects, w100p: true, h100p: true }"
                    @click="useEffect" style="min-width:0px;">
                    <span>Use<br>Effect</span>
                </v-btn>
            </div>
            <div class="absolute bgYellow circle10px fontSize075em" :style="getFieldStyleObj(game.grid.buttonEndTurn)">
                <v-btn target="_blank" :class="{ bg: true, shine: !freeze, w100p: true, h100p: true }"
                    style="min-width:0px;" @click="nextTurn">
                    <span v-if="game.grid.buttonEndTurn.width > 50">End<br>Turn</span><span v-else>End</span>
                </v-btn>
            </div>
            <div class="absolute fontSize075em" :style="getFieldStyleObj(game.grid.buttonLogs)">
                <v-btn target="_blank" :class="{ bg2: true, w100p: true, h100p: true }" @click="nextTurn"
                    style="min-width:0px;">
                    Logs
                </v-btn>
            </div>
        </span>

        <!-- cards -->
        <div v-for="card in cards" :key="'B' + card.index">
            <gameCard :id="'C' + card.index" :card="card" folder="Gundam/cards/" :shine="card.selectable && !freeze"
                :hidestat="card.hidestat" @click="showCard(card)">
            </gameCard>
        </div>

        <drag-drop-arrow id="0" :sources="sources" @drop="dropPoint" @click="clickDrop" :targets="targets"
            :freeze="freeze || game?.popup">
        </drag-drop-arrow>

        <!-- Popup -->
        <div v-if="game && game.popup" class="absolute w100p h100p m5px"
            style="top:0px; display: flex; overflow: hidden; flex-direction: column; z-index: 80;">
            <div class="flex-grow" style="min-height: 10%;"> </div>
            <div class="w100p">
                <div class="flex flex-wrap w100p" style="justify-content:center">
                    <v-btn class="m10px" style="background-color: #FFFF00F0;" @click="showOrHidePopup(false)">
                        <span v-if="popupShow">Hide Popup</span><span v-else>Show Popup</span>
                    </v-btn>
                    <div v-for="(choice, index) in game?.popup.choices" :key="'Choice' + index">
                        <v-btn v-if="choice.text" class="m10px" @click="selectChoice(choice)">
                            {{ choice.text }}
                        </v-btn>
                    </div>
                </div>
            </div>
            <div v-if="popupShow" style="background-color: #FFFF00F0; width:100%; overflow-y: auto;">
                <h3 class="text-center colorBlack textVerticalCenter w100p mp5px" v-html="game?.popup.text"></h3>
                <div class="flex-wrap w100p horizontal-scroll" v-if="game?.popup.cards && game?.popup.cards.length > 0">
                    <div v-for="(card, index) in game?.popup.cards" :key="'PopUpCard' + index" class="mp5px cursorHand"
                        :style="{ width: game?.grid.card100.height + 'px' }">
                        <div class="text-center colorBlack">{{ card.location }} P{{ card.isPlayer1 ? '1' : '2' }}
                        </div>
                        <img :style="{ width: game?.grid.card100.width + 'px', 'aspect-ratio': '107/150', transform: 'rotate(' + card.position?.rotation ?? 0 + 'deg)' }"
                            @click="selectChoiceCard(card)"
                            :src="require('@/assets/Gundam/cards/' + card.id + '.webp')" />
                    </div>
                </div>
            </div>
        </div>

        <!-- textEffect -->
        <div v-if="game" id="divTextEffect" class="bgWhite absolute mask text-center textVerticalCenter fontSize150em"
            :style="{
                ...getFieldStyleObj(game.grid.textZone), 'z-index': 11, height: 0
            }">
            <div v-html="text"></div>
        </div>

        <!-- Title -->
        <div id="divTitleParent" class="absolute bgWhite mask"
            :style="{ top: '80px', width: '100%', height: '0px', 'z-index': 13 }">
            <div class="relative">
                <div class="text-center absolute w100p title" style="top:30px;">{{ title }}
                </div>
            </div>
        </div>

        <!-- Card center -->
        <gameCard id="cardCenter" :card="cardCenter" folder="Gundam/cards/" @click="showCard(null)"
            style="z-index: 70;">
        </gameCard>

        <div class="absolute" style="top:0px; left:0px;">
            <!-- Debug -->
        </div>
    </div>

</template>

<style>
html {
    overflow: hidden;
    overscroll-behavior: none;
}

body {
    position: relative;
}
</style>

<script>
import helperAnimation from '../helpers/helperAnimation';
import cards from '../data/gundamCards.json';
import gameGundam from './gundam/game';
import gameCard from './card';
import bananaBars from './bananaBars.vue';
import deckIcon from './deckIcon.vue';
import dragDropArrow from './dragDropArrow.vue';

export default {
    name: 'game-vue',
    props: ['deck1', 'deck2', 'quickstart'],
    components: { gameCard, bananaBars, deckIcon, dragDropArrow },
    data: () => ({
        refreshG: 0,
        freeze: true,
        cards: [],
        cardCenter: { id: 'GD01-028', position: { width: 0 } },
        game: null,
        title: null,
        text: null,
        popupShow: true,
        ignoreEvent: [],
        cardList: null,
        decklistPlayer1: null,
        decklistPlayer2: null,
        sources: [],
        targets: []
    }),/*
    watch: {
        deck1() { this.setDecks();},
        deck2() { this.setDecks();}
    },*/
    mounted() {
        document.body.style.overflow = "hidden";
        window.addEventListener("resize", () => {
            this.refreshG++;
        });

        this.cardList = cards.cards;
        this.setDecks();
    },
    methods: {
        setDecks() {
            this.decklistPlayer1 = this.deck1;
            this.decklistPlayer2 = this.deck2;
            if (this.decklistPlayer1 && this.decklistPlayer2)
                this.start();
        },
        start() {
            this.game = gameGundam.setup(this.$vuetify.breakpoint.width, this.$vuetify.breakpoint.height, cards, this.decklistPlayer1, this.decklistPlayer2, this.quickstart);
            this.refreshGame();
        },
        nextTurn() {
            if (this.freeze)
                return;
            this.game = gameGundam.endTurn(this.game);
            this.refreshGame();
        },
        continue() {
            this.freeze = false;
            this.game = gameGundam.continue(this.game);
            if (this.game.end) {
                this.$emit('end', this.game.isVictory);
                return;
            }
            if (this.game.popup) {
                this.freeze = true;
                return;
            }
            if (this.game.refreshOnlyTextEffect)
                this.animTextEffect();

            if (this.game.refresh)
                this.refreshGame();
        },
        useEffect() {
            if (this.freeze)
                return;
            this.game = gameGundam.useEffect(this.game);
            this.continue();
        },
        dropPoint(event) {
            if (!event || !event.target || !event.target.text)
                return;

            if (event.target.text === 'Play')
                this.playCard(event.source.card, null, this.game.grid.player1Field);
            if (event.target.text === 'Pair')
                this.playCard(event.source.card, event.target.card, this.game.grid.player1Field);
            if (event.target.text === 'Attack')
                this.playCard(event.source.card, event.target.card, this.game.grid.player2Field);
        },
        playCard(card1, card2, drop) {
            if (this.freeze)
                return;
            this.freeze = true;
            this.game = gameGundam.playCard(this.game, card1, card2, drop);
            this.refreshGame();
        },
        selectChoice(choice) {
            this.freeze = true;
            this.game = gameGundam.selectChoice(this.game, choice);
            this.refreshGame();
        },
        selectChoiceCard(card) {
            this.freeze = true;
            this.game = gameGundam.selectChoiceCard(this.game, card);
            this.refreshGame();
        },
        showLocationCards(location, isPlayer1) {
            this.game = gameGundam.showLocationCards(this.game, location, isPlayer1);
            this.refreshGame();
        },
        showOrHidePopup() {
            this.popupShow = !this.popupShow;
        },
        refreshGame() {
            this.freeze = true;
            this.cards = this.game.cards;
            this.sources = this.game.player1.drags;

            this.showTextEffect(this.game.showTitle, 'title', 'divTitleParent', { height: 0 });
            this.showTextEffect(this.game.textEffect?.text, 'text', 'divTextEffect', { height: 0 });

            this.refreshG++;
            setTimeout(() => { this.beginAnimation(); }, 10);
        },
        animTextEffect() {
            let animationTime = gameGundam.delay;
            helperAnimation.animateMultiple([{ id: 'textEffect', from: this.game.textEffect.position, to: this.game.textEffect.to, isIncrement: false }], animationTime);
        },
        beginAnimation() {
            let animationTime = gameGundam.delay;
            const cardsToAnimate = this.cards.filter(x => x.to);
            animationTime = cardsToAnimate.length < 1 && !this.game.showTitle && !this.game.textEffect ? 10 : gameGundam.delay;
            this.freeze = true;
            setTimeout(() => { this.endAnimation(); }, animationTime + 10);

            if (cardsToAnimate.length < 1)
                return;

            const animations = cardsToAnimate.map(card => { return { id: 'C' + card.index, from: card.position, to: card.to, isIncrement: false }; });
            helperAnimation.animateMultiple(animations, animationTime);
        },
        endAnimation() {
            const wait = this.game.wait ? this.game.wait : 1;
            setTimeout(() => { this.continue() }, wait);
        },
        showTextEffect(text, property, divId, to) {
            if (!text || this.ignoreEvent.includes(property))
                return;

            const animationTime = 200;
            this.ignoreEvent.push(property);
            this[property] = text;

            setTimeout(() => { helperAnimation.animate(divId, { height: 0 }, { height: 100 }, false, animationTime); }, 10);
            setTimeout(() => { helperAnimation.animate(divId, { height: 100 }, to, false, animationTime); }, 10 + animationTime * 4);
            setTimeout(() => { this.ignoreEvent = this.ignoreEvent.filter(x => x !== property); }, 10 + animationTime * 6);
        },

        // --------- showCard
        clickDrop(event) {
            this.showCard(event.card);
        },
        showCard(card) {
            const center = this.game ? this.game.grid.highlightCardCenter : { x: 0, y: 0, width: 200, height: 280 };
            if (!card)
                this.cardCenter = {
                    id: this.cardCenter.id,
                    position: this.cardCenter.position,
                    to: { ...this.cardCenter.position, height: 0 }
                };
            else
                this.cardCenter = {
                    id: card.id,
                    position: card.position,
                    to: {
                        x: center.x,
                        y: center.y,
                        width: center.width,
                        height: center.height,
                        rotation: 0
                    }
                };

            const animations = [{ id: 'cardCenter', from: this.cardCenter.position, to: this.cardCenter.to, isIncrement: false }];
            helperAnimation.animateMultiple(animations, gameGundam.delay);
            setTimeout(() => {
                this.cardCenter.position = this.cardCenter.to;
                delete (this.cardCenter.to);
            }, 510);

        },

        // Utils
        clone(obj) { return Object.assign({}, obj); },
        getCard(index) {
            return this.cards.find(x => x.index == index);
        },
        getFieldStyleObj(size) {
            return this.getFieldStyle(size.x, size.y, size.width, size.height);
        },
        getFieldStyle(x, y, w, h) {
            return {
                width: w + 'px', height: h + 'px',
                left: x + 'px', top: y + 'px'
            };
        }
    }
}
</script>