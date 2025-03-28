<template>
    <div class="absolute"
        :style="{ width: card.position.width + 'px', top: card.position.y + 'px', left: card.position.x + 'px' }">
        <img class="w100p" style="object-fit: cover;" :src="require('@/assets/' + folder + card.id + '.webp')"
            @click="$emit('cardclick', card)">
        <v-btn v-if="card.buttons" @click="$emit('clickdown', card)" class="bgRedHover absolute" style="bottom:50px; width:50%">-</v-btn>
        <v-btn v-if="card.buttons" @click="$emit('clickup', card)" class="bgGreenHover absolute" style="bottom:50px; width:50%">+</v-btn>
    </div>
</template>
<script>

export default {
    name: 'decklist-card',
    components: {},
    props: ['card', 'folder']
}
</script>