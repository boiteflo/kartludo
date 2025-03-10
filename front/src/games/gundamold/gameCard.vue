<template>
  <div class="absolute bgYellow" :style="{
    left: card.position.x + 'px',
    top: card.position.y + 'px',
    width: card.width + 'px',
    height: card.height + 'px',
    transform: 'rotate(' + card.position.rotation + 'deg)',
    'z-index': card.zindex,
    cursor: shine ? 'pointer' :''
  }">
    <img :class="{ shine: shine, w100p: true, h100p: true }"
      :style="{ 'object-fit': 'cover', 'object-position': card.bgposition }"
      :src="require('@/assets/' + folder + card.id + '.webp')" @mouseover="$emit('mouseover', card)"
      @click="$emit('click', card)" @contextmenu.prevent="$emit('clickright', card)" />
      <div v-if="!hidestat && (card.ap || card.hp)" class="absolute bg cirlce10px textVerticalCenter" style="width:25px; height:20px; top:-5px; right:-5px; font-size:8px">
        {{card.ap}} - {{card.hp}}
      </div>
  </div>
</template>

<style scoped>
</style>

<script>
export default {
  name: 'game-card',
  props: ['card', 'folder', 'shine', 'hidestat']
}
</script>
