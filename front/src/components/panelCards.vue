<template>
  <div v-if="cards && cards.length > 0" 
    :class="{'flex-wrap':!noflex, 'p5px':true}">
    <card-image v-for="card in cards" 
      v-bind:key="card.IdName"
      :card="card"
        :badgeoff="badgeoff"
        :size="size"
        :tooltip="tooltip"
        v-on:select="$emit('select', $event)"
        @hover="$emit('hover', $event)">
    </card-image>
  </div>
</template>

<script>
import cardImage from './cardImage';

  export default {
    name: 'panel-cards',
    props: ['cards', 'badgeoff', 'size', 'center', 'tooltip', 'noflex'],
    components: {cardImage},
  }
</script>
