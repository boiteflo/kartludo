<template>
    <div class="w100p" v-if="texts">
        <div class="w100p flex">
            <div style="width: 300px; flex-direction: column" class="m5px fontSize100em flex">
                <input type="text" class="m5px bgBlack colorWhite text-center" style="height: 45px; padding:16px; border:1px solid white" v-model="name">
                <v-btn class="m5px" style="height:45px" @click="addCardPopup">{{texts.addCard}}</v-btn>
                <v-btn class="m5px" style="height:45px" @click="$emit('duplicate', decklist)">{{texts.duplicate}}</v-btn>
                <v-btn class="m5px bgRed2" style="height:45px" @click="deleteDecklist">{{texts.delete}}</v-btn>
                <v-btn class="m5px shine bg2" style="height:45px" @click="validate">{{texts.validate}}</v-btn>
                <div class="flex" style="height:89px; margin-bottom:5px;">
                    <v-btn class="m5px flex-grow"
                        :style="{ height:'89px', 'background-size': 'cover', backgroundImage: 'url(' + require('@/assets/' + folder + card2 + '.webp') + ')' }"
                        @click="setCard(2)">
                    </v-btn>
                    <v-btn class="m5px flex-grow"
                        :style="{ height:'89px','background-size': 'cover', backgroundImage: 'url(' + require('@/assets/' + folder + card1 + '.webp') + ')' }"
                        @click="setCard(1)">
                    </v-btn>
                    <v-btn class="m5px flex-grow"
                        :style="{ height:'89px','background-size': 'cover', backgroundImage: 'url(' + require('@/assets/' + folder + card3 + '.webp') + ')' }"
                        @click="setCard(3)">
                    </v-btn>
                </div>
                <div class="w100p text-center">{{ resume }}</div>
                <div class="w100p text-center">{{ resume2 }}</div>
                <textarea class="w100p h100p" v-model="list" @input="setList" style="min-height: 300px;"></textarea>
            </div>
            <div class="w100p flex flex-wrap flex-space-around" style="align-content: flex-start;">
                <decklist-card v-for="(card, index) in cardData" :key="'Decklist card ' + index" :card="card"
                    :folder="folder" @cardclick="cardclick" @clickdown="incruise(card, -1)"
                    @clickup="incruise(card, 1)">
                </decklist-card>
            </div>
        </div>


        <div v-if="popup" class="w100p h100p scroll absolute bgYellow3 colorBlack" style="top:5px; right:5px; left:5px;">
            <div class="text-center w100p fontSize150em bold" style="height:45px">{{ popup.title }}</div>
            <div class="flex flex-wrap m5px">
                <img v-for="(card, index) in popup.cards" :key="'popupCard' + index" class="cursorHand"
                    style="object-fit: cover; aspect-ratio: 107/150; width:10%; min-width: 100px;"
                    :src="require('@/assets/Gundam/cards/' + card + '.webp')" @click="addCard(card)">
            </div>
            <div class="flex flex-space-around m5px">
                <div v-for="(choice, index) in popup.choices" :key="'popupChoice' + index">
                    <v-btn class="m5px" @click="selectChoice(choice)"> {{ choice }}</v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import decklistCard from './deckListCard';
import cardLife from './gundam/cardLife';

export default {
    name: 'deck-list',
    components: { decklistCard },
    props: ['texts', 'decklist', 'folder', 'cardlist', 'card'],
    data: () => ({
        list: '',
        resume: '',
        resume2: '',
        name: '',
        card1: 'empty',
        card2: 'empty',
        card3: 'empty',
        listCorrect: '',
        cardData: null,
        stopRefresh: false,
        cardIndexSet: 0,
        popup: null
    }),
    mounted() {
        this.list = this.decklist.list.split(',').join('\n');
        this.name = this.decklist.name;
        this.card1 = this.decklist.card1;
        this.card2 = this.decklist.card2;
        this.card3 = this.decklist.card3;
        this.refresh();
    },
    methods: {
        refresh() {
            const result = [];
            const resultText = [];
            const cards = this.list.split('\n');
            const listCorrect = [];
            // let index = 0;

            cards.forEach(line => {
                // index += line.length;
                let info = line.split('x');
                let quantity = parseInt(info[0]);
                if (info.length < 2 || isNaN(quantity) || quantity < 1) {
                    resultText.push(line);
                }
                else {
                    const id = this.getId(info[1]);
                    const card = this.cardlist?.find(x => x.id == id);

                    if (card) {
                        result.push({ id, quantity, card });
                        listCorrect.push(`${quantity}x${id}`);
                        resultText.push(`${quantity}x${id} ${card.name}`);
                        /*
                        if (!line.includes(' ')) {
                            this.list = this.insertStringAt(this.list, index, ' ' + card.name);
                            index += 1 + card.name.length;
                        }*/
                    }
                }

            });
            let unitLength = 0;
            let pilotLength = 0;
            let commandLength = 0;
            let baseLength = 0;
            let deckLength = 0;
            result.forEach(card => {
                if (cardLife.isCardUnit(card.card)) unitLength += card.quantity;
                if (cardLife.isCardPilot(card.card)) pilotLength += card.quantity;
                if (cardLife.isCardCommand(card.card)) commandLength += card.quantity;
                if (cardLife.isCardBase(card.card)) baseLength += card.quantity;
                deckLength += card.quantity;
            });

            this.resume = `${deckLength} ${this.texts.cards2}`;
            this.resume2 = `${unitLength} ${this.texts.units}, ${pilotLength} ${this.texts.pilots}, ${commandLength} ${this.texts.commands}, ${baseLength} ${this.texts.bases}`;
            this.listCorrect = listCorrect.join(',');
            this.list = resultText.join('\n');
            this.cardData = result;
        },
        setList() {
            if (this.stopRefresh)
                return;
            this.stopRefresh = true;
            this.refresh();
            this.stopRefresh = false;
        },
        getId(str) {
            return str.trim().split(' ')[0];
        },
        incruise(card, pitch) {
            const index = this.list.indexOf(card.id);
            const quantity = parseInt(this.list.charAt(index - 2)) + pitch;
            this.list = this.insertStringAt(this.list, index - 2, quantity);
            this.setList();
        },
        insertStringAt(content, index, str) {
            return content.substring(0, index) + str + content.substring(index + 1);
        },
        validate() {
            this.$emit('validate', {
                list: this.listCorrect,
                name: this.name,
                card1: this.card1,
                card2: this.card2,
                card3: this.card3,
            });
        },
        showPopup(popup) {
            this.popup = popup;
        },

        // Set Card1 2 or 3
        setCard(index) {
            this.cardIndexSet = index;
            this.showPopup({ title: this.texts.selectCard + ' ' + index });
        },
        cardclick(card) {
            if (this.cardIndexSet < 1)
                return;

            const prop = 'card' + this.cardIndexSet;
            this[prop] = card.id;
            this.cardIndexSet = 0;
            this.popup = null;
            return;
        },

        // Add Cards
        addCardPopup() {
            const alreadyUsed = this.cardData.map(x => x.id);
            const cards = this.cardlist.filter(x => !x.hideInDecklist && !alreadyUsed.includes(x.id)).map(x => x.id);
            this.showPopup({ title: this.texts.selectCard, cards });
        },
        addCard(card) {
            this.popup=null;
            this.list = this.list + '\n' + '4x' + card;
            this.refresh();
        },
        
        // Delete
        deleteDecklist() {
            this.showPopup({ title: this.texts.confirmDelete, choices: [this.texts.yes, this.texts.no] })
        },
        selectChoice(choice) {
            if (choice == this.texts.yes)
                this.$emit('delete', this.decklist);
            this.popup = null;
        }
    }
}
</script>