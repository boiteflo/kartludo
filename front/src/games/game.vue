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
                {{texts.resources}}
            </div>
            <banana-bars :p1yellow="game.player1.resourcesAvailable - game.player1.resourcesEx"
                :p1blue="game.player1.resourcesEx" :p1max="game.player1.resourcesMax"
                :p2yellow="game.player2.resourcesAvailable - game.player2.resourcesEx"
                :p2blue="game.player2.resourcesEx" :p2max="game.player2.resourcesMax" :max="game.resourcesMax"
                :style="getFieldStyleObj(game.grid.resources)" :width="game.grid.resources.width">
            </banana-bars>

            <!-- Player 1 -->
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player1Deck)" :text="texts.deck"
                :length="game.player1.deck.length" :icon="game.player1.deckIcon">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player1Trash)" :text="texts.trash"
                :length="game.player1.trash.length" :icon="game.player1.trashIcon"
                @click="showLocationCards('trash', true)">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player1Base)" :text="texts.base"
                :icon="game.player1.baseIcon">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player1Shield)" :text="texts.shield"
                :length="game.player1.shield.length" :icon="game.player1.shieldIcon">
            </deck-icon>
            <div v-if="game" class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.player1Hand)">
            </div>
            <div v-if="game" class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.player1Field)">
            </div>

            <!-- Player 2-->
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player2Deck)" :text="texts.deck"
                :length="game.player2.deck.length" :icon="game.player2.deckIcon">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player2Trash)" :text="texts.trash"
                :length="game.player2.trash.length" :icon="game.player2.trashIcon"
                @click="showLocationCards('trash', false)">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player2Base)" :text="texts.base"
                :icon="game.player2.baseIcon">
            </deck-icon>
            <deck-icon class="absolute" :style="getFieldStyleObj(game.grid.player2Shield)" :text="texts.shield"
                :length="game.player2.shield.length" :icon="game.player2.shieldIcon">
            </deck-icon>
            <div class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.player2Hand)">
            </div>
            <div class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.player2Field)">
            </div>

            <!-- Buttons -->
            <div class="absolute bgYellow circle10px fontSize075em" :style="getFieldStyleObj(game.grid.buttonEffect)">
                <v-btn target="_blank"
                    :class="{ bg: true, shine: !freeze && game.player1.hasEffects, w100p: true, h100p: true }"
                    @click="useEffect" style="min-width:0px;">
                    <span v-html="texts.useEffect"></span>
                </v-btn>
            </div>
            <div class="absolute bgYellow circle10px fontSize075em" :style="getFieldStyleObj(game.grid.buttonEndTurn)">
                <v-btn target="_blank" :class="{ bg: true, shine: !freeze, w100p: true, h100p: true }"
                    style="min-width:0px;" @click="nextTurn">
                    <span v-if="game.grid.buttonEndTurn.width > 50" v-html="texts.endTurn"></span><span v-else v-html="texts.end"></span>
                </v-btn>
            </div>
            <div class="absolute vertical-scroll" v-html="game.logs" :style="getFieldStyleObj(game.grid.logZone)">
            </div>

            <!-- TutoMasks-->
            <div v-for="(tutoMask, index) in game.tutoMasks" :key="'TutoMask' + index"
                :class="{ absolute: 1, bg2: tutoMask.isPlayer1, bg: !tutoMask.isPlayer1 }"
                :style="getFieldStyleObj(tutoMask)">
            </div>

            <!-- Highlight and TextZone-->
            <div class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.textZone)">
            </div>
            <div class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.highlightCardCenter)">
            </div>
            <div class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.highlightCardLeft)">
            </div>
            <div class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.highlightCardRight)">
            </div>

            <!-- cards -->
            <div v-for="card in game.cards.filter(x => !x.hide)" :key="'B' + card.index">
                <gameCard :id="'C' + card.index" :card="card" folder="Gundam/cards/" :shine="card.selectable && !freeze"
                    :hidestat="card.hidestat" @click="showCard(card)">
                </gameCard>
            </div>

            <!-- Tuto Text -->
            <div v-if="game.showTextTuto" class="absolute fadeIn"
                :style="{ ...getFieldStyleObj(game.showTextTuto), 'z-index': game.showTextTuto.zindex ? game.showTextTuto.zindex : 56 }">
                <!-- Arrow-->
                <div class="bgWhite absolute" v-if="game.showTextTuto.arrow"
                    :style="{ ...getFieldStyleObj(game.showTextTuto.arrow), transform: 'rotate(45deg)', 'z-index': -1, border: 'solid blue 5px' }">
                </div>

                <div class="w100p h100p bgWhite colorBlack flex"
                    style="flex-direction: column; justify-content: center; border: solid blue 5px">
                    <div class="text-center m5px">{{ game.showTextTuto.text }}</div>
                    <div v-if="!game.showTextTuto.hideNext" class="m5px bgYellow circle10px"
                        style="align-self: flex-end;">
                        <v-btn class="bg2 shine" @click="tutoNext">{{texts.next}}</v-btn>
                    </div>

                </div>
            </div>
        </span>

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
                        <span v-if="popupShow">{{texts.hidePopup}}</span><span v-else>{{texts.showPopup}}</span>
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
    props: ['playerinfo', 'texts', 'deck1', 'deck2', 'quickstart', 'tuto', 'campaign'],
    components: { gameCard, bananaBars, deckIcon, dragDropArrow },
    data: () => ({
        refreshG: 0,
        resizeTimeout: null,
        freeze: true,
        cardCenter: { id: 'GD01-028', position: { width: 0 } },
        game: null,
        title: null,
        text: null,
        popupShow: true,
        ignoreEvent: [],
        decklistPlayer1: null,
        decklistPlayer2: null,
        sources: [],
        targets: []
    }),
    mounted() {
        window.addEventListener("resize", () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(this.resizeGame, 300);
        });
        
        this.setDecks();
    },
    methods: {
        resizeGame() {
            gameGundam.resize(this.game, this.$vuetify.breakpoint.width,
                this.$vuetify.breakpoint.height);
        },
        setDecks() {
            this.decklistPlayer1 = this.deck1;
            this.decklistPlayer2 = this.deck2;
            if (this.decklistPlayer1 && this.decklistPlayer2)
                this.start();
        },
        start() {
            this.game = gameGundam.setup(this.$vuetify.breakpoint.width,
                this.$vuetify.breakpoint.height,
                cards,
                this.playerinfo,
                this.texts,
                this.decklistPlayer1,
                this.decklistPlayer2,
                this.quickstart,
                this.tuto,
                this.campaign);
            this.refreshGame();
        },
        nextTurn() {
            if (this.freeze)
                return;
            gameGundam.endTurn(this.game);
            this.refreshGame();
        },
        continue() {
            this.freeze = false;
            gameGundam.continue(this.game);
            if (this.game.end) {
                this.$emit('end', this.game.isVictory);
                return;
            }
            if (this.game.popup || this.game.freeze) {
                this.freeze = true;
                return;
            }
            if (this.game.freezeButtons)
                this.freeze = true;

            if (this.game.refreshOnlyTextEffect)
                this.animTextEffect();

            if (this.game.refresh)
                this.refreshGame();
        },
        useEffect() {
            if (this.freeze)
                return;
            gameGundam.useEffect(this.game);
            this.continue();
        },
        dropPoint(event) {
            if (!event || !event.target || !event.target.text)
                return;

            if (event.target.text === this.texts.play)
                this.playCard(event.source.card, null, this.game.grid.player1Field);
            if (event.target.text === this.texts.pair)
                this.playCard(event.source.card, event.target.card, this.game.grid.player1Field);
            if (event.target.text === this.texts.attack)
                this.playCard(event.source.card, event.target.card, this.game.grid.player2Field);
        },
        playCard(card1, card2, drop) {
            if (this.freeze)
                return;
            this.freeze = true;
            gameGundam.playCard(this.game, card1, card2, drop);
            this.refreshGame();
        },
        selectChoice(choice) {
            this.freeze = true;
            gameGundam.selectChoice(this.game, choice);
            this.refreshGame();
        },
        selectChoiceCard(card) {
            this.freeze = true;
            gameGundam.selectChoiceCard(this.game, card);
            this.refreshGame();
        },
        showLocationCards(location, isPlayer1) {
            gameGundam.showLocationCards(this.game, location, isPlayer1);
            this.refreshGame();
        },
        showOrHidePopup() {
            this.popupShow = !this.popupShow;
        },
        tutoNext(next = true) {
            gameGundam.tutoNext(this.game, next);
            this.refreshGame();
        },
        refreshGame() {
            this.freeze = true;
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
            const cardsToAnimate = this.game.cards.filter(x => x.to);
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
            if(this.freeze)
                return;
            const center = this.game ? this.game.grid.highlightCardCenter : { x: 0, y: 0, width: 200, height: 280 };
            if (!card) {
                if (this.game.freeze)
                    return;

                this.cardCenter = {
                    id: this.cardCenter.id,
                    position: this.cardCenter.position,
                    to: { ...this.cardCenter.position, height: 0 }
                };
            }
            else {
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
            }

            const animations = [{ id: 'cardCenter', from: this.cardCenter.position, to: this.cardCenter.to, isIncrement: false }];
            helperAnimation.animateMultiple(animations, gameGundam.delay);
            setTimeout(() => {
                this.cardCenter.position = this.cardCenter.to;
                delete (this.cardCenter.to);
                this.game.cardCenter = this.cardCenter.position.height > 0 ? this.cardCenter : null;
                this.tutoNext(false);
            }, 510);

        },

        // Utils
        clone(obj) { return Object.assign({}, obj); },
        getCard(index) {
            return this.game.cards.find(x => x.index == index);
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