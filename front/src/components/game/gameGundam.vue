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
                    <gameCard :card="showCardId" folder="Gundam/cards/"></gameCard>
                </div>
            </div>

            <div :key="refreshG" class="relative bgWhite"
                :style="{ width: gamesize.gameWidth + 'px', height: gamesize.gameHeight + 'px', 'font-size': '12px', 'text-align': 'center' }">

                <!-- Player 1 -->
                <div class="absolute bg2 textVerticalCenter"
                    :style="{ top: getP1DeckY() + 'px', left: getP1DeckX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.boxHeight + 'px' }">
                    {{ gameWorld?.player1.deck.length }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1HandY() + 'px', left: getP1HandX() + 'px', width: gamesize.handWidth + 'px', height: gamesize.handHeight + 'px' }">
                </div>
                <div class="absolute bg2 textVerticalCenter"
                    :style="{ top: getP1GraveY() + 'px', left: getP1GraveX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.boxHeight + 'px' }">
                    {{ gameWorld?.player1.grave.length }}
                </div>
                <div class="absolute bg2 textVerticalCenter"
                    :style="{ top: getP1ResAY() + 'px', left: getP1ResAX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.boxHeight + 'px' }">
                    {{ gameWorld?.player1.resAString }}
                </div>
                <div class="absolute bg2 textVerticalCenter"
                    :style="{ top: getP1ResBY() + 'px', left: getP1ResBX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.boxHeight + 'px' }">
                    {{ gameWorld?.player1.resBString }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1BaseY() + 'px', left: getP1BaseX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.cardHeight + 'px' }">
                </div>
                <div class="absolute bg2 textVerticalCenter"
                    :style="{ top: getP1ShieldY() + 'px', left: getP1ShieldX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.miniboxHeight + 'px' }">
                    {{ gameWorld?.player1.shield.length }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1FieldY() + 'px', left: getP1FieldX() + 'px', width: gamesize.fieldWidth + 'px', height: gamesize.fieldHeight + 'px' }">
                </div>

                <!-- Player 2 -->
                <div class="absolute bg textVerticalCenter"
                    :style="{ top: getP2DeckY() + 'px', left: getP2DeckX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.boxHeight + 'px' }">
                    {{ gameWorld?.player2.deck.length }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2HandY() + 'px', left: getP2HandX() + 'px', width: gamesize.handWidth + 'px', height: gamesize.handHeight + 'px' }">
                </div>
                <div class="absolute bg textVerticalCenter"
                    :style="{ top: getP2GraveY() + 'px', left: getP2GraveX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.boxHeight + 'px' }">
                    {{ gameWorld?.player2.grave.length }}
                </div>
                <div class="absolute bg textVerticalCenter"
                    :style="{ top: getP2ResAY() + 'px', left: getP2ResAX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.boxHeight + 'px' }">
                    {{ gameWorld?.player2.resAString }}
                </div>
                <div class="absolute bg textVerticalCenter"
                    :style="{ top: getP2ResBY() + 'px', left: getP2ResBX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.boxHeight + 'px' }">
                    {{ gameWorld?.player2.resBString }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2BaseY() + 'px', left: getP2BaseX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.cardHeight + 'px' }">
                </div>
                <div class="absolute bg textVerticalCenter"
                    :style="{ top: getP2ShieldY() + 'px', left: getP2ShieldX() + 'px', width: gamesize.boxWidth + 'px', height: gamesize.miniboxHeight + 'px' }">
                    {{ gameWorld?.player2.shield.length }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2FieldY() + 'px', left: getP2FieldX() + 'px', width: gamesize.fieldWidth + 'px', height: gamesize.fieldHeight + 'px' }">

                </div>

                <div class="absolute bgWhite"
                    :style="{ display: 'none', top: gamesize.centerY + 'px', left: gamesize.centerX + 'px', width: gamesize.cardWidth + 'px', height: gamesize.handHeight + 'px' }">
                    Center card
                    {{ cards.length }}
                </div>

                <div v-for="card in cards" :key="'B' + card.index">

                    <gameCard :id="'C' + card.index" :card="card" folder="Gundam/cards/" :shine="card.selectable"
                        @mouseover="showCard" @click="selectCard">
                    </gameCard>
                </div>
            </div>
        </div>
        <div v-if="gameWorld?.popup" class="flex-center" style="z-index:3; width:100%; height: 450px; position:fixed; top:150px;">
            <div style="background-color: #000000E0; width:90%; height:100%;">
                <h2 class="text-center">{{ gameWorld.popup.text }}</h2>
                <div class="flex-center">
                    <span v-for="(choice, index) in gameWorld.popup.choices" :key="'Choice' + index">
                        <v-btn v-if="choice.text" class="mp5px"
                            :style="{ width: gamesize.cardWidth + 'px', height: gamesize.cardHeight + 'px' }"
                            @click="selectChoice(choice)">
                            {{ choice.text }}
                        </v-btn>
                        <gameCard v-if="choice.id" :card="choice" folder="Gundam/cards/" :shine="true"
                            @mouseover="showCard" @click="selectChoiceCard(choice)">
                        </gameCard>
                    </span>
                </div>
            </div>
        </div>
        <br><br>test : {{ test }} {{ gameWorld?.player1.hand.length }}
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
        showCardId: { id: 'EXBP-001', position: { x: 0, y: 0 }, width: 300 },
        gameWorld: null,
        cardsToAnimate: null,
        gamesize: {}
    }),
    mounted() {
        this.refreshGameSize();
        window.addEventListener("resize", this.refreshGameSize);
    },
    methods: {
        showText(text) { alert(text); },
        showCard(card) {
            this.showCardId.id = card.id;
        },
        start() {
            const p1Positions = this.getPlayerPosition("P1");
            const p2Positions = this.getPlayerPosition("P2");
            const cardSize = { width: this.gamesize.cardWidth, height: this.gamesize.cardHeight };
            const boxSize = { width: this.gamesize.boxWidth, height: this.gamesize.boxHeight, heightCard: this.gamesize.cardHeight };
            this.gameWorld = gameGundamManager.createGame({ x: this.gamesize.centerX, y: this.gamesize.centerY }, cardSize, boxSize, p1Positions, p2Positions, this.gamesize.handWidth, this.gamesize.fieldWidth);
            this.test = 'ok';
            this.refreshGame();
        },
        nextTurn() {
            if (this.freeze) return;
            this.gameWorld = gameGundamManager.nextTurn();
            this.refreshGame();
        },
        refreshGame(animate = true) {
            this.cards = this.gameWorld.cards.filter(x => x.show);
            this.refreshG++;
            if (animate)
                setTimeout(() => { this.beginAnimation(); }, 1);
        },
        beginAnimation() {
            const cardsToAnimate = this.gameWorld.cards.filter(x => x.show && x.to);
            if (cardsToAnimate.length < 1) return;

            this.freeze = true;
            const animationTime = 500;
            const animations = cardsToAnimate.map(card => { return { id: 'C' + card.index, from: card.position, to: card.to, isIncrement: false }; });
            helperAnimation.animateMultiple(animations, animationTime);

            setTimeout(() => { this.endAnimation(); }, animationTime + 10);
        },
        endAnimation() {
            this.gameWorld = gameGundamManager.endAnimation();
            this.freeze = false;
            this.refreshGame(false);
        },
        selectCard(card) {
            if (this.freeze) return;
            this.gameWorld = gameGundamManager.selectCard(card);
            this.refreshGame();
        },
        selectChoice(choice) {
            this.gameWorld = gameGundamManager.selectChoiceType(choice);
            this.refreshGame();
        },
        selectChoiceCard(choice){
            this.gameWorld = gameGundamManager.selectChoiceCard(choice);
            this.refreshGame();
        },
        refreshGameSize() {
            const size = {};
            const width = this.$vuetify.breakpoint.width - 300;
            const height = this.$vuetify.breakpoint.height - 64;
            const desiredHeight = width * 9 / 16;
            const desiredWidth = (height * 16 / 9);
            size.gameWidth = desiredHeight < height ? width : desiredWidth;
            size.gameHeight = size.gameWidth * 9 / 16;

            size.fieldHeight = (size.gameHeight - 4 * 7) / 3;
            size.handHeight = size.fieldHeight / 2;
            size.boxHeight = (size.handHeight - 5) / 2;
            size.cardHeight = size.fieldHeight * 0.75;
            size.cardWidth = size.cardHeight * 107 / 150;
            size.boxWidth = size.cardWidth;
            size.handWidth = size.gameWidth - 10 - 10 - size.boxWidth;
            size.miniboxHeight = size.fieldHeight - size.cardHeight;

            size.centerX = (size.gameWidth - size.boxWidth) / 2;
            size.centerY = (size.gameHeight - size.cardHeight) / 2;
            size.infoLineX1 = 5;
            size.infoLineX2 = 5 + size.boxWidth + 5;
            size.infoLineX3 = size.gameWidth - 10 - size.boxWidth;

            size.infoLineY01 = 7;
            size.infoLineY02 = size.infoLineY01 + 5 + size.boxHeight;
            size.infoLineY03 = size.infoLineY02 + 5 + size.boxHeight;
            size.infoLineY04 = size.infoLineY03 + 5 + size.boxHeight;
            size.infoLineY05 = size.infoLineY03 + 5 + size.fieldHeight;
            size.infoLineY07 = size.infoLineY05 + 5 + size.fieldHeight;
            size.infoLineY06 = size.infoLineY07 - 5 - size.boxHeight;
            size.infoLineY08 = size.infoLineY07 + 5 + size.boxHeight;
            size.infoLineY04bis = size.infoLineY05 - 5 - size.cardHeight;
            size.infoLineY06bis = size.infoLineY05 + size.cardHeight;

            size.fieldWidth = size.infoLineX3 - size.infoLineX2 - 10;
            this.gamesize = size;
            this.refreshG++;
        },
        getPosX(index) { return index * this.gamesize.cardWidth; },
        getPosY(index) { return index * this.gamesize.cardHeight; },
        getPlayerPosition(index) {
            const prefix = 'get' + index;
            return {
                deck: { x: this[prefix + "DeckX"](), y: this[prefix + "DeckY"](), rotation: 0 },
                grave: { x: this[prefix + "GraveX"](), y: this[prefix + "GraveY"](), rotation: 0 },
                hand: { x: this[prefix + "HandX"](), y: this[prefix + "HandY"](), rotation: 0 },
                base: { x: this[prefix + "BaseX"](), y: this[prefix + "BaseY"](), rotation: 0 },
                shield: { x: this[prefix + "ShieldX"](), y: this[prefix + "ShieldY"](), rotation: 0 },
                field: { x: this[prefix + "FieldX"](), y: this[prefix + "FieldY"](), rotation: 0 },
                res: { x: this[prefix + "ResAX"](), y: this[prefix + "ResAY"](), rotation: 0 },
            };
        },

        // Player1
        getP1DeckX() { return this.gamesize.infoLineX3; },
        getP1GraveX() { return this.gamesize.infoLineX3; },
        getP1ResAX() { return this.gamesize.infoLineX3; },
        getP1ResBX() { return this.gamesize.infoLineX3; },
        getP1BaseX() { return this.gamesize.infoLineX1; },
        getP1ShieldX() { return this.gamesize.infoLineX1; },
        getP1HandX() { return this.gamesize.infoLineX1; },
        getP1FieldX() { return this.gamesize.infoLineX2; },

        getP1DeckY() { return this.gamesize.infoLineY06 - 10 - this.gamesize.boxHeight; },
        getP1GraveY() { return this.gamesize.infoLineY06; },
        getP1ResAY() { return this.gamesize.infoLineY07; },
        getP1ResBY() { return this.gamesize.infoLineY08; },
        getP1BaseY() { return this.gamesize.infoLineY05; },
        getP1ShieldY() { return this.gamesize.infoLineY06bis; },
        getP1HandY() { return this.gamesize.infoLineY07; },
        getP1FieldY() { return this.gamesize.infoLineY05; },

        // Player2
        getP2DeckX() { return this.gamesize.infoLineX1; },
        getP2GraveX() { return this.gamesize.infoLineX1; },
        getP2ResAX() { return this.gamesize.infoLineX1; },
        getP2ResBX() { return this.gamesize.infoLineX1; },
        getP2BaseX() { return this.gamesize.infoLineX3; },
        getP2ShieldX() { return this.gamesize.infoLineX3; },
        getP2HandX() { return this.gamesize.infoLineX2; },
        getP2FieldX() { return this.gamesize.infoLineX2; },

        getP2DeckY() { return this.gamesize.infoLineY04; },
        getP2GraveY() { return this.gamesize.infoLineY03; },
        getP2ResAY() { return this.gamesize.infoLineY01; },
        getP2ResBY() { return this.gamesize.infoLineY02; },
        getP2BaseY() { return this.gamesize.infoLineY04bis; },
        getP2ShieldY() { return this.gamesize.infoLineY03; },
        getP2HandY() { return this.gamesize.infoLineY01; },
        getP2FieldY() { return this.gamesize.infoLineY03; },
    }
}
</script>