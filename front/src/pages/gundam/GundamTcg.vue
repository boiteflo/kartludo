<template>
    <div class="bg2 h100p w100p">
        <menu-bar-gundam></menu-bar-gundam>

        <div class="w100p">
            <img v-if="isHorizontal"
                :class="{ w100p: 1, h100p: 1, absolute: 1, 'image-cover': 1, 'blur-box': 1, 'blurred': step !== 'menu' }"
                :src="require('@/assets/Gundam/wallpaper.webp')" />

            <img v-else
                :class="{ w100p: 1, h100p: 1, absolute: 1, 'image-cover': 1, 'blur-box': 1, 'blurred': step !== 'menu' }"
                :src="require('@/assets/Gundam/wallpaper2.webp')" />

            <div v-if="step === 'menu'" :class="{ absolute: 1, h100p: isHorizontal, colorBlack: 1, 'text-center': 1 }"
                :style="{ top: '0px', left: '10%', width: isHorizontal ? '300px' : '80%', 'background-color': isHorizontal ? 'rgba(255,255,255,0.5)' : 'transparent' }">
                <div style="height:64px"></div>
                <div class="fontSize2em bold colorWhite"
                    :style="{ color: 'black', 'margin-top': '50px', 'margin-bottom': '30px' }">
                    GUNDAM TCG
                </div>
                <v-btn class="w100p" hide-details
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    TUTORIEL
                </v-btn>
                <v-btn class="w100p" hide-details @click="decklists"
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    DECKLISTS
                </v-btn>
                <v-btn class="w100p" hide-details @click="arcade"
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    ARCADE
                </v-btn>
                <v-btn class="w100p" hide-details
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    CAMPAIGN
                </v-btn>
                <v-btn class="w100p" hide-details @click="duel"
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    DUEL
                </v-btn>
                <div class="w100p textVerticalCenter"
                    style="margin-top:20px; height:60px; background-color: rgba(200,200,200,0.75);">
                    By FlorentOutan - 2025
                </div>
            </div>

            <div v-else class="relative">
                <div style="position:fixed; left:275px; top:15px; z-index:10" class="flex">
                    <v-btn @click="back"><v-icon class="colorBlack">mdi-arrow-left</v-icon></v-btn>
                    <div class="textVerticalCenter fontSize150em bold" style="margin-left:25px">{{ title }}</div>
                </div>

                <div v-if="step === 'decklist'">
                    <!-- DeckList Show-->
                    <deck-list v-if="decklistShow" :decklist="decklistShow" :cardlist="cardList" folder="Gundam/cards/"
                        style="top:50px" @cardclick="showCardDeckList" @cancel="back" @validate="selectDeckList">
                    </deck-list>
                </div>

                <div v-if="step === 'decklists'">
                    {{ deckListAdd }}
                    <!-- DeckLists -->
                    <div class="flex flex-wrap flex-space-around fontSize150em">
                        <deck v-for="(deck, index) in deckList" :key="'Deck' + index" :deck="deck"
                            folder="Gundam/cards/" @click="selectDeckList(deck)" style="width: 25%">
                        </deck>
                    </div>
                </div>

                <div v-if="step === 'fight'">
                    <div class="textVerticalCenter bold" style="font-size: 3em;">
                        {{ message }}
                    </div>
                    <deck class="centerDiv" :deck="opponent" folder="Gundam/cards/" style="width: 25%">
                    </deck>
                    <div style="height:30px"></div>
                    <div class="flex flex-space-around" style="width:50%; margin-left:25%">
                        <v-btn class="mp5px" @click="back">Give up</v-btn>
                        <v-btn v-if="!task.fight && task.isVictory" class="mp5px" @click="continueProcess">Next
                            Battle</v-btn>
                        <v-btn v-if="task.fight" class="mp5px bg2" @click="continueProcess">Battle</v-btn>
                    </div>
                </div>

                <div v-if="step === 'message'">
                    <div class="textVerticalCenter bold" style="font-size: 8em;">
                        {{ message }}
                    </div>
                    <v-btn class="mp5px centerDiv" @click="back">Menu</v-btn>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import helperCookie from '../../helpers/helperCookie';
import helperParamUrl from '../../helpers/helperParamUrl';
import menuBarGundam from '../../components/menuBarGundam';
import cards from '../../data/gundamCards.json';
import deckList from '../../games/deckList';
import deck from '../../games/deck';

export default {
    name: 'pageGundamTcgFight',
    components: { menuBarGundam, deck, deckList },
    data: () => ({
        step: 'menu',
        task: null,
        title: '',
        message: '',
        opponents: null,
        opponent: null,
        isHorizontal: true,
        decklistShow: null,
        cardList: null,
        deckList: null,
        deckListAdd: false
    }),
    mounted() {
        this.isHorizontal = this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height;
        this.cardList = cards.cards;
        this.deckList = cards.decklist;
        this.deckList = cards.decklist;

        this.playerInfo = helperCookie.getLocalStorage('playerInfo');
        if (!this.playerInfo) {
            helperCookie.setLocalStorage('playerInfo', { date: new Date() })
        }

        const params = helperParamUrl.getParams();
        if (params.continue == '1')
            this.continueGame();
    },
    methods: {
        setStep(key, title) {
            this.step = key;
            this.title = title;
        },
        continueProcess() {
            if (this.task)
                this[this.task.id]();
        },
        back() {
            if (this.task.back)
                this[this.task.id](true);
            else{
                this.setStep('menu');
                this.task = null;
                window.location.href = `/gundamTcg`;
            }
        },
        decklists(back) {
            this.deckListAdd = true;
            if (!this.task || back) {
                this.decklistShow = null;
                this.task = { id: 'decklists' };
            }
            let step = 'decklists';
            let title = 'Deck Lists';

            if (this.task.decklist) {
                step = "decklist";
                title = 'Set Decklist';
                this.task.back = true;
                this.decklistShow = this.task.decklist;
            }

            return this.setStep(step, title);
        },
        continueGame() {
            this.task = { id: 'arcade', 'show': true, decklistPlayer1: true }
            this.task.opponents = helperCookie.getCookieString('opponents').split('_');
            this.task.index = parseInt(helperCookie.getCookieString('index'));
            this.task.isVictory = helperCookie.getCookieString('victory') == 'true';
            this.arcade();
        },
        arcade(back) {
            if (!this.task || back) {
                this.task = { id: 'arcade', show: true, index: -1, opponents: '0_2_5_4_3_1'.split('_') };
                helperCookie.setCookieString('opponents', '0_2_5_4_3_1');
                helperCookie.setCookieString('index', '0');
            }

            if (!this.task.decklistPlayer1) {
                if (this.task.decklist) {
                    helperCookie.setCookieString('deck1', this.task.decklist.list.split(',').join('_'));
                    this.task.decklistPlayer1 = true;
                    this.task.decklist = null;
                } else {
                    this.deckListAdd = false;
                    return this.setStep('decklists', 'Select player deck')
                }
            }

            if (this.task.fight) {
                helperCookie.setCookieString('deck2', this.opponent.list.split(',').join('_'));
                window.location.href = `/gundamTcgFight`;
                return;
            }

            if (this.task.show && this.task.index > -1) {
                this.task.show = false;
                this.task.fight = false;
            } else {
                this.task.index++;
                helperCookie.setCookieString('index', this.task.index);
                
                if (this.task.index >= this.task.opponents.length) {
                    this.message = "Congratulation";
                    this.step = 'message';
                    return;
                }
                this.task.fight = true;
            }

            const opponentIndex = parseInt(this.task.opponents[this.task.index]);
            this.opponent = this.deckList[opponentIndex];
            this.message = this.task.fight ? 'Next Battle' : this.task.isVictory ? 'Victory' : 'Defeat';
            this.step = 'fight';
        },
        duel(back) {
            this.deckListAdd = false;
            if (!this.task || back)
                this.task = { id: 'duel' };

            if (!this.task.decklistPlayer1) {
                if (this.task.decklist) {
                    helperCookie.setCookieString('deck1', this.task.decklist.list.split(',').join('_'));
                    this.task.decklistPlayer1 = true;
                    this.task.decklist = null;
                    this.task.back = true;
                } else {
                    return this.setStep('decklists', 'Select player deck')
                }
            }

            if (!this.task.decklistPlayer2) {
                if (this.task.decklist) {
                    helperCookie.setCookieString('deck2', this.task.decklist.list.split(',').join('_'));
                    this.task.decklistPlayer2 = true;
                    this.task.decklist = null;
                    this.task.back = true;
                } else {
                    return this.setStep('decklists', 'Select opponent deck')
                }
            }

            window.location.href = `/gundamTcgFight`;
        },
        showCardDeckList(card) {
            const newCard = { ...card };
            newCard.position = { ...card.position, x: card.position.x + 300 };
            this.showCard(newCard);
        },
        selectDeckList(decklist) {
            this.task.decklist = decklist;
            this.continueProcess();
        },
        showCard(card) {
            alert(card);
        }
    }
};
</script>