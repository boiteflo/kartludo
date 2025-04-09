<template>
  <div class="absolute bgYellow circle15px elevation-24" @click="$emit('click', card)" :style="{
    left: card.position.x + 'px',
    top: card.position.y + 'px',
    width: card.position.width + 'px',
    height: card.position.height + 'px',
    transform: 'rotate(' + card.position.rotation + 'deg)',
    'z-index': card.zindex,
    cursor: shine ? 'pointer' : '',
    border: card.fx ? '1px solid yellow' : ''
  }">
    <div v-if="!card">No card</div>
    <img v-else-if="card.verso" :class="{ w100p: true, h100p: true, absolute:true }" draggable="false"
      :style="{ 'object-fit': 'cover', 'object-position': card.bgposition, 'pointer-events': 'none' }"
      :src="require('@/assets/' + folder + 'empty.webp')"  />
    <img v-else :class="{ w100p: true, h100p: true, shine: shine, absolute:true }" draggable="false"
      :style="{ 'object-fit': 'cover', 'object-position': card.bgposition, 'pointer-events': 'none' }"
      :src="require('@/assets/' + folder + card.id + '.webp')" @mouseover="$emit('mouseover', card)"
      @contextmenu.prevent="$emit('clickright', card)" />
    <div v-if="!card.verso && !hidestat && (card.ap || card.hp)" class="absolute circle10px textVerticalCenter centerDiv colorBlack fontSize150em"
      style="width:70px; height:30px; top:-10px; background-color: #FFFFFFB0;">
      {{ card.ap }} - {{ card.hp }}
    </div>
    <div class="w100p h100p absolute shine circle15px" v-if="card && card.dead" style="background-color: #FF000050;">
    </div>
  </div>
</template>

<style scoped></style>

<script>
export default {
  name: 'game-card',
  props: ['card', 'folder', 'shine', 'hidestat']
}
</script>