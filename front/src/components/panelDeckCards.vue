<template>
    <div class="flex-wrap" v-if="cards">
        <div v-for="cardObject in cards" 
            v-bind:key="cardObject.Card.IdName" 
            style="position:relative">
        <card-image :card="cardObject.Card" 
                    :badgeoff="false" 
                    :size="size"
                    v-on:select="$emit('select', $event)">
        </card-image>
        <img :style="{ width: (size ? size : 150)+ 'px' }" 
              v-if="cardObject.Quantity === '2'" 
              :src="cardObject.Card.Image" 
              style="position:absolute; top:32px; left:5px"
              @click="$emit('select', cardObject.Card)"/>
        </div>
    </div>
</template>

<script>
import cardImage from './cardImage';

  export default {
    name: 'panel-deck-cards',
    props: ['cards', 'size'],
    components: {cardImage},
  }
</script>
