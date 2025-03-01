<template>
    <div>
        <div class="flex">
            <div class="bg" style="width:300px;">
                <v-btn target="_blank" text class="bg m5px" @click="start">
                    <v-icon>mdi-arrow-right-thin</v-icon>
                    Start
                </v-btn>
                <v-btn target="_blank" text class="bg m5px" @click="nextTurn">
                    <v-icon>mdi-arrow-right-thin</v-icon>
                    End Turn
                </v-btn>

                <div class="relative">
                    <gameCard :card="showCardId" folder="Gundam/cards/" :width="300" :x="0" :y="0"></gameCard>
                </div>
            </div>

            <div :key="refreshG" class="relative bgWhite"
                :style="{ width: gamesize.gameWidth + 'px', height: gamesize.gameHeight + 'px', 'font-size': '12px', 'text-align': 'center' }">

                <!-- Player 1 -->
                <div class="absolute bg2"
                    :style="{ top: getP1DeckY() + 'px', left: getP1DeckX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player1.deck.length }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1HandY() + 'px', left: getP1HandX() + 'px', width: gamesize.handWidth + 'px', height: gamesize.cardHeight + 'px' }">
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1GraveY() + 'px', left: getP1GraveX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player1.grave.length }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1ResAY() + 'px', left: getP1ResAX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player1.resAString }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1ResBY() + 'px', left: getP1ResBX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player1.resBString }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1ShieldY() + 'px', left: getP1ShieldX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player1.shield.length }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1BaseY() + 'px', left: getP1BaseX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1FieldY() + 'px', left: getP1FieldX() + 'px', width: gamesize.fieldWidth + 'px', height: gamesize.cardHeight + 'px' }">
                </div>

                <!-- Player 2 -->
                <div class="absolute bg"
                    :style="{ top: getP2DeckY() + 'px', left: getP2DeckX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player2.deck.length }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2HandY() + 'px', left: getP2HandX() + 'px', width: gamesize.handWidth + 'px', height: gamesize.cardHeight + 'px' }">
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2GraveY() + 'px', left: getP2GraveX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player2.grave.length }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2ResAY() + 'px', left: getP2ResAX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player2.resAString }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2ResBY() + 'px', left: getP2ResBX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player2.resBString }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2ShieldY() + 'px', left: getP2ShieldX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                    {{ gameWorld?.player2.shield.length }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2BaseY() + 'px', left: getP2BaseX() + 'px', width: '50px', height: gamesize.boxHeigth + 'px' }">
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2FieldY() + 'px', left: getP2FieldX() + 'px', width: gamesize.fieldWidth + 'px', height: gamesize.cardHeight + 'px' }">

                </div>

                <div class="absolute bgWhite"
                    :style="{ display: 'none', top: gamesize.centerY + 'px', left: gamesize.centerX + 'px', width: gamesize.cardWidth + 'px', height: gamesize.cardHeight + 'px' }">
                    Center card
                    {{ cards.length }}
                </div>

                <div v-for="card in cards" :key="'B' + card.index">

                    <gameCard :id="'C' + card.index" :card="card" folder="Gundam/cards/" :width="card.width"
                        :x="card.position.x" :y="card.position.y" :shine="card.selectable"
                        @mouseover="showCard" @click="selectCard">
                    </gameCard> 
                </div>
            </div>
        </div>
        <br><br>{{ test}} 
    </div>

</template>

<script>
import helperAnimation from '../../helpers/helperAnimation';
import gameGundamManager from './gameGundamManager';
import gameCard from './gameCard';

export default {
    name: 'game-gundam',
    props: ['img'],
    components: { gameCard },
    data: () => ({
        refreshG: 0,
        cardObj: null,
        freeze: false,
        test: '',
        cards: [],
        showCardId: { id: 'EXBP-001' },
        gameWorld: null,
        cardsToAnimate: null,
        gamesize: {
            gameWidth: 0, gameHeight: 0,
            cardWidth: 0, cardHeight: 0,
            boxHeigth: 0,
            centerX: 0, centerY: 0,
            infoLineX1: 0, infoLineX2: 0, infoLineX3: 0,
            infoLineY1: 0, infoLineY2: 0, infoLineY3: 0, infoLineY4: 0,
            infoLineY5: 0, infoLineY6: 0, infoLineY7: 0, infoLineY8: 0,
            handWidth: 0, fieldWidth: 0
        }
    }),
    mounted() {
        this.refreshGameSize();
        window.addEventListener("resize", this.refreshGameSize);
    },
    methods: {
        showText(text) { alert(text); },
        showCard(card) {
            this.showCardId = { id: card.id };
        },
        start() {
            const p1Positions = this.getPlayerPosition("P1");
            const p2Positions = this.getPlayerPosition("P2");
            const cardSize = { width: this.gamesize.cardWidth, height: this.gamesize.cardHeight };
            const boxSize = { width: 50, height: this.boxHeigth, heightCard : this.boxHeigth * 107 / 150 };
            this.gameWorld = gameGundamManager.createGame({ x: this.gamesize.centerX, y: this.gamesize.centerY }, cardSize, boxSize, p1Positions, p2Positions);
            this.test = 'coucou';
            this.refreshGame();
        },
        nextTurn() {
            if (this.freeze) return;
            this.gameWorld = gameGundamManager.nextTurn();
            this.refreshGame();
        },
        refreshGame() {
            this.cards = this.gameWorld.cards.filter(x => x.show);
            this.refreshG++;
            setTimeout(() => { this.beginAnimation(); }, 1);
        },
        beginAnimation() {
            const cardsToAnimate = this.gameWorld.cards.filter(x => x.show && x.to);
            if (cardsToAnimate.length < 1) return;

            this.freeze = true;
            const animationTime = 500;
            cardsToAnimate.forEach(card => helperAnimation.animate('C' + card.index, card.position, card.to, false, animationTime));

            setTimeout(() => { this.endAnimation(); }, animationTime + 10);
        },
        endAnimation() {
            gameGundamManager.endAnimation();
            this.freeze = false;
        },
        selectCard(card){
            if (this.freeze) return;
            this.gameWorld = gameGundamManager.selectCard(card);
            this.refreshGame();
        },
        refreshGameSize() {
            const size = {};
            const width = this.$vuetify.breakpoint.width - 300;
            const height = this.$vuetify.breakpoint.height;
            const desiredHeight = width * 9 / 16;
            const desiredWidth = (height * 16 / 9) - 300;
            size.gameWidth = desiredHeight < height ? width : desiredWidth * .85;
            size.gameHeight = size.gameWidth * 9 / 16;
            size.cardWidth = -10 + size.gameWidth * 0.1;
            size.cardHeight = size.cardWidth * 150 / 107;
            size.boxHeigth = (size.cardHeight - 10) / 2;
            size.centerX = (size.gameWidth - size.cardWidth) / 2;
            size.centerY = (size.gameHeight - size.cardHeight) / 2;
            size.infoLineX1 = 10;
            size.infoLineX2 = 10 + 50 + 10;
            size.infoLineX3 = size.gameWidth - 25 - 50;
            size.infoLineY1 = size.gameHeight - 20 - size.boxHeigth;
            size.infoLineY2 = size.gameHeight - 20 - size.cardHeight;
            size.infoLineY3 = size.infoLineY2 - 10 - size.boxHeigth;
            size.infoLineY4 = size.gameHeight - 30 - 2 * size.cardHeight;
            size.infoLineY8 = 10;
            size.infoLineY6 = size.infoLineY8 + 10 + size.cardHeight;
            size.infoLineY7 = size.infoLineY8 + 10 + size.boxHeigth;
            size.infoLineY5 = size.infoLineY6 + 10 + size.boxHeigth;
            size.handWidth = size.gameWidth - 25 - 20 - 50;
            size.fieldWidth = size.infoLineX3 - size.infoLineX2 - 10;
            this.gamesize = size;
            this.refreshG++;
        },
        getPosX(index) { return index * this.gamesize.cardWidth; },
        getPosY(index) { return index * this.gamesize.cardHeight; },
        getPlayerPosition(index) {
            const prefix = 'get' + index;
            const incrementP2Hand = index == "P2" ? this.gamesize.handWidth - this.gamesize.cardWidth : 0;
            const incrementP2Field = index == "P2" ? this.gamesize.fieldWidth : 0;
            return {
                deck: { x: this[prefix + "DeckX"](), y: this[prefix + "DeckY"](), rotation:0 },
                grave: { x: this[prefix + "GraveX"](), y: this[prefix + "GraveY"](), rotation:0 },
                hand: { x: this[prefix + "HandX"]() + incrementP2Hand, y: this[prefix + "HandY"](), rotation:0 },
                base: { x: this[prefix + "BaseX"](), y: this[prefix + "BaseY"](), rotation:0 },
                shield: { x: this[prefix + "ShieldX"](), y: this[prefix + "ShieldY"](), rotation:0 },
                field: { x: this[prefix + "FieldX"]() + incrementP2Field, y: this[prefix + "FieldY"](), rotation:0 },
                res: { x: this[prefix + "ResAX"](), y: this[prefix + "ResAY"](), rotation:0 },
            };
        },

        // Player1 Y
        getP1DeckX() { return this.gamesize.infoLineX3; },
        getP1GraveX() { return this.gamesize.infoLineX3; },
        getP1ResAX() { return this.gamesize.infoLineX3; },
        getP1ResBX() { return this.gamesize.infoLineX3; },
        getP1BaseX() { return this.gamesize.infoLineX1; },
        getP1ShieldX() { return this.gamesize.infoLineX1; },
        getP1HandX() { return this.gamesize.infoLineX1; },
        getP1FieldX() { return this.gamesize.infoLineX2; },

        getP1DeckY() { return this.gamesize.infoLineY4; },
        getP1GraveY() { return this.gamesize.infoLineY3; },
        getP1ResAY() { return this.gamesize.infoLineY2; },
        getP1ResBY() { return this.gamesize.infoLineY1; },
        getP1BaseY() { return this.gamesize.infoLineY4; },
        getP1ShieldY() { return this.gamesize.infoLineY3; },
        getP1HandY() { return this.gamesize.infoLineY2; },
        getP1FieldY() { return this.gamesize.infoLineY4; },

        // Player2
        getP2DeckX() { return this.gamesize.infoLineX1; },
        getP2GraveX() { return this.gamesize.infoLineX1; },
        getP2ResAX() { return this.gamesize.infoLineX1; },
        getP2ResBX() { return this.gamesize.infoLineX1; },
        getP2BaseX() { return this.gamesize.infoLineX3; },
        getP2ShieldX() { return this.gamesize.infoLineX3; },
        getP2HandX() { return this.gamesize.infoLineX2; },
        getP2FieldX() { return this.gamesize.infoLineX2; },

        getP2DeckY() { return this.gamesize.infoLineY5; },
        getP2GraveY() { return this.gamesize.infoLineY6; },
        getP2ResAY() { return this.gamesize.infoLineY8; },
        getP2ResBY() { return this.gamesize.infoLineY7; },
        getP2BaseY() { return this.gamesize.infoLineY5; },
        getP2ShieldY() { return this.gamesize.infoLineY6; },
        getP2HandY() { return this.gamesize.infoLineY8; },
        getP2FieldY() { return this.gamesize.infoLineY6; },
    }
}
</script>