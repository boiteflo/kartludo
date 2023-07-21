<template>
    <div class="m10px" >
        <v-btn  height="110px" width="200px" @click="$emit('selected')">
            <div>
                <div v-show="deck" style="text-align:center">
                    {{truncate(deck.Title)}}
                </div>
                <div class="flex-space-around flex" style="margin-top:10px; width:200px !important;">
                    <img style="transform: rotate(-33deg); margin-right:-120px;" class="sCard"  :src="deck.MainCardsImages[1]" />
                    <img style="transform: rotate(0deg); z-index:2;" class="sCard"  :src="deck.MainCardsImages[0]" />
                    <img style="transform: rotate(25deg); margin-left:-120px; z-index:1" class="sCard"  :src="deck.MainCardsImages[2]" />
                </div>
            </div>
        </v-btn>
    </div>
</template>

<script>
  export default {
    name: 'icon-deck-cards',
    props: ['deck'],
    methods: {
        truncate(data){
            const limit = 23;
            return data.length < limit ? data : data.substring(0, limit-3) + '...';
        },
        getAngle(index){
            return index==0 ? "-25deg"
            : index=="1" ? "0deg"
            : "25deg";
        }
    }
  }
</script>
