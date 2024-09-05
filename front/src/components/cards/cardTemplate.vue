<template>
    <card-medium :background="background" class="cursorPointer, m5px" :images="images"
        @click="$emit('click')" :image_position="image_position">
        <div v-for="(obj,index) in texts" :key="'Text' + index"
            class="text" :style="obj.style" v-html="obj.text">
        </div>
    </card-medium>
</template>


<script>
import serviceTemplate from '../../services/serviceTemplate'
import cardMedium from './cardMedium';

export default {
    props: ['template', 'values', 'image_position'],
    components: { cardMedium },
    data: () => ({
        background: require('@/assets/Daggerheart/template/CardDomain.png'),
        images: null,
        texts: null
    }),
    mounted() {
        const result = serviceTemplate.createFromCsv(this.template, this.values);
        this.background = result.background;
        this.images = result.images;
        this.texts = result.texts;
        return this.images;
    },
    methods: {
    }
}
</script>
