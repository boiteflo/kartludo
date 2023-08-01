<template>
    <div class="m5px bg cursorHand" style="width:180px;" >
        <div class="textCenter h42 bg colorWhite">{{title}}</div>
        <v-btn class="w100p m5px" @click="$emit('open', booster)"><v-icon>mdi-cube</v-icon>Ouvrir le cube</v-btn>
        <img style="width:180px;" :src="image" />
    </div>
</template>

<script>
  export default {
    name: 'card-booster',
    props: ['title', 'image', 'booster']
  }
</script>
