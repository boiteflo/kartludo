<template>
  <div @click="$emit('click', card)"
    :class="{ absolute: 1, bgYellow: 1, circle15px: 1, 'elevation-24': 1, fadeOut: card?.fadeOut }" :style="{
      left: card.position.x + 'px',
      top: card.position.y + 'px',
      width: card.position.width + 'px',
      height: card.position.height + 'px',
      transform: 'rotate(' + card.position.rotation + 'deg)',
      'z-index': card.zindex,
      cursor: shine ? 'pointer' : '',
      border: card.fx ? '1px solid yellow' : ''
    }">
    <div v-if="card.fxRed" :class="{ bgRed: 1, circle: 1, absolute: 1, fadeInOut: !card.fxTextCancelFadeout }"
      :style="getRedFxStyle(card)">
    </div>


    <div v-if="!card">No card</div>

    <!-- Card Image-->
    <img v-else-if="card.verso === true" :class="{ w100p: true, h100p: true, absolute: true }" draggable="false"
      :style="{ 'object-fit': 'cover', 'object-position': card.bgposition, 'pointer-events': 'none' }"
      :src="require('@/assets/' + folder + 'empty.webp')" />
    <img v-else :class="{ w100p: true, h100p: true, shine: shine, absolute: true }" draggable="false" :style="{
      'object-fit': 'cover',
      'object-position': card.bgposition,
      'pointer-events': 'none'
    }" :src="require('@/assets/' + folder + card.id + '.webp')" @mouseover="$emit('mouseover', card)"
      @contextmenu.prevent="$emit('clickright', card)" />

    <!-- fxText-->
    <div v-if="card.fxText"
      :class="{ absolute: 1, 'text-center': 1, 'text-center-vertical': 1, fontSize150em: 1, 'text-shadow-black': 1, fadeInOut: !card?.fxTextCancelFadeout }"
      :style="{ ...getRedFxStyle(card), 'mask-image': '', 'color': 'red' }">
      {{ card.fxText }}
    </div>

    <!-- stats-->
    <div v-if="!card.verso && !hidestat && (card.ap || card.hp)" class="w100p h100p"
      :style="{ transform: !card.position.rotation || card.position.rotation == 0 ? '' : 'rotate(-90deg)' }">
      <div class="absolute circle10px textVerticalCenter centerDiv colorBlack fontSize150em"
        style="width:70px; height:30px; top:-10px; background-color: #FFFFFFB0;">
        {{ card.ap }} - {{ card.hp }}
      </div>
    </div>

    <!-- red background-->
    <div class="w100p h100p absolute shine circle15px" v-if="card && card.dead"
      style="top:0px; background-color: #FF000050;">
    </div>
  </div>
</template>

<style scoped></style>

<script>
export default {
  name: 'game-card',
  props: ['card', 'folder', 'shine', 'hidestat'],
  methods: {
    getRedFxStyle(card) {
      if (!card)
        return {};
      return {
        opacity: card.fxTextCancelFadeout ? 1 : 0,
        left: '-100%',
        top: '-71.3%',
        width: (card.position.width * 3) + 'px', height: (card.position.width * 3) + 'px',
        'mask-image': 'radial-gradient(rgba(0 0 0 /0) 40%, black 45%, rgba(0 0 0 /0) 70%)'
      };
    }
  }
}
</script>