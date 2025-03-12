<template>
  <div class="absolute bgYellow" @click="$emit('click', card)" :style="{
    left: card.position.x + 'px',
    top: card.position.y + 'px',
    width: card.position.width + 'px',
    height: card.position.height + 'px',
    transform: 'rotate(' + card.position.rotation + 'deg)',
    'z-index': card.zindex,
    cursor: shine ? 'pointer' : ''
  }">
    <div v-if="!card">No card</div>
    <img v-else :class="{ w100p: true, h100p: true, shine: shine }" draggable="false"
      :style="{ 'object-fit': 'cover', 'object-position': card.bgposition, 'pointer-events': 'none' }"
      :src="require('@/assets/' + folder + card.id + '.webp')" @mouseover="$emit('mouseover', card)"
      @contextmenu.prevent="$emit('clickright', card)" />
    <div v-if="!hidestat && (card.ap || card.hp)" class="absolute cirlce10px textVerticalCenter centerDiv colorBlack"
      style="width:25px; height:15px; top:-0px; font-size:10px; background-color: #FFFFFFB0;">
      {{ card.ap }} - {{ card.hp }}
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