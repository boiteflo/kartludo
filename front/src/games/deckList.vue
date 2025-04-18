<template>
    <div class="w100p h100p flex">
        <div style="width: 300px; flex-direction: column" class="m5px fontSize100em h100p flex">
            <v-btn class="m5px" style="height:45px" @click="addCardPopup">Add card</v-btn>
            <div class="flex" style="height:89px; margin-bottom:5px;">
                <v-btn class="m5px flex-grow h100p"
                    :style="{ 'background-size': 'cover', backgroundImage: 'url(' + require('@/assets/' + folder + decklist.card2 + '.webp') + ')' }"
                    @click="setCard(2)">
                </v-btn>
                <v-btn class="m5px flex-grow h100p"
                    :style="{ 'background-size': 'cover', backgroundImage: 'url(' + require('@/assets/' + folder + decklist.card1 + '.webp') + ')' }"
                    @click="setCard(1)">
                </v-btn>
                <v-btn class="m5px flex-grow h100p"
                    :style="{ 'background-size': 'cover', backgroundImage: 'url(' + require('@/assets/' + folder + decklist.card3 + '.webp') + ')' }"
                    @click="setCard(3)">
                </v-btn>
            </div>
            <v-btn class="m5px shine bg2" style="height:45px" @click="validate">Validate</v-btn>
            <div class="w100p text-center">{{ resume }}</div>
            <div class="w100p text-center">{{ resume2 }}</div>
            <textarea class="w100p h100p" v-model="list" @input="setList" style="min-height: 300px;"></textarea>
        </div>
        <div class="w100p flex flex-wrap flex-space-around">
            <decklist-card v-for="(card, index) in cardData" :key="'Decklist card ' + index" :card="card"
                :folder="folder" @cardclick="cardclick" @clickdown="incruise(card, -1)" @clickup="incruise(card, 1)">
            </decklist-card>
        </div>
    </div>
</template>

<script>
import decklistCard from './deckListCard';
import cardLife from './gundam/cardLife';

export default {
    name: 'deck-list',
    components: { decklistCard },
    props: ['decklist', 'folder', 'cardlist', 'card'],
    data: () => ({
        list: '',
        resume: '',
        resume2: '',
        listCorrect: '',
        cardData: null,
        stopRefresh: false,
        cardIndexSet: 0
    }),
    mounted() {
        this.list = this.decklist.list.split(',').join('\n');
        this.refresh();
    },
    methods: {
        validate() {
            this.$emit('validate', { list: this.listCorrect });
        },
        refresh() {
            const result = [];
            const resultText = [];
            const cards = this.list.split('\n');
            const listCorrect = [];
            let index = 0;

            cards.forEach(line => {
                index += line.length;
                let info = line.split('x');
                let quantity = parseInt(info[0]);
                if (info.length < 2 || isNaN(quantity) || quantity < 1) {
                    resultText.push(line);
                }
                else {
                    const id = this.getId(info[1]);
                    const card = this.cardlist?.find(x => x.id == id);

                    if (card) {
                        result.push({ id, quantity, card});
                        listCorrect.push(`${quantity}x${id}`);
                        resultText.push(`${quantity}x ${id} ${card.name}`);
                        if (!line.includes(' ')) {
                            this.list = this.insertStringAt(this.list, index, ' ' + card.name + '\n');
                            index += 2 + card.name.length;
                        }
                    }
                }

            });
            let unitLength=0;
            let pilotLength=0;
            let commandLength=0;
            let baseLength=0;
            let deckLength = 0;
            result.forEach(card => {
                if(cardLife.isCardUnit(card.card)) unitLength+= card.quantity;
                if(cardLife.isCardPilot(card.card)) pilotLength+= card.quantity;
                if(cardLife.isCardCommand(card.card)) commandLength+= card.quantity;
                if(cardLife.isCardBase(card.card)) baseLength+= card.quantity;
                deckLength+=card.quantity;
            });


            this.resume = `${deckLength} cards`;
            this.resume2 = `${unitLength} Units, ${pilotLength} Pilots, ${commandLength} Commands, ${baseLength} Bases`;
            this.listCorrect = listCorrect.join(',');
            this.cardData = result;
        },
        
        getId(str) {
            return str.trim().split(' ')[0];
        },
        setList() {
            if (this.stopRefresh)
                return;
            this.stopRefresh = true;
            this.refresh();
            this.stopRefresh = false;
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
        setCard(index) {
            this.cardIndexSet = index;
            this.$emit('popup', {title:'Select Card ' + index});
        },
        addCardPopup(){
            this.$emit('popup', {title:'Select Card ', id:'allcards'});
        },
        cardclick(card) {
            if (this.cardIndexSet > 0) {
                this.$emit('setCard', { prop: 'card' + this.cardIndexSet, id: card.id });
                this.cardIndexSet = 0;
                this.$emit('popup', null);
                return;
            }
            this.$emit('cardclick', card);
        }
    }
}
</script>