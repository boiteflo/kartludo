<template>
    <div class="flex-wrap" v-if="cards">
        <div v-for="cardObject in cards" 
            v-bind:key="keyid + cardObject.Card.IdName" 
            style="position:relative">
          <card-image :card="cardObject.Card" 
                      :badgeoff="false" 
                      :size="size"
                      :x2="cardObject.Quantity === '2'"
                      :x3="cardObject.Quantity === '3'"
                      :tooltip="tooltip"
                      v-on:select="$emit('select', $event)"
                      @hover="$emit('hover', $event)">
          </card-image>
        </div>
    </div>
</template>

<script>
import cardImage from './cardImage';

  export default {
    name: 'panel-deck-cards',
    props: ['cards', 'size', 'tooltip', 'keyid'],
    components: {cardImage},
  }
</script>
