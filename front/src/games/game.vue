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
        <div v-for="box in game?.fields" :key="box.zone" :id="box.zone"
            :class="{ absolute: true, bg3: box.zone.endsWith('2'), bg: box.zone.endsWith('1'), fontSize12: true, textVerticalCenter: true, 'text-center': true,
                bgYellow2: box.isPlayer1 == game.isPlayer1 && box.location === 3
             }"
            :style="getFieldStyle(box.x, box.y, box.width, box.height)" @dragover="onDragOver"
            @drop="onDrop($event, box)">
            {{ box.text }}
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
            <gameCard :id="'C' + card.index" :card="card" folder="Gundam/cards/" :shine="card.selectable"
                @mouseover="showCardMouseOver(card)" @click="showCard(card)" @dragover="onDragOver"
                @drop="onDrop($event, card)" draggable="true">
            </gameCard>
        </div>

        <v-btn target="_blank" text class="bg m5px absolute" @click="nextTurn">
            <v-icon>mdi-arrow-right-thin</v-icon>
            End Turn
        </v-btn>

        <!-- Title -->
        <div id="divTitleParent" class="absolute bgWhite mask" style="top:80px; width: 100%; height:0px;">
            <div class="relative">
                <div class="text-center absolute w100p title" style="left:-000px; top:30px;">{{ title }}
                </div>
            </div>
        </div>

        <!-- Card center -->
        <gameCard id="cardCenter" :card="cardCenter" folder="Gundam/cards/" @click="showCard(null)">
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
        freeze: false,
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
            this.game = gameManager.nextTurn(this.game);
            this.refreshGame();
        },
        continue(){
            this.game = gameManager.handleTasks(this.game);
            if(this.game.refresh)
                this.refreshGame();
        },
        playCardOnZone(card, drop) {
            alert(card.name + ' in ' + drop.zone);
            card.to = this.clone(card.position);
            card.positionOld = this.clone(card.position);
            card.position = { ...card.position, ...card.positionDrag };
            this.beginAnimation();
        },
        playCardOnCard(card, cardDrop) {
            alert(card.name + ' in ' + cardDrop.name);
            card.to = this.clone(card.position);
            card.positionOld = this.clone(card.position);
            card.position = { ...card.position, ...card.positionDrag };
            this.beginAnimation();
        },
        refreshGame() {
            this.cards = this.game.cards;
            setTimeout(() => { this.setDrag(); }, 10);

            if (this.game.showTitle)
                this.showTitle(this.game.showTitle);

            this.refreshG++;
            setTimeout(() => { this.beginAnimation(); }, 10);
        },
        beginAnimation() {
            let animationTime = 500;
            const cardsToAnimate = this.cards.filter(x => x.to);
            animationTime = cardsToAnimate.length < 1 ? 10 : 500;
            setTimeout(() => { this.endAnimation(); }, animationTime + 10);
            if (cardsToAnimate.length < 1) 
                return;

            this.freeze = true;
            const animations = cardsToAnimate.map(card => { return { id: 'C' + card.index, from: card.position, to: card.to, isIncrement: false }; });
            helperAnimation.animateMultiple(animations, animationTime);

        },
        endAnimation() {
            this.cards.forEach(card => {
                if (card.positionOld) card.position = card.positionOld;
                if (card.to) card.position = card.to;
                delete (card.to);
            });
            this.freeze = false;
            delete (this.game.showTitle);
            if(this.game.wait)
                setTimeout(() => { this.continue(); }, this.game.wait);            
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
                        height: this.game.grid.center.height
                    }
                };

            const animations = [{ id: 'cardCenter', from: this.cardCenter.position, to: this.cardCenter.to, isIncrement: false }];
            helperAnimation.animateMultiple(animations, 500);
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
            if (!card.moving) return;

            // Gestion du touch ou de la souris
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
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(new Image(), 0, 0);
            event.dataTransfer.setData('card', card.index);
            card.moving = true;
            event.target.style.zIndex = "1000";
        },
        onDragOver(event) {
            event.preventDefault();
        },
        onDrop(event, drop) {
            event.preventDefault();
            const x = event.clientX || event.pageX || (event.touches ? event.touches[0].clientX : null);
            const y = event.clientY || event.pageY || (event.touches ? event.touches[0].clientY : null);

            event.target.style.zIndex = "auto";
            const data = event.dataTransfer.getData("card");
            const card = this.getCard(data);
            card.moving = false;

            if (drop.index === card.index)
                drop = this.getTouchZoneOrCard(x, y, card.index);

            if (drop.zone)
                this.playCardOnZone(card, drop);
            else
                this.playCardOnCard(card, drop);
        },


        // --------- Touch
        touchStart(event, card) {
            card.moving = true;
            event.target.style.zIndex = "1000";
        },
        touchEnd(event, card) {
            card.moving = false;
            event.target.style.zIndex = "auto";
            const touch = event.changedTouches[0];
            let zoneOrCard = this.getTouchZoneOrCard(touch.clientX, touch.clientY, card.index);
            if (!zoneOrCard || card.index == zoneOrCard.index)
                return;

            if (zoneOrCard.zone)
                this.playCardOnZone(card, zoneOrCard);
            else
                this.playCardOnCard(card, zoneOrCard);
        },
        getTouchZoneOrCard(x, y, ignoreIndex) {
            const card = this.cards.find(card => card.index !== ignoreIndex && this.isInside(x, y, card.position));
            const zone = card ? null : this.game.fields.find(zone => this.isInside(x, y, zone));
            return card || zone;
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
        getFieldStyle(x, y, w, h) {
            return {
                width: w + 'px', height: h + 'px',
                left: x + 'px', top: y + 'px'
            };
        }
    }
}
</script>