<template>
    <div>
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
                <div class="mp5px" v-html="gameWorld.logs"></div>
            </div>

            <div v-if="gameWorld" :key="refreshG" class="relative bgWhite" :style="{
                width: gameWorld?.size.gameWidth + 'px',
                height: gameWorld?.size.gameHeight + 'px',
                'font-size': '12px',
                'text-align': 'center'
            }">

                <!-- Player 1 -->
                <div class="absolute bg2 textVerticalCenter" :style="{
                    top: gameWorld?.player1.position.deck.y + 'px',
                    left: gameWorld?.player1.position.deck.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.boxHeight + 'px'
                }">
                    {{ gameWorld?.player1.deck.length }}
                </div>
                <div class="absolute bg2" :style="{
                    top: gameWorld?.player1.position.hand.y + 'px',
                    left: gameWorld?.player1.position.hand.x + 'px',
                    width: gameWorld?.size.handWidth + 'px',
                    height: gameWorld?.size.handHeight + 'px'
                }">
                </div>
                <div class="absolute bg2 textVerticalCenter" :style="{
                    top: gameWorld?.player1.position.grave.y + 'px',
                    left: gameWorld?.player1.position.grave.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.boxHeight + 'px'
                }">
                    {{ gameWorld?.player1.grave.length }}
                </div>
                <div class="absolute bg2 textVerticalCenter" :style="{
                    top: gameWorld?.player1.position.res.y + 'px',
                    left: gameWorld?.player1.position.res.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.boxHeight * 2 + 5 + 'px'
                }">
                    {{ gameWorld?.player1.resAString }}
                </div>
                <div class="absolute bg2" :style="{
                    top: gameWorld?.player1.position.base.y + 'px',
                    left: gameWorld?.player1.position.base.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.cardHeight + 'px'
                }">
                </div>
                <div v-if="gameWorld?.popup?.attackShield" class="absolute" @click="selectChoice({})" :style="{
                    top: gameWorld?.player1.position.base.y + 'px',
                    left: gameWorld?.player1.position.base.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.cardHeight + 'px',
                    'background-color': '#FFFF00'
                }"> Shield
                </div>
                <div class="absolute bg2 textVerticalCenter" :style="{
                    top: gameWorld?.player1.position.shield.y + 'px',
                    left: gameWorld?.player1.position.shield.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.miniboxHeight + 'px'
                }">
                    {{ gameWorld?.player1.shield.length }}
                </div>
                <div class="absolute bg2" :style="{
                    top: gameWorld?.player1.position.field.y + 'px',
                    left: gameWorld?.player1.position.field.x + 'px',
                    width: gameWorld?.size.fieldWidth + 'px',
                    height: gameWorld?.size.fieldHeight + 'px'
                }">
                </div>

                <!-- Player 2 -->
                <div class="absolute bg textVerticalCenter" :style="{
                    top: gameWorld?.player2.position.deck.y + 'px',
                    left: gameWorld?.player2.position.deck.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.boxHeight + 'px'
                }">
                    {{ gameWorld?.player2.deck.length }}
                </div>
                <div class="absolute bg" :style="{
                    top: gameWorld?.player2.position.hand.y + 'px',
                    left: gameWorld?.player2.position.hand.x + 'px',
                    width: gameWorld?.size.handWidth + 'px',
                    height: gameWorld?.size.handHeight + 'px'
                }">
                </div>
                <div class="absolute bg textVerticalCenter" :style="{
                    top: gameWorld?.player2.position.grave.y + 'px',
                    left: gameWorld?.player2.position.grave.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.boxHeight + 'px'
                }">
                    {{ gameWorld?.player2.grave.length }}
                </div>
                <div class="absolute bg textVerticalCenter" :style="{
                    top: gameWorld?.player2.position.res.y + 'px',
                    left: gameWorld?.player2.position.res.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.boxHeight * 2 + 5 + 'px'
                }">
                    {{ gameWorld?.player2.resAString }}
                </div>
                <div class="absolute bg" :style="{
                    top: gameWorld?.player2.position.base.y + 'px',
                    left: gameWorld?.player2.position.base.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.cardHeight + 'px'
                }">
                </div>
                <div v-if="gameWorld?.popup?.attackShield" class="absolute" @click="selectChoice({})" :style="{
                    top: gameWorld?.player2.position.base.y + 'px',
                    left: gameWorld?.player2.position.base.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.cardHeight + 'px',
                    'background-color': '#FFFF00'
                }"> Shield
                </div>

                <div class="absolute bg textVerticalCenter" :style="{
                    top: gameWorld?.player2.position.shield.y + 'px',
                    left: gameWorld?.player2.position.shield.x + 'px',
                    width: gameWorld?.size.boxWidth + 'px',
                    height: gameWorld?.size.miniboxHeight + 'px'
                }">
                    {{ gameWorld?.player2.shield.length }}
                </div>
                <div class="absolute bg" :style="{
                    top: gameWorld?.player2.position.field.y + 'px',
                    left: gameWorld?.player2.position.field.x + 'px',
                    width: gameWorld?.size.fieldWidth + 'px',
                    height: gameWorld?.size.fieldHeight + 'px'
                }">
                </div>

                <div class="absolute bgWhite" :style="{
                    display: 'none',
                    top: gameWorld.size.centerY + 'px',
                    left: gameWorld.size.centerX + 'px',
                    width: gameWorld?.size.cardWidth + 'px',
                    height: gameWorld?.size.handHeight + 'px'
                }">
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

        <div v-if="gameWorld?.popup" class="textVerticalCenter"
            style="z-index:6; width:100%; height: 64px; position:fixed; top:0px; left:120px;">

            <div class="flex-wrap" style="background-color: #FFFF00E0; width:80%; height:100%;">
                <h3 class="text-center m10px">{{ gameWorld.popup.text }}</h3>
                <span v-for="(choice, index) in gameWorld.popup.choices" :key="'Choice' + index">
                    <v-btn v-if="choice.text" class="m10px" @click="selectChoice(choice)">
                        {{ choice.text }}
                    </v-btn>
                </span>
                <gameCard v-for="(card,index) in gameWorld.popup.cards" :key="'B' + index" :card="card" folder="Gundam/cards/" :shine="true"
                    @mouseover="showCard" @click="selectCard">
                </gameCard>
            </div>
        </div>
        <br><br><br>{{ gameWorld.player2.shield[0].name }}
    </div>

</template>

<script>
import helperAnimation from '../../helpers/helperAnimation';
import gameGundamManager from './manager';
import gameCard from './gameCard';

export default {
    name: 'game-gundam',
    props: [],
    components: { gameCard },
    data: () => ({
        refreshG: 0,
        freeze: false,
        cards: [],
        showCardId: { id: '', position: { x: 0, y: 0 }, width: 300 },
        gameWorld: null
    }),
    mounted() {
        window.addEventListener("resize", () => {
            //this.gameWorld = this.gameGundamManager.refreshGameSize(this.$vuetify.breakpoint.width, this.$vuetify.breakpoint.height);
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
            this.gameWorld = gameGundamManager.createGame(this.$vuetify.breakpoint.width, this.$vuetify.breakpoint.height);
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
        nextTurn() {
            if (this.freeze) return;
            this.gameWorld = gameGundamManager.nextTurn();
            this.refreshGame();
        },
        selectCard(card) {
            if (this.freeze) return;
            this.gameWorld = gameGundamManager.selectCard(card);
            this.refreshGame();
        },
        selectChoice(choice) {
            this.gameWorld = gameGundamManager.selectChoiceType(choice);
            this.refreshGame();
        }
    }
}
</script>