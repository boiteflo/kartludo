<template>
        <v-expand-transition>
            <div v-show="cards && cards.length > 0" class="m5px" style="min-height:450px">
                <div class="flex-wrap flex-space-around">
                    <card-image v-for="card in cards" 
                        v-bind:key="card.IdName" 
                        :card="card"
                        :badgeoff="badgeoff">
                    </card-image>
                </div>
            </div>
        </v-expand-transition>
</template>

<script>
import cardImage from './cardImage';

  export default {
    name: 'panel-cards',
    props: ['cards', 'badgeoff'],
    components: {cardImage},
  }
</script>
