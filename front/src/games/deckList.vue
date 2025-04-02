<template>
    <div class="w100p bg2 h100p">
        <div class="relative w100p" style="margin-left:300px">
            <decklist-card v-for="(card, index) in cardData" :key="'Decklist card ' + index" :card="card"
                :folder="folder" @cardclick="$emit('cardclick', card)" @clickdown="incruise(card,-1)" @clickup="incruise(card,1)">
            </decklist-card>
        </div>
        <div style="width: 300px;" class="m5px h100p bgWhite fontSize125em">
            <v-btn class="w100p bg" style="height:45px" @click="$emit('cancel')">Back</v-btn>
            <div class="w100p text-center">{{ resume }}</div>
            <deck :deck="decklist" :folder="folder" style="width:280px; height:238px"> </deck>
            <v-btn class="w100p shine bg2" style="height:45px" @click="validate">Valider</v-btn>
            <br>
            <textarea class="w100p h100p" v-model="list" @input="setList">
        </textarea>
        </div>
    </div>
</template>

<script>
import positioner from './gundam/positioner';
import decklistCard from './deckListCard.vue';
import deck from './deck';

export default {
    name: 'deck-list',
    components: { deck, decklistCard },
    props: ['decklist', 'folder', 'cardlist'],
    data: () => ({
        list: '',
        resume: '',
        listCorrect: '',
        cardData: null,
        stopRefresh: false
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
            let index=0;

            cards.forEach(line => {
                index+= line.length;
                let info = line.split('x');
                let quantity = parseInt(info[0]);
                if (info.length < 2 || isNaN(quantity) || quantity < 1) {
                    resultText.push(line);
                }
                else {
                    const id = this.getId(info[1]);
                    const card = this.cardlist?.find(x => x.id == id);

                    if (card) {
                        result.push({ id, quantity, buttons:quantity===1 });
                        listCorrect.push(`${quantity}x${id}`);
                        resultText.push(`${quantity}x ${id} ${card.name}`);
                        if(!line.includes(' ')){
                            this.list = this.insertStringAt(this.list, index, ' ' + card.name + '\n');
                            index+= 2 + card.name.length;
                        }
                    } 
                }

            });

            const ratio = 107 / 200;
            positioner.getWrapMaxPositions(this.$vuetify.breakpoint.width - 310, this.$vuetify.breakpoint.height - 10, result, ratio);
            result.forEach(card => {
                for (let i = 1; i < card.quantity; i++) {
                    result.push({ 
                        id: card.id, 
                        buttons: i === card.quantity-1,
                        position: { ...card.position, y: card.position.y + (i * 0.06 * card.position.height) } });
                }
            });

            this.resume = `${result.length} cards`;
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
        incruise(card, pitch){
            const index = this.list.indexOf(card.id);
            const quantity = parseInt(this.list.charAt(index-2))+pitch;
            this.list = this.insertStringAt(this.list, index-2, quantity);
            this.setList();
        },
        insertStringAt(content, index, str){
            return content.substring(0, index) + str + content.substring(index+1);
        }
    }
}
</script>