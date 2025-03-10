<template>
    <div class="relative w100p h100p" :key="refreshG">

        <!-- Grid -->
        <div class="">
            <div v-for="i in 16" :key="'x' + i"
                :style="{ height: game?.grid.box.height + 'px', top: getGridY(i - 1) + 'px' }"
                class="bgYellow absolute w100p"></div>
            <div v-for="i in 16" :key="'y' + i"
                :style="{ width: game?.grid.box.width + 'px', left: getGridX(i - 1) + 'px' }"
                class="bgRed absolute h100p">
            </div>
        </div>

        <!-- field -->
        <div v-for="(box, index) in game?.fields" :key="'box' + index" class="absolute bg"
            :style="getFieldStyle(box.x, box.y, box.width, box.height)">
            {{ box.name }}
        </div>

        <!-- Show card -->
        <div class="flex absolute hide">
            <div class="bg" style="width:300px; height:100%;">
                <div class="relative">
                    <gameCard v-if="showCardId.id" :card="showCardId" folder="Gundam/cards/"></gameCard>
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
        <div v-for="card in cards" :key="'B' + card.index">
            <gameCard :id="'C' + card.index" :card="card" folder="Gundam/cards/" :shine="card.selectable"
                @mouseover="showCard" @click="selectCard">
            </gameCard>
        </div>

        <!-- Title -->
        <div id="divTitleParent" class="absolute bgWhite mask" style="top:80px; width: 100%; height:0px;">
            <div class="relative">
                <div class="text-center absolute w100p title" style="left:-000px; top:30px;">{{ title }}
                </div>
            </div>
        </div>

        <!-- width - height -->
        <div class="absolute" style="right:100px; bottom:25px">
            {{ $vuetify.breakpoint.width }} - {{ $vuetify.breakpoint.height }}
        </div>
    </div>

</template>

<script>
import helperAnimation from '../helpers/helperAnimation';
import gameManager from './gameManager';
import gundamManager from './gundamold/manager';
import gameCard from './card';

export default {
    name: 'game-vue',
    props: [],
    components: { gameCard },
    data: () => ({
        refreshG: 0,
        freeze: false,
        cards: [],
        showCardId: { id: '', position: { x: 0, y: 0 }, width: 300 },
        game: null,
        title: '',
    }),
    mounted() {
        window.addEventListener("resize", () => {
            this.refreshG++;
        });
        this.start();
    },
    methods: {
        showText(text) { alert(text); },
        showCard(card) { this.showCardId.id = card.id; },
        getGridX(i) { return this.game?.grid['x' + i]; },
        getGridY(i) { return this.game?.grid['y' + i]; },
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
        },
        start() {
            this.game = gameManager.createGame(gundamManager, this.$vuetify.breakpoint.width, this.$vuetify.breakpoint.height);
            this.refreshGame();
            this.showTitle('Draw phase');
        },
        showTitle(text) {
            this.title = text;
            const animationTime = 250;
            setTimeout(() => { helperAnimation.animate('divTitleParent', { height: 0 }, { height: 100 }, false, animationTime); }, 10);
            setTimeout(() => { helperAnimation.animate('divTitleParent', { height: 100 }, { height: 0 }, false, animationTime); }, 4.5 * (animationTime + 10));
        },
        refreshGame() {
            this.cards = this.game.cards;
            this.refreshG++;
        },
        nextTurn() {

        },
        selectCard() {
            if (this.freeze) return;
            //this.gameWorld = gameGundamManager.selectCard(card);
            this.refreshGame();
        }
    }
}
</script>