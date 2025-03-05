<template>
  <div class="absolute" :style="{
    left: card.position.x + 'px',
    top: card.position.y + 'px',
    width: card.width + 'px',
    height: card.height + 'px',
    transform: 'rotate(' + card.position.rotation + 'deg)',
    'z-index': card.zindex
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
.shine {
  -webkit-mask-image: linear-gradient(-75deg, #000 20%, rgba(0, 0, 0, .5) 40%, #000 60%);
  -webkit-mask-size: 200%;
  mask-image: linear-gradient(-75deg, #000 20%, rgba(0, 0, 0, .5) 40%, #000 60%);
  mask-size: 200%;
  animation: shinefx 1s infinite;
  /* hidestat */
}

@keyframes shinefx {
  from {
    -webkit-mask-position: -200%;
  }

  to {
    -webkit-mask-position: 0%;
  }
}
</style>

<script>
export default {
  name: 'game-card',
  props: ['card', 'folder', 'shine', 'hidestat']
}
</script>
