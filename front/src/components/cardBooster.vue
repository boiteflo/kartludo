<template>
    <div class="m5px cursorHand" :style="{width:'180px', 'background-color':color ? color : '#212A3C'}" >
        <div class="textCenter h42 colorWhite">{{title}}</div>
        <v-btn v-for="action in actions"
          :key="action.Id"
          class="w100p p5px bg2 colorWhite" 
          @click="$emit(action.Id, {...booster, event:$event})">
          <v-icon>{{action.Icon}}</v-icon>{{action.Text}}
        </v-btn>
        <img @click="$emit('click')" style="width:180px;" :src="image" />
    </div>
</template>

<script>
  export default {
    name: 'card-booster',
    props: ['title', 'image', 'booster', 'actions', 'color']
  }
</script>
