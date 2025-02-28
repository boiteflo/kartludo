

<template> 
    <img class="absolute bgRed" 
        :style="{left:x + 'px', top:y + 'px', width:width + 'px', 'aspect-ratio': 107 / 150}"
        :src="require('@/assets/' + folder + card.id + '.webp')"
        @mouseover="$emit('mouseover', card)"
        @click="$emit('click', card)"
        @contextmenu.prevent="$emit('clickright', card)" />
</template>

<script>
  export default {
    name: 'game-card',
    props: ['card', 'folder', 'x', 'y', 'width']
  }
</script>
