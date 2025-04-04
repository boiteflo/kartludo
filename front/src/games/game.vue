<template>
    <div class="relative w100p mask h100p" :key="refreshG">

        <!-- DeckList Show-->
        <deck-list v-if="decklistShow" :decklist="decklistShow" :cardlist="cardList" folder="Gundam/cards/"
            style="top:50px" @cardclick="showCardDeckList" @cancel="showDeckList(null)" @validate="selectDeckList">
        </deck-list>

        <!-- DeckLists -->
        <div v-if="!game">
            <h2>Select deck for the {{ decklistPlayer1 ? 'opponent' : 'player' }}</h2>
            <div class="flex flex-wrap flex-space-around fontSize150em">
                <deck v-for="(deck, index) in deckList" :key="'Deck' + index" :deck="deck" folder="Gundam/cards/"
                    @click="showDeckList(deck)">
                </deck>
            </div>
        </div>

        <!-- field
        <div v-for="box in game?.fields.filter(x => x.show)" :key="box.zone" :id="box.zone" :class="{
            absolute: true, bg3: box.zone.endsWith('2'), bg: box.zone.endsWith('1'), bg: box.zone.endsWith('0'), fontSize075em: true, textVerticalCenter: true, 'text-center': true,
            bgYellow2: box.isPlayer1 == game.isPlayer1 && box.location === 'locationHand'
        }" :style="getFieldStyle(box.x, box.y, box.width, box.height)" @dragover="onDragOver"
            @drop="onDrop($event, box)">
            {{ box.text }}
        </div>
         -->

        <span v-if="game">
            <!-- Drag and drop field-->
            <div class="absolute bg2" :style="getFieldStyleObj(game.grid.halfPlayer1)">
            </div>
            <div class="absolute bg" :style="getFieldStyleObj(game.grid.halfPlayer2)">
            </div>

            <img class="w100p, absolute" :style="{ ...getFieldStyleObj(game.grid.centerZone), 'object-fit': 'cover' }"
                :src="require('@/assets/Gundam/centerZone.png')" />

            <!-- Player 1 -->
            {{ game.player1.deckIcon }}
            <img class="absolute" :style="{ ...getFieldStyleObj(game.grid.player1Base), 'object-fit': 'contain' }"
                :src="require('@/assets/Gundam/' + game.player1.baseIcon)" />
            <img class="absolute" :style="{ ...getFieldStyleObj(game.grid.player1Shield), 'object-fit': 'contain' }"
                :src="require('@/assets/Gundam/' + game.player1.shieldIcon)" />
            <img class="absolute" :style="{ ...getFieldStyleObj(game.grid.player1Deck), 'object-fit': 'contain' }"
                :src="require('@/assets/Gundam/' + game.player1.deckIcon)" />
            <img class="absolute" :style="{ ...getFieldStyleObj(game.grid.player1Trash), 'object-fit': 'contain' }"
                :src="require('@/assets/Gundam/' + game.player1.trashIcon)" />
            <div class="absolute fontSize05em text-center" :style="getFieldStyleObj(game.grid.player1Base.text)">
                Base
            </div>
            <div class="absolute fontSize05em text-center" :style="getFieldStyleObj(game.grid.player1Shield.text)">
                Shield {{ game.player1.shield.length }}
            </div>
            <div class="absolute fontSize05em text-center" :style="getFieldStyleObj(game.grid.player1Deck.text)">
                Deck {{ game.player1.deck.length }}
            </div>
            <div class="absolute fontSize05em text-center" :style="getFieldStyleObj(game.grid.player1Trash.text)">
                Trash {{ game.player1.trash.length }}
            </div>
            <div v-if="game" class="absolute bgRed hide" :style="getFieldStyleObj(game.grid.player1Hand)">
            </div>
            <div v-if="game" class="absolute bgYellow hide" :style="getFieldStyleObj(game.grid.player1Field)">
            </div>

            <!-- Player 2-->
            <img class="absolute" :style="{ ...getFieldStyleObj(game.grid.player2Base), 'object-fit': 'contain' }"
                :src="require('@/assets/Gundam/' + game.player2.baseIcon)" />
            <img class="absolute" :style="{ ...getFieldStyleObj(game.grid.player2Shield), 'object-fit': 'contain' }"
                :src="require('@/assets/Gundam/' + game.player2.shieldIcon)" />
            <img class="absolute" :style="{ ...getFieldStyleObj(game.grid.player2Deck), 'object-fit': 'contain' }"
                :src="require('@/assets/Gundam/' + game.player2.deckIcon)" />
            <img class="absolute" :style="{ ...getFieldStyleObj(game.grid.player2Trash), 'object-fit': 'contain' }"
                :src="require('@/assets/Gundam/' + game.player2.trashIcon)" />
            <div class="absolute fontSize05em text-center" :style="getFieldStyleObj(game.grid.player2Base.text)">
                Base
            </div>
            <div class="absolute fontSize05em text-center" :style="getFieldStyleObj(game.grid.player2Shield.text)">
                Shield {{ game.player2.shield.length }}
            </div>
            <div class="absolute fontSize05em text-center" :style="getFieldStyleObj(game.grid.player2Deck.text)">
                Deck {{ game.player2.deck.length }}
            </div>
            <div class="absolute fontSize05em text-center" :style="getFieldStyleObj(game.grid.player2Trash.text)">
                Trash {{ game.player2.trash.length }}
            </div>
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

            <div class="absolute bgYellow circle10px" :style="getFieldStyleObj(game.grid.rightButton)">
                <v-btn target="_blank"
                    :class="{ bg2: true, shine: !freeze, fontSize075em: true, w100p: true, h100p: true }"
                    @click="nextTurn" style="min-width:0px;">
                    <span v-if="game.grid.rightButton.width > 50">End Turn</span><span v-else>End</span>
                </v-btn>
            </div>
            <div class="absolute" :style="getFieldStyleObj(game.grid.leftButton)">
                <v-btn target="_blank" :class="{ bg: true, fontSize075em: true, w100p: true, h100p: true }"
                    @click="nextTurn" style="min-width:0px;">
                    Logs
                </v-btn>
            </div>
        </span>

        <!-- Show card -->
        <div class="flex absolute" v-if="aside">
            <div class="bg" style="width:300px; height:100%;">
                <div class="relative">
                    <gameCard :card="cardCenter" folder="Gundam/cards/"></gameCard>
                </div>
                <div style="height:420px"></div>
                <v-btn target="_blank" text class="bg m5px" @click="start">
                    <v-icon>mdi-arrow-right-thin</v-icon>
                    Start
                </v-btn>
                <v-btn target="_blank" text class="bg m5px" @click="nextTurn">
                    <v-icon>mdi-arrow-right-thin</v-icon>
                    End Turn
                </v-btn>
                <div class="mp5px" v-html="game?.logs"></div>
            </div>
        </div>

        <!-- cards -->
        <div v-for="card in cards" :key="'B' + card.index" @dragover="onDragOver" @drop="onDrop($event, card)">
            <gameCard :id="'C' + card.index" :card="card" folder="Gundam/cards/" :shine="card.selectable && !freeze"
                :hidestat="card.hidestat" @mouseover="showCardMouseOver(card)" @click="showCard(card)"
                @dragover="onDragOver" @drop="onDrop($event, card)" draggable="true">
            </gameCard>
        </div>

        <!-- Sliders Resources -->
        <div v-if="game" class="absolute" :style="{ ...getFieldStyleObj(game.grid.player1Resource), 'z-index': 10 }">
            <slider-resource label="Resources :" :value1="game.player1.resourcesAvailable"
                :value2="game.player1.resourcesEx" :valuemax="game.player1.resourcesMax">
            </slider-resource>
        </div>
        <div v-if="game" class="absolute" :style="{ ...getFieldStyleObj(game.grid.player2Resource), 'z-index': 10 }">
            <slider-resource label="Resources :" :value1="game.player2.resourcesAvailable"
                :value2="game.player2.resourcesEx" :valuemax="game.player2.resourcesMax">
            </slider-resource>
        </div>

        <!-- End turn button -->
        <div v-if="game && false">
            <div class="bgYellow absolute circle10px"
                :style="{ left: game.grid.x0 + 'px', top: '30px', height: game.grid.hand.height - 25 + 'px', width: game.fields[0].width + 'px' }">

                <v-btn target="_blank" text
                    :class="{ bg: true, w100p: true, h100p: true, shine: !freeze, fontSize075em: true }"
                    @click="nextTurn" style="min-width:0px;">
                    End <br>Turn
                </v-btn>
            </div>
        </div>

        <!-- Popup -->
        <div v-if="game?.popup" class="textVerticalCenter h100p"
            style="z-index:12; width:100%; position:fixed; left:0px;">

            <div style="background-color: #FFFF00F0; width:100%; flex-direction: column-reverse" class="flex">
                <h3 class="text-center colorBlack textVerticalCenter w100p mp5px" v-html="game?.popup.text"></h3>
                <div class="flex-wrap w100p horizontal-scroll">
                    <div v-for="(card, index) in game?.popup.cards" :key="'PopUpCard' + index" class="mp5px cursorHand">
                        <img :style="getFieldStyleObj(game?.grid.card100)" @click="selectChoiceCard(card)"
                            :src="require('@/assets/Gundam/cards/' + card.id + '.webp')" />
                    </div>
                </div>
                <span class="relative">
                    <span v-for="(choice, index) in game?.popup.choices" :key="'Choice' + index">
                        <v-btn v-if="choice.text" class="m10px" @click="selectChoice(choice)">
                            {{ choice.text }}
                        </v-btn>
                    </span>
                </span>
            </div>
        </div>

        <div v-if="game && game.tasks" class="absolute hide" style="z-index:12;">
            {{game.tasks.map(x => x.id)}}
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
            style="z-index: 12;">
        </gameCard>
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
import sliderResource from './sliderResource';
import gameCard from './card';
import deck from './deck';
import deckList from './deckList';

export default {
    name: 'game-vue',
    props: [],
    components: { gameCard, deck, deckList, sliderResource },
    data: () => ({
        refreshG: 0,
        aside: false,
        freeze: true,
        cards: [],
        cardCenter: { id: 'GD01-028', position: { width: 0 } },
        game: null,
        title: null,
        text: null,
        ignoreEvent: [],
        cardList: null,
        decklistPlayer1: null,
        decklistPlayer2: null,
        decklistShow: null,
        deckList: [],
        quickstart: true
    }),
    mounted() {
        document.body.style.overflow = "hidden";
        window.addEventListener("resize", () => {
            this.refreshG++;
        });

        this.cardList = cards.cards;
        this.deckList = cards.decklist;
        if (this.quickstart) {
            this.decklistPlayer1 = cards.decklist[5].list;
            this.decklistPlayer2 = cards.decklist[5].list;
            this.start();
        }
    },
    methods: {
        showDeckList(decklist) {
            this.decklistShow = decklist;
        },
        selectDeckList(decklist) {
            if (!this.decklistPlayer1)
                this.decklistPlayer1 = decklist.list;
            else {
                this.decklistPlayer2 = decklist.list;
                this.start();
            }
            this.decklistShow = null;
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
            if (this.game.popup) {
                this.freeze = true;
                return;
            }
            if (this.game.refreshOnlyTextEffect)
                this.animTextEffect();

            if (this.game.refresh)
                this.refreshGame();
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
        refreshGame() {
            this.freeze = true;
            this.cards = this.game.cards;
            setTimeout(() => { this.setDrag(); }, 10);

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
        showCardMouseOver(card) {
            if (this.aside)
                this.showCard(card);
        },
        showCardDeckList(card) {
            const newCard = { ...card };
            newCard.position = { ...card.position, x: card.position.x + 300 };
            this.showCard(newCard);
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

        // --------- Drag and drop
        setDrag() {
            this.cards.forEach(card => {
                const id = 'C' + card.index;
                this.addEvent(id, 'dragstart', (event) => this.startDrag(event, card));
                this.addEvent(id, 'dragover', (event) => this.moveCard(event, card));
                this.addEvent(id, 'touchmove', (event) => this.moveCard(event, card));
                this.addEvent(id, 'touchstart', (event) => this.touchStart(event, card));
                this.addEvent(id, 'touchend', (event) => this.touchEnd(event, card));
            });
        },
        addEvent(id, event, action) {
            const element = document.getElementById(id);
            if (element)
                element.addEventListener(event, (event) => action(event));
        },
        moveCard(event, card) {
            if (!card && card.isPlayer1 !== this.game.isPlayer1 || !card)
                return;

            let x = event.touches ? event.touches[0].clientX : event.clientX;
            let y = event.touches ? event.touches[0].clientY : event.clientY;

            x -= card.position.width / 2;
            y -= card.position.height / 2;

            const element = event.target;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            card.positionDrag = { x, y };
        },
        startDrag(event, card) {
            if (this.freeze || card.isPlayer1 !== this.game.isPlayer1 || !card)
                return;
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(new Image(), 0, 0);
            event.dataTransfer.setData('card', card.index);
            card.moving = true;
            card.positionOld = this.clone(card.position);
            event.target.style.zIndex = "1000";
        },
        onDragOver(event) {
            event.preventDefault();
        },
        onDrop(event) {
            if (this.freeze)
                return;
            event.preventDefault();
            const x = event.clientX || event.pageX || (event.touches ? event.touches[0].clientX : null);
            const y = event.clientY || event.pageY || (event.touches ? event.touches[0].clientY : null);

            event.target.style.zIndex = "auto";
            const data = event.dataTransfer.getData("card");
            const card = this.getCard(data);
            if (!card)
                return;
            card.moving = false;

            const card2 = this.cards.find(ca => ca.index !== card.index && this.isInside(x, y, ca.position) && !ca.isPaired);
            const zoneDrop = this.game.fields.find(zone => this.isInside(x, y, zone));
            this.playCard(card, card2, zoneDrop);
        },


        // --------- Touch
        touchStart(event, card) {
            if (this.freeze || card.isPlayer1 !== this.game.isPlayer1 || !card)
                return;
            card.moving = true;
            card.positionOld = this.clone(card.position);
            event.target.style.zIndex = "1000";
        },
        touchEnd(event, card) {
            if (this.freeze || card.isPlayer1 !== this.game.isPlayer1 || !card)
                return;
            card.moving = false;
            event.target.style.zIndex = "auto";
            const touch = event.changedTouches[0];

            const card2 = this.cards.find(ca => ca.index !== card.index && this.isInside(touch.clientX, touch.clientY, ca.position) && !ca.isPaired);
            const zone = this.game.fields.find(zone => this.isInside(touch.clientX, touch.clientY, zone));
            this.playCard(card, card2, zone);
        },
        isInside(x, y, box) {
            const minX = box.x;
            const minY = box.y;
            const maxX = minX + box.width;
            const maxY = minY + box.height;
            return (x >= minX && x <= maxX) && (y >= minY && y <= maxY);
        },

        // Utils
        clone(obj) { return Object.assign({}, obj); },
        showText(text) { alert(text); },
        getGridX(i) { return this.game?.grid['x' + i]; },
        getGridY(i) { return this.game?.grid['y' + i]; },
        getCard(index) {
            return this.cards.find(x => x.index == index);
        },
        getGridPlace(x, y) {
            return {
                width: this.game?.grid.box.width + 'px', height: this.game?.grid.box.height + 'px',
                left: this.getGridX(x) + 'px', top: this.getGridY(y) + 'px'
            };
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