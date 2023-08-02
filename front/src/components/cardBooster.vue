<template>
    <div class="m5px bg cursorHand" style="width:180px;" >
        <div class="textCenter h42 bg colorWhite">{{title}}</div>
        <v-btn v-for="action in actions"
          :key="action.Id"
          class="w100p p5px bg2 colorWhite" 
          @click="$emit(action.Id, booster)">
          <v-icon>{{action.Icon}}</v-icon>{{action.Text}}
        </v-btn>
        <img style="width:180px;" :src="image" />
    </div>
</template>

<script>
  export default {
    name: 'card-booster',
    props: ['title', 'image', 'booster', 'actions']
  }
</script>
