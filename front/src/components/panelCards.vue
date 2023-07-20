<template>
    <div v-if="cards && cards.length > 0"  class="p5px" >

        <div :class="{'flex-wrap':true, 'flex-space-around':center}">
            <div v-for="card in cards" 
                v-bind:key="card.IdName" >
              <card-image :card="card"
                  :badgeoff="badgeoff"
                  :size="size"
                  :tooltip="tooltip"
                  v-on:select="$emit('select', $event)">
              </card-image>
            </div>
        </div>
    </div>
</template>

<script>
import cardImage from './cardImage';

  export default {
    name: 'panel-cards',
    props: ['cards', 'badgeoff', 'size', 'center', 'tooltip'],
    components: {cardImage},
  }
</script>
