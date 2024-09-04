<template>
    <div class="relative" @click="$emit('click')">
        <div class="containerCard" @click="$emit('click')">
            <div v-if="image" class="overlay-image"
                :style="{ 'background-image': 'url(' + image + ')', 'background-position': img_position }"
                @click="$emit('click')"></div>


            <div v-for="(obj, index) in images" :key="'Image' + index" :style="obj" @click="$emit('click')"
                class="overlay-image">
            </div>

            <div class="background-image" :style="{ 'background-image': 'url(' + bg + ')' }">

                <slot></slot>

            </div>
        </div>
        <div :class="{ absolute: true, t0px: true, yellowGradient: highlight, w100p: true, h100p: true }"
            style="z-index:2"></div>
    </div>
</template>

<style scoped>
.containerCard {
    width: 340px;
    height: 476px;
    position: relative;
    padding: 0px;
    overflow: hidden;
}

.background-image {
    width: 340px;
    height: 476px;
    background-size: cover;
    position: relative;
    z-index: 2;
}

.overlay-image {
    width: 340px;
    height: 250px;
    position: absolute;
    background-size: cover;
    background-position: center;
    z-index: 1;
}

.text {
    position: absolute;
    font-family: system-ui;
    color: black;
}
</style>

<script>
export default {
    name: 'card-small',
    props: ['image', 'images', 'background', 'highlight', 'image_position'],
    data: () => ({

    }),
    computed: {
        bg() {
            return this.background || require('@/assets/Daggerheart/template/CardAncestry.png');
        },
        img_position() {
            return this.image_position || '0px 0px';
        }
    }
}
</script>
