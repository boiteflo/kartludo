<template>
        <v-expand-transition>
            <div v-show="cards && cards.length > 0" class="m5px" style="min-height:450px">
                <div class="flex-wrap">
                    <div class="m5px" v-for="card in cards" v-bind:key="card.Id + card.RefId">
                        <v-badge v-if="card.Limit" :content="card.Limit" color="black">
                            <img class="w150" :src="card.Image"/>
                        </v-badge>
                        <img v-else class="w150" :src="card.Image"/>
                    </div>
                </div>
            </div>
        </v-expand-transition>
</template>

<script>
  export default {
    name: 'panelSearchCard',
    props: ['cards']
  }
</script>
