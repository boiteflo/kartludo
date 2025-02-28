<template>
    <div>
        <div class="flex">
            <div class="bg" style="width:300px;">
                <div>
                    <v-btn target="_blank" text class="bg m5px" @click="start">
                        <v-icon>mdi-arrow-right-thin</v-icon>
                        Start
                    </v-btn>
                </div>
                <v-btn target="_blank" text class="bg m5px" @click="start">
                    <v-icon>mdi-arrow-right-thin</v-icon>
                    End Turn
                </v-btn>

                <div class="relative">
                    <gameCard :card="showCardId" folder="Gundam/cards/" :width="300" :x="0" :y="0"></gameCard>
                </div>
            </div>

            <div class="relative bgWhite"
                :style="{ width: getGameWidth() + 'px', height: getGameHeight() + 'px', 'font-size': '12px', 'text-align': 'center' }">
                <!-- Player 1 -->
                <div class="absolute bg2"
                    :style="{ top: getP1DeckY() + 'px', left: getP1DeckX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    deck {{ gameWorld?.player1.deck.length }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1HandY() + 'px', left: getP1HandX() + 'px', width: getHandWidth() + 'px', height: getCardHeight() + 'px' }">
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1GraveY() + 'px', left: getP1GraveX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player1.grave.length }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1ResAY() + 'px', left: getP1ResAX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player1.resAString }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1ResBY() + 'px', left: getP1ResBX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player1.resBString }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1ShieldY() + 'px', left: getP1ShieldX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player1.shield.length }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1BaseY() + 'px', left: getP1BaseX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player1.base }}
                </div>
                <div class="absolute bg2"
                    :style="{ top: getP1FieldY() + 'px', left: getP1FieldX() + 'px', width: this.getFieldWidth() + 'px', height: getCardHeight() + 'px' }">
                </div>

                <!-- Player 2 -->
                <div class="absolute bg"
                    :style="{ top: getP2DeckY() + 'px', left: getP2DeckX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    deck {{ gameWorld?.player2.deck.length }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2HandY() + 'px', left: getP2HandX() + 'px', width: getHandWidth() + 'px', height: getCardHeight() + 'px' }">
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2GraveY() + 'px', left: getP2GraveX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player2.grave.length }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2ResAY() + 'px', left: getP2ResAX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player2.resAString }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2ResBY() + 'px', left: getP2ResBX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player2.resBString }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2ShieldY() + 'px', left: getP2ShieldX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player2.shield.length }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2BaseY() + 'px', left: getP2BaseX() + 'px', width: '50px', height: this.getBoxHeigth() + 'px' }">
                    {{ gameWorld?.player2.base }}
                </div>
                <div class="absolute bg"
                    :style="{ top: getP2FieldY() + 'px', left: getP2FieldX() + 'px', width: this.getFieldWidth() + 'px', height: getCardHeight() + 'px' }">

                </div>

                <div class="absolute bg2"
                    :style="{ display: 'none', top: getCenterY() + 'px', left: getCenterX() + 'px', width: this.getCardWidth() + 'px', height: this.getCardHeight() + 'px' }">
                    Center card
                </div>

                <div v-for="card in getCards()" :key="'C' + card.index">
                    <gameCard :id="'C' + card.index" :card="card" folder="Gundam/cards/" :width="getCardWidth()"
                        :x="card.position.x" :y="card.position.y" @mouseover="showCard" @click="show"
                        :class="{ borderYellow: card.selectable }">
                    </gameCard>
                </div>
            </div>
        </div>
        {{ test }}
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
        cardObj: null,
        pauseAnimation: false,
        test: '',
        showCardId: { id: 'EXBP-001' },
        gameWorld: null
    }),
    mounted() {
    },
    methods: {
        updateGame() {
            if (this.pauseAnimation || !this.gameWorld)
                return;

            var cardsToAnimate = this.gameWorld.cards.filter(x => x.to);
            if (cardsToAnimate.length < 1) return;

            this.pauseAnimation = false;
            console.log(JSON.stringify(cardsToAnimate));
            cardsToAnimate.forEach(card => {
                helperAnimation.animate('C' + card.index, card.position, card.to, false, 1000);
                card.position = card.to;
                card.to = null;
            });
        },
        show(card) { alert(card.id); },
        showCard(card) { this.showCardId = { id: card.id }; },
        start() {
            const p1Positions = this.getPlayerPosition("P1");
            const p2Positions = this.getPlayerPosition("P2");
            const cardSize = { width: this.getCardWidth(), height: this.getCardHeight() };
            this.gameWorld = gameGundamManager.createGame({ x: this.getCenterX(), y: this.getCenterY() }, cardSize, p1Positions, p2Positions);
            setInterval(() => { this.updateGame(); }, 500);
        },
        getCards() {
            let result = this.gameWorld?.cards.filter(x => x.show);
            return result;
        },
        getGameWidth() {
            var width = this.$vuetify.breakpoint.width - 300;
            var height = this.$vuetify.breakpoint.height;
            var desiredHeight = width * 9 / 16;
            var desiredWidth = (height * 16 / 9) - 300;
            return desiredHeight < height ? width : desiredWidth * .85;
        },
        getGameHeight() { return this.getGameWidth() * 9 / 16; },
        getCardWidth() { return -10 + this.getGameWidth() * 0.1; },
        getCardHeight() { return this.getCardWidth() * 150 / 107; },
        getBoxHeigth() { return (this.getCardHeight() - 10) / 2 },
        getPosX(index) { return index * this.getCardWidth(); },
        getPosY(index) { return index * this.getCardHeight(); },
        getPlayerPosition(index) {
            const prefix = 'get' + index;
            var incrementP2Hand = index == "P2" ? this.getHandWidth() - this.getCardWidth() : 0;
            var incrementP2Field = index == "P2" ? this.getFieldWidth() : 0;
            return {
                deck: { x: this[prefix + "DeckX"](), y: this[prefix + "DeckY"]() },
                grave: { x: this[prefix + "GraveX"](), y: this[prefix + "GraveY"]() },
                hand: { x: this[prefix + "HandX"]() + incrementP2Hand, y: this[prefix + "HandY"]() },
                base: { x: this[prefix + "BaseX"](), y: this[prefix + "BaseY"]() },
                shield: { x: this[prefix + "ShieldX"](), y: this[prefix + "ShieldY"]() },
                field: { x: this[prefix + "FieldX"]() + incrementP2Field, y: this[prefix + "FieldY"]() },
            };
        },

        getInfoLineX1() { return 10; },
        getInfoLineX2() { return 10 + 50 + 10; },
        getInfoLineX3() { return this.getGameWidth() - 25 - 50; },

        getInfoLineY1() { return this.getGameHeight() - 20 - this.getBoxHeigth(); },
        getInfoLineY2() { return this.getGameHeight() - 20 - this.getCardHeight(); },
        getInfoLineY3() { return this.getInfoLineY2() - 10 - this.getBoxHeigth(); },
        getInfoLineY4() { return this.getGameHeight() - 30 - 2 * this.getCardHeight(); },
        getInfoLineY5() { return this.getInfoLineY6() + 10 + this.getBoxHeigth(); },
        getInfoLineY6() { return this.getInfoLineY8() + 10 + this.getCardHeight(); },
        getInfoLineY7() { return this.getInfoLineY8() + 10 + this.getBoxHeigth(); },
        getInfoLineY8() { return 10; },

        getHandWidth() { return this.getGameWidth() - 25 - 20 - 50; },
        getFieldWidth() { return this.getInfoLineX3() - this.getInfoLineX2() - 10; },

        getCenterX() { return (this.getGameWidth() - this.getCardWidth()) / 2; },
        getCenterY() { return (this.getGameHeight() - this.getCardHeight()) / 2; },

        // Player1 Y
        getP1DeckX() { return this.getInfoLineX3(); },
        getP1GraveX() { return this.getInfoLineX3(); },
        getP1ResAX() { return this.getInfoLineX3(); },
        getP1ResBX() { return this.getInfoLineX3(); },
        getP1BaseX() { return this.getInfoLineX1(); },
        getP1ShieldX() { return this.getInfoLineX1(); },
        getP1HandX() { return this.getInfoLineX1(); },
        getP1FieldX() { return this.getInfoLineX2(); },

        getP1DeckY() { return this.getInfoLineY4(); },
        getP1GraveY() { return this.getInfoLineY3(); },
        getP1ResAY() { return this.getInfoLineY2(); },
        getP1ResBY() { return this.getInfoLineY1(); },
        getP1BaseY() { return this.getInfoLineY4(); },
        getP1ShieldY() { return this.getInfoLineY3(); },
        getP1HandY() { return this.getInfoLineY2(); },
        getP1FieldY() { return this.getInfoLineY4(); },

        // Player2
        getP2DeckX() { return this.getInfoLineX1(); },
        getP2GraveX() { return this.getInfoLineX1(); },
        getP2ResAX() { return this.getInfoLineX1(); },
        getP2ResBX() { return this.getInfoLineX1(); },
        getP2BaseX() { return this.getInfoLineX3(); },
        getP2ShieldX() { return this.getInfoLineX3(); },
        getP2HandX() { return this.getInfoLineX2(); },
        getP2FieldX() { return this.getInfoLineX2(); },

        getP2DeckY() { return this.getInfoLineY5(); },
        getP2GraveY() { return this.getInfoLineY6(); },
        getP2ResAY() { return this.getInfoLineY7(); },
        getP2ResBY() { return this.getInfoLineY8(); },
        getP2BaseY() { return this.getInfoLineY5(); },
        getP2ShieldY() { return this.getInfoLineY6(); },
        getP2HandY() { return this.getInfoLineY8(); },
        getP2FieldY() { return this.getInfoLineY6(); },
    }
}
</script>