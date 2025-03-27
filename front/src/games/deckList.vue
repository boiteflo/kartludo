<template>
    <div class="relative w100p bg2 h100p">
        <div v-for="(card, index) in cardData" :key="'Decklist card ' + index" class="absolute"
            :style="{ width: card.position.width + 'px', top: card.position.y + 'px', left: card.position.x + 'px' }">
            <img class="w100p" style="object-fit: cover;" :src="require('@/assets/' + folder + card.id + '.webp')"
                @click="$emit('cardclick', card)">
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
import deck from './deck';

export default {
    name: 'deck-list',
    components: { deck },
    props: ['decklist', 'folder', 'cardlist'],
    data: () => ({
        list: '',
        resume: '',
        listCorrect: '',
        cardData: null,
        stopRefresh: false
    }),
    mounted() {
        this.refresh(this.decklist.list.split(',').join('\n'));
    },
    methods: {
        validate() {
            this.$emit('validate', { list: this.listCorrect });
        },
        refresh(decklist) {
            const result = [];
            const resultText = [];
            if (!decklist)
                return result;

            const cards = decklist.split('\n');
            const size = { width: this.$vuetify.breakpoint.width - 310, height: this.$vuetify.breakpoint.height };
            const margin = 10;
            size.widthMargin = size.width - (7 * margin);
            const cardSize = { width: size.widthMargin / 6 };
            cardSize.height = cardSize.width * 150 / 107;
            let x = 300 + margin;
            let y = margin;
            const listCorrect = [];

            cards.forEach(line => {
                let info = line.split('x');
                let quantity = parseInt(info[0]);
                if (info.length < 2 || isNaN(quantity)) {
                    resultText.push(line);
                }
                else {
                    const id = this.getId(info[1]);
                    const card = this.cardlist?.find(x => x.id == id);

                    if (card) {
                        for (let i = 0; i < quantity; i++)
                            result.push({
                                id, 
                                position: { x, y: y + (i * 0.075 * cardSize.height), width:cardSize.width, height:cardSize.height }
                            });

                        resultText.push(`${quantity}x ${id} ${card.name}`);
                        listCorrect.push(`${quantity}x${id}`);

                        x += cardSize.width + margin;
                        if (x > size.width + 100) {
                            x = 300 + margin;
                            y += (cardSize.height * 1.30);
                        }
                    } else
                        resultText.push(line);
                }
            });

            this.resume = `${result.length} cards`;
            this.listCorrect = listCorrect.join(',');
            this.list = resultText.join('\n');
            this.cardData = result;
        },
        getId(str) {
            return str.trim().split(' ')[0];
        },
        setList() {
            if (this.stopRefresh)
                return;
            this.stopRefresh = true;
            this.refresh(this.list);
            this.stopRefresh = false;
        }
    }
}
</script>