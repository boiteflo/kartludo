<template>
    <div v-if="cards && cards.length > 0"  class="p5px" >
        <div class="flex-wrap">
            <card-image v-for="card in cards" 
                v-bind:key="card.IdName" 
                :card="card"
                :badgeoff="badgeoff"
                :size="size"
                v-on:select="$emit('select', $event)">
            </card-image>
        </div>
    </div>
</template>

<script>
import cardImage from './cardImage';

  export default {
    name: 'panel-cards',
    props: ['cards', 'badgeoff', 'size'],
    components: {cardImage},
  }
</script>
