<template>
    <div class="relative" @click="$emit('click')">
        <div class="containerCard" @click="$emit('click')">
            <div v-if="image" class="overlay-image" :style="{ 'background-image': 'url(' + image + ')' }" @click="$emit('click')"></div>

            <div class="background-image" :style="{ 'background-image': 'url(' + bg + ')' }">

                <slot></slot>

            </div>
        </div>
        <div :class="{ absolute:true, t0px:true, yellowGradient: highlight, w100p: true, h100p: true }" style="z-index:2"></div>
    </div>
</template>

<style>
.containerCard {
    width: 170px;
    height: 238px;
    position: relative;
    padding: 0px;
    overflow: hidden;
}

.background-image {
    width: 170px;
    height: 238px;
    background-size: cover;
    position: relative;
    z-index: 2;
}

.overlay-image {
    width: 170px;
    height: 238px;
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
    props: ['image', 'background', 'highlight'],
    data: () => ({

    }),
    computed: {
        bg() {
            return this.background || require('@/assets/Daggerheart/template/CardAncestry.png');
        }
    }
}
</script>
