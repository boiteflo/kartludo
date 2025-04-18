<template>
    <div class="m5px" style="width:100px; height: 180px;">
        <div class="flex flex-space-around m5px text-center" style="height:30px">
            <div @click="$emit('clickdown', card)" class="bgRedHover cursorHand flex-grow">-</div>
            <div class="flex-grow">{{ card.quantity }}</div>
            <div @click="$emit('clickup', card)" class="bgGreenHover cursorHand flex-grow">+</div>
        </div>
        <img class="w100p cursorHand" style="object-fit: cover; aspect-ratio: 107/150;" :src="require('@/assets/' + folder + card.id + '.webp')"
            @click="$emit('cardclick', card)">
    </div>
</template>
<script>

export default {
    name: 'decklist-card',
    components: {},
    props: ['card', 'folder']
}
</script>