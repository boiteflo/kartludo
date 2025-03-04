<template>
  <img :class="{ absolute: true, shine: shine }" :style="{
    left: card.position.x + 'px', top: card.position.y + 'px',
    width: card.width + 'px', height: card.height + 'px', transform : 'rotate(' + card.position.rotation + 'deg)',
    'object-fit': 'cover', 'object-position': card.bgposition, 'z-index':card.zindex
  }" :src="require('@/assets/' + folder + card.id + '.webp')" @mouseover="$emit('mouseover', card)"
    @click="$emit('click', card)" @contextmenu.prevent="$emit('clickright', card)" />
</template>

<style scoped>
 .shine {
   -webkit-mask-image: linear-gradient(-75deg, #000 20%, rgba(0, 0, 0, .5) 40%, #000 60%);
   -webkit-mask-size: 200%;
   animation: shinefx 1s infinite;
   /**/
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
  props: ['card', 'folder', 'shine']
}
</script>
