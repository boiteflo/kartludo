<template>
    <div class="relative w100p h100p mask" :key="refreshG">

        <!-- Grid -->
        <div class="hide">
            <div v-for="i in 16" :key="'x' + i"
                :style="{ height: game?.grid.box.height + 'px', top: getGridY(i - 1) + 'px' }"
                class="bgYellow absolute w100p"></div>
            <div v-for="i in 16" :key="'y' + i"
                :style="{ width: game?.grid.box.width + 'px', left: getGridX(i - 1) + 'px' }"
                class="bgRed absolute h100p">
            </div>
        </div>

        <!-- field -->
        <div v-for="box in game?.fields.filter(x => x.show)" :key="box.zone" :id="box.zone" :class="{
            absolute: true, bg3: box.zone.endsWith('2'), bg: box.zone.endsWith('1'), fontSize1em: true, textVerticalCenter: true, 'text-center': true,
            bgYellow2: box.isPlayer1 == game.isPlayer1 && box.location === 'locationHand'
        }" :style="getFieldStyle(box.x, box.y, box.width, box.height)" @dragover="onDragOver"
            @drop="onDrop($event, box)">
            {{ box.text }}
        </div>

        <!-- field centerMini -->
        <div v-if="game" class="bgRed absolute hide" :style="getFieldStyle(game.grid.centerMini.card1.x, game.grid.centerMini.card1.y,
            game.grid.centerMini.card1.width, game.grid.centerMini.card1.height)">
        </div>
        <div v-if="game" class="bgRed absolute hide" :style="getFieldStyle(game.grid.centerMini.card2.x, game.grid.centerMini.card2.y,
            game.grid.centerMini.card2.width, game.grid.centerMini.card2.height)">
        </div>
        <div v-if="game" class="bgYellow absolute hide" :style="getFieldStyle(game.grid.centerMini.text.x, game.grid.centerMini.text.y,
            game.grid.centerMini.text.width, game.grid.centerMini.text.height)">
        </div>

        <!-- textEffect -->
        <div v-if="game && game.textEffect" id="textEffect"
            class="bgWhite absolute mask text-center textVerticalCenter fontSize150em" :style="{
                ...getFieldStyle(game.textEffect?.position.x, game.textEffect?.position.y,
                    game.textEffect?.position.width, game.textEffect?.position.height), 'z-index': 11
            }">
            <div v-html="game.textEffect.text"></div>
        </div>

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

        <!-- End turn button -->
        <div v-if="game">
            <div class="bgYellow absolute cirlce10px"
                :style="{ left: game.grid.x0 + 'px', top: '30px', height: game.grid.hand.height - 25 + 'px', width: game.fields[0].width + 'px' }">

                <v-btn target="_blank" text
                    :class="{ bg: true, w100p: true, h100p: true, shine: !freeze, fontSize1em: true }" @click="nextTurn"
                    style="min-width:0px;">
                    End <br>Turn
                </v-btn>
            </div>
        </div>

        <!-- Popup -->
        <div v-if="game?.popup" class="textVerticalCenter"
            style="z-index:12; width:100%; height: 64px; position:fixed; top:0px; left:0px;">

            <div style="background-color: #FFFF00F0; width:100%; height:100%;">
                <h3 class="text-center colorBlack textVerticalCenter w100p" v-html="game?.popup.text"></h3>
                <div class="flex-wrap w100p">
                    <div v-for="(card, index) in game?.popup.cards" :key="'PopUpCard' + index" class="mp5px">
                        <img :style="getFieldStyleObj(game?.grid.card6)" @click="selectChoiceCard(card)"
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

        <!-- Title -->
        <div id="divTitleParent" class="absolute bgWhite mask" style="top:80px; width: 100%; height:0px; z-index:13">
            <div class="relative">
                <div class="text-center absolute w100p title" style="left:-000px; top:30px;">{{ title }}
                </div>
            </div>
        </div>

        <!-- Card center -->
        <gameCard id="cardCenter" :card="cardCenter" folder="Gundam/cards/" @click="showCard(null)"
            style="z-index: 12;">
        </gameCard>

        <div class="absolute hide">
            hello world
        </div>
    </div>

</template>

<style scoped>
html,
body {
    overflow: hidden;
    overscroll-behavior: none;
}

body {
    position: relative;
}
</style>

<script>
import helperAnimation from '../helpers/helperAnimation';
import gameManager from './gameManager';
import gundamManager from './gundam/manager';
import gameCard from './card';

export default {
    name: 'game-vue',
    props: [],
    components: { gameCard },
    data: () => ({
        refreshG: 0,
        aside: false,
        freeze: true,
        cards: [],
        cardCenter: { id: 'GD01-028', position: { width: 0 } },
        game: null,
        title: '',
    }),
    mounted() {
        document.body.style.overflow = "hidden";
        window.addEventListener("resize", () => {
            this.refreshG++;
        });
        this.start();
    },
    methods: {
        start() {
            this.game = gameManager.createGame(gundamManager, this.$vuetify.breakpoint.width, this.$vuetify.breakpoint.height);
            this.refreshGame();
        },
        nextTurn() {
            if(this.freeze)
                return;
            this.game = gameManager.nextTurn(this.game);
            this.refreshGame();
        },
        continue() {
            this.freeze = false;
            this.game = gameManager.continue(this.game);
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
            if(this.freeze)
                return;
            this.freeze = true;
            this.game = gameManager.playCard(this.game, card1, card2, drop);
            this.refreshGame();
        },
        selectChoice(choice){
            this.freeze = true;
            this.game = gameManager.selectChoice(this.game, choice);
            this.refreshGame();
        },
        selectChoiceCard(card) {
            this.freeze = true;
            this.game = gameManager.selectChoiceCard(this.game, card);
            this.refreshGame();
        },
        refreshGame() {
            this.freeze = true;
            this.cards = this.game.cards;
            setTimeout(() => { this.setDrag(); }, 10);

            if (this.game.showTitle)
                this.showTitle(this.game.showTitle);

            this.refreshG++;
            setTimeout(() => { this.beginAnimation(); }, 10);
        },
        animTextEffect() {
            let animationTime = gundamManager.getAnimDuration();
            helperAnimation.animateMultiple([{ id: 'textEffect', from: this.game.textEffect.position, to: this.game.textEffect.to, isIncrement: false }], animationTime);
        },
        beginAnimation() {
            let animationTime = gundamManager.getAnimDuration();
            const needToAnimateTextEffect = this.game && this.game.textEffect && this.game.textEffect.to ? true : false;
            const cardsToAnimate = this.cards.filter(x => x.to);
            animationTime = !needToAnimateTextEffect && cardsToAnimate.length < 1 ? 10 : gundamManager.getAnimDuration();
            this.freeze = true;
            setTimeout(() => { this.endAnimation(); }, animationTime + 10);

            if (cardsToAnimate.length < 1)
                return;

            const animations = cardsToAnimate.map(card => { return { id: 'C' + card.index, from: card.position, to: card.to, isIncrement: false }; });
            if (this.game && this.game.textEffect && this.game.textEffect.to)
                animations.push({ id: 'textEffect', from: this.game.textEffect.position, to: this.game.textEffect.to, isIncrement: false });
            helperAnimation.animateMultiple(animations, animationTime);

        },
        endAnimation() {
            const wait = this.game.wait ? this.game.wait : 1;
            if (this.game && this.game.textEffect && this.game.textEffect.to) {
                this.game.textEffect.position = this.game.textEffect.to;
                delete (this.game.textEffect.to);
            }
            setTimeout(() => { this.continue() }, wait);
        },
        showTitle(text) {
            this.title = text;
            const animationTime = 200;
            setTimeout(() => { helperAnimation.animate('divTitleParent', { height: 0 }, { height: 100 }, false, animationTime); }, 10);
            setTimeout(() => { helperAnimation.animate('divTitleParent', { height: 100 }, { height: 0 }, false, animationTime); }, 4.5 * (animationTime + 10));
        },

        // --------- showCard
        showCardMouseOver(card) {
            if (this.aside)
                this.showCard(card);
        },
        showCard(card) {
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
                        x: this.game.grid.center.x,
                        y: this.game.grid.center.y,
                        width: this.game.grid.center.width,
                        height: this.game.grid.center.height,
                        rotation: 0
                    }
                };

            const animations = [{ id: 'cardCenter', from: this.cardCenter.position, to: this.cardCenter.to, isIncrement: false }];
            helperAnimation.animateMultiple(animations, gundamManager.getAnimDuration());
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
            if(this.freeze || card.isPlayer1 !== this.game.isPlayer1 || !card)
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
            if(this.freeze)
                return;
            event.preventDefault();
            const x = event.clientX || event.pageX || (event.touches ? event.touches[0].clientX : null);
            const y = event.clientY || event.pageY || (event.touches ? event.touches[0].clientY : null);

            event.target.style.zIndex = "auto";
            const data = event.dataTransfer.getData("card");
            const card = this.getCard(data);
            if(!card)
                return;
            card.moving = false;

            const card2 = this.cards.find(ca => ca.index !== card.index && this.isInside(x, y, ca.position) && !ca.isPaired);
            const zoneDrop = this.game.fields.find(zone => this.isInside(x, y, zone));
            this.playCard(card, card2, zoneDrop);
        },


        // --------- Touch
        touchStart(event, card) {
            if(this.freeze || card.isPlayer1 !== this.game.isPlayer1 || !card)
                return;
            card.moving = true;
            card.positionOld = this.clone(card.position);
            event.target.style.zIndex = "1000";
        },
        touchEnd(event, card) {
            if(this.freeze || card.isPlayer1 !== this.game.isPlayer1  || !card)
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