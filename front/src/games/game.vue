<template>
    <div class="relative">
        <div class="flex">
            <div class="bg" style="width:300px; height:100%">
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
                <div class="mp5px" v-html="gameWorld?.logs"></div>
            </div>
        </div>
        <div id="divTitleParent" class="absolute bgWhite mask" style="top:80px; width: 100%; height:0px;">
            <div class="relative">
                <div id="divTitle" class="text-center absolute w100p title" style="left:-000px; top:30px;">{{title}}</div>
            </div>
        </div>
    </div>

</template>

<script>
import helperAnimation from '../helpers/helperAnimation';
import gameManager from './gameManager';
import gundamManager from './gundam/manager';

export default {
    name: 'game-vue',
    props: [],
    components: {},
    data: () => ({
        refreshG: 0,
        freeze: false,
        cards: [],
        showCardId: { id: '', position: { x: 0, y: 0 }, width: 300 },
        gameWorld: null,
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
        showCard(card) {
            this.showCardId.id = card.id;
        },
        start() {
            this.gameWorld = gameManager.createGame(gundamManager, this.$vuetify.breakpoint.width, this.$vuetify.breakpoint.height);
            this.refreshGame();
            this.showTitle('Draw phase');
        },
        showTitle(text){
            this.title = text;
            const animationTime = 500;
            helperAnimation.animate('divTitleParent', { height: 0 }, { height: 100 }, false, animationTime/2);
            setTimeout(() => { helperAnimation.animate('divTitleParent', { height: 100 }, { height: 0 }, false, animationTime/2);}, 2.5*(animationTime + 10));
        },
        refreshGame() {
            this.cards = this.gameWorld.cards.filter(x => x.show);
            this.refreshG++;
        },
        nextTurn() {

        }
    }
}
</script>