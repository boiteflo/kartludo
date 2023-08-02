<template>
  <div v-if="cards && cards.length > 0" 
    :class="{'flex-wrap':!noflex, 'p5px':true}">
    <card-image v-for="card in cards" 
      v-bind:key="keyid + card.IdName"
      :card="card"
      :badgeoff="badgeoff"
      :shadow="shadowArrayIds && shadowArrayIds.includes(card.Id)"
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
    props: ['cards', 'badgeoff', 'size', 'center', 'tooltip', 'noflex', 'shadowArrayIds', 'keyid'],
    components: {cardImage},
  }
</script>
