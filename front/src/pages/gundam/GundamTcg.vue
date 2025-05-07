<template>
    <div class="bg2 h100p w100p fadeIn3sec" :key="refreshPage">
        <div v-if="texts" class="w100p" style="height: 100%">
            <img v-if="isHorizontal" style="height: 100%"
                :class="{ w100p: 1, absolute: 1, 'image-cover': 1, 'blur-box': 1, 'blurred': step !== 'menu' }"
                :src="require('@/assets/Gundam/wallpaper.webp')" />

            <img v-else style="height: 100%"
                :class="{ w100p: 1, h100p: 1, absolute: 1, 'image-cover': 1, 'blur-box': 1, 'blurred': step !== 'menu' }"
                :src="require('@/assets/Gundam/wallpaper2.webp')" />

            <div v-if="step === 'menu'" :class="{ absolute: 1, h100p: isHorizontal, colorBlack: 1, 'text-center': 1 }"
                :style="{ top: '0px', left: '10%', width: isHorizontal ? '300px' : '80%', 'background-color': isHorizontal ? 'rgba(255,255,255,0.5)' : 'transparent' }">
                <div style="height:64px"></div>
                <div class="fontSize2em bold colorWhite"
                    :style="{ color: 'black', 'margin-top': '50px', 'margin-bottom': '30px' }">
                    GUNDAM TCG
                </div>
                <div v-if="playerInfo" class="w100p flex flex-space-around" style="height: 30px; ">
                    <img :src="require('@/assets/en.png')" :style="saturateIfLang('en')" @click="selectLang('en')" class="cursorHand">
                    <img :src="require('@/assets/fr.png')" :style="saturateIfLang('fr')" @click="selectLang('fr')" class="cursorHand">
                </div>
                <v-btn class="w100p" hide-details @click="tuto"
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    {{texts.tuto}}
                </v-btn>
                <v-btn class="w100p" hide-details @click="decklists"
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    {{texts.decklists}}
                </v-btn>
                <v-btn class="w100p" hide-details @click="arcade"
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    {{texts.arcade}}
                </v-btn>
                <v-btn class="w100p" hide-details
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    {{texts.campaign}}
                </v-btn>
                <v-btn class="w100p" hide-details @click="duel"
                    style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                    {{texts.duel}}
                </v-btn>
                <div class="w100p textVerticalCenter"
                    style="margin-top:20px; height:60px; background-color: rgba(200,200,200,0.75);">
                    {{texts.byflo}}
                </div>
            </div>

            <div v-else class="relative fadeIn3sec">
                <div class="mp5px absolute">
                    <v-btn @click="back"><v-icon class="colorBlack">mdi-arrow-left</v-icon></v-btn>
                </div>
                <div class="w100p fontSize150em bold text-center mp5px">{{ title }} </div>

                <div v-if="step === 'decklist'">
                    <!-- DeckList Show-->
                    <deck-list v-if="decklistShow" :texts="texts" :decklist="decklistShow" :cardlist="cardList" folder="Gundam/cards/" style="top:0px;" 
                        @cardclick="showCardDeckList" @cancel="back" @validate="setDeckList" @delete="deleteDecklist" @duplicate="duplicateDecklist">
                    </deck-list>
                </div>

                <div v-if="step === 'decklists'">
                    <!-- DeckLists -->
                    <div class="flex flex-wrap flex-space-around fontSize150em">
                        <deck v-for="(deck, index) in deckList" :key="'Deck' + index" :deck="deck"
                            folder="Gundam/cards/" @click="selectDeckList(deck)" style="width: 15%">
                        </deck>
                    </div>
                    <br><br>
                    <div class="mp5px flex flex-center">
                        <v-btn v-if="deckListAdd" @click="addDeck">{{texts.addNewDeck}}</v-btn>
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
                        <v-btn class="mp5px" @click="back">{{texts.giveUp}}</v-btn>
                        <v-btn v-if="!task.fight && task.battleResult == this.texts.victory" class="mp5px"
                            @click="continueProcess">
                            {{texts.nextBattle}}
                        </v-btn>
                        <v-btn v-if="task.fight || task.battleResult != this.texts.victory" class="mp5px bg2"
                            @click="continueProcess">{{texts.battle}}</v-btn>
                    </div>
                </div>

                <div v-if="step === 'message'">
                    <div class="textVerticalCenter bold" style="font-size: 8em;">
                        {{ message }}
                    </div>
                    <v-btn class="mp5px centerDiv" @click="end">Menu</v-btn>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import helperCookie from '../../helpers/helperCookie';
import helperParamUrl from '../../helpers/helperParamUrl';
import cards from '../../data/gundamCards.json';
import gundamTexts from '../../data/gundamTexts.json';
import deckList from '../../games/deckList';
import deck from '../../games/deck';

export default {
    name: 'pageGundamTcgFight',
    components: { deck, deckList },
    data: () => ({
        step: 'menu',
        task: null,
        refreshPage:0,
        texts: null,
        title: '',
        message: '',
        opponents: null,
        opponent: null,
        isHorizontal: true,
        decklistShow: null,
        cardList: null,
        deckList: null,
        deckListAdd: false,
        playerInfo: null
    }),
    mounted() {
        this.isHorizontal = this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height;
        this.cardList = cards.cards;

        this.playerInfo = helperCookie.getLocalStorage('playerInfo');
        if (!this.playerInfo || !this.playerInfo.decks || this.playerInfo.decks.length < 1) {
            this.playerInfo = { date: new Date(), decks: cards.decklist, lang:'en' };
            this.savePlayerInfo();
        }
        this.deckList = this.playerInfo.decks;
        this.texts = gundamTexts[this.playerInfo.lang];

        const params = helperParamUrl.getParams();
        if (params.continue == '1')
            this.continueGame();
    },
    methods: {
        savePlayerInfo() {
            this.playerInfo.decks.forEach((x,index)=> x.index = index);
            helperCookie.setLocalStorage('playerInfo', this.playerInfo);
            this.deckList = this.playerInfo.decks;
        },
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
            else {
                this.setStep('menu');
                this.task = null;
            }
        },
        continueGame() {
            this.task = { id: 'arcade', show: true, decklistPlayer1: true }
            this.task.opponents = helperCookie.getCookieString('opponents').split('_');
            this.task.index = parseInt(helperCookie.getCookieString('index'));
            const victory = helperCookie.getCookieString('victory');
            this.task.battleResult = victory == 'true' ? this.texts.victory
                : victory == 'false' ? this.texts.defeat : '';
            this.arcade();
        },
        showCard(card) {
            alert(card);
        },
        end() {
            window.location.href = `/gundamTcg`;
        },
        tuto() {
            window.location.href = `/gundamTcgTuto`;
        },
        arcade(back) {
            if (!this.task || back) {
                this.task = { id: 'arcade', show: true, index: -1, opponents: '0_2_5_4_3_1'.split('_'), isVictory: true };
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
                    return this.setStep('decklists', this.texts.selectPlayerDeck)
                }
            }

            if (this.task.fight) {
                helperCookie.setCookieString('deck2', this.opponent.list.split(',').join('_'));
                window.location.href = `/gundamTcgFight`;
                return;
            }

            if (this.task.show && this.task.index > -1) {
                this.task.show = false;
                this.task.fight = this.task.battleResult != this.texts.victory;
            } else {
                this.task.index++;
                helperCookie.setCookieString('index', this.task.index);

                if (this.task.index >= this.task.opponents.length) {
                    this.message = this.texts.congratulation;
                    this.step = 'message';
                    return;
                }
                this.task.fight = true;
                this.task.battleResult = '';
            }

            const opponentIndex = parseInt(this.task.opponents[this.task.index]);
            this.opponent = cards.decklist[opponentIndex];
            this.message = !this.task.battleResult ? this.texts.nextBattle : this.task.battleResult;
            this.step = 'fight';
            this.title = '';
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
                    return this.setStep('decklists', this.texts.selectPlayerDeck)
                }
            }

            if (!this.task.decklistPlayer2) {
                if (this.task.decklist) {
                    helperCookie.setCookieString('deck2', this.task.decklist.list.split(',').join('_'));
                    this.task.decklistPlayer2 = true;
                    this.task.decklist = null;
                    this.task.back = true;
                } else {
                    return this.setStep('decklists', this.texts.selectOpponentDeck)
                }
            }

            window.location.href = `/gundamTcgFight`;
        },

        /* 
        ------------------------------ Handle Decklist
         */
        decklists(back) {
            this.deckListAdd = true;
            if (!this.task || back) {
                this.decklistShow = null;
                this.task = { id: 'decklists' };
            }
            let step = 'decklists';
            let title = this.texts.decklists;

            if (this.task.decklist) {
                step = "decklist";
                title = this.texts.setDeck;
                this.task.back = true;
                this.decklistShow = this.task.decklist;
            }

            return this.setStep(step, title);
        },
        showCardDeckList(card) {
            const newCard = { ...card };
            newCard.position = { ...card.position, x: card.position.x + 300 };
            this.showCard(newCard);
        },
        setDeckList(decklist) {
            this.task.decklist.name = decklist.name;
            this.task.decklist.card1 = decklist.card1;
            this.task.decklist.card2 = decklist.card2;
            this.task.decklist.card3 = decklist.card3;
            this.task.decklist.list = decklist.list;
            this.savePlayerInfo();
            this.back();
        },
        deleteDecklist(decklist){
            this.playerInfo.decks = this.playerInfo.decks.filter(x=> x.index !== decklist.index);
            this.savePlayerInfo();
            this.back();
        },
        addDeck() {
            const decklist = {
                date: new Date(),
                name: this.texts.newDeck,
                card1: "EXB-001",
                card2: "empty",
                card3: "empty",
                list: ""
            };
            this.playerInfo.decks.push(decklist);
            this.savePlayerInfo();
            this.selectDeckList(decklist);
        },
        duplicateDecklist(list){
            const decklist = {
                date: new Date(),
                name: this.texts.newDeck,
                card1: list.card1,
                card2: list.card2,
                card3: list.card3,
                list: list.list
            };
            this.playerInfo.decks.push(decklist);
            this.savePlayerInfo();
            this.selectDeckList(decklist);
            this.refreshPage++;
        },
        selectDeckList(decklist) {
            this.task.decklist = decklist;
            this.continueProcess();
        },
        selectLang(lang){
            this.playerInfo.lang = lang;
            this.savePlayerInfo();
            this.texts = gundamTexts[this.playerInfo.lang];
        },
        saturateIfLang(target){
            if(!this.playerInfo || !this.playerInfo.lang)
                return {};
            const percent = this.playerInfo.lang == target ? '1' : '0';
            return {'filter': `saturate(${percent})`};
        }
    }
};
</script>