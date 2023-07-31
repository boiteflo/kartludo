<template>
    <div class="m5px bg cursorHand" style="width:180px;" >
        <div class="textCenter h42 bg colorWhite">{{title}}</div>
        <img style="width:180px;" :src="image" />
        <v-btn class="w100p" @click="$emit('open', booster)"><v-icon>mdi-cube</v-icon>Ouvrir le cube</v-btn>
    </div>
</template>

<script>
  export default {
    name: 'card-booster',
    props: ['title', 'image', 'booster']
  }
</script>
