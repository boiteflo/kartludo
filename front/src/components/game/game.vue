<template>
  <div class="relative bgWhite" style="width:100%; aspect-ratio : 16/9">
    <gameCard v-for="(card, index) in cards" :key="'C' + index" :id="'C' + index" :card="card" folder="Gundam/cards/"
      :x="getPosX(index)" :y="600">
    </gameCard>
  </div>

</template>

<script>
import helperAnimation from '../../helpers/helperAnimation';
import gameCard from './gameCard';

export default {
  name: 'canvas-game',
  props: ['img'],
  components: { gameCard },
  data: () => ({
    cardObj: null,
    cards: "ST02-015,GD01-028,GD01-034,GD01-040,GD01-041,GD01-091,GD01-107,ST02-001,ST02-002,ST02-005,ST02-010,ST02-012,ST02-013".split(',')
  }),
  mounted() {
    for(let i =0; i< 3; i++)
      helperAnimation.animate('C' + (i+10), null, { x: this.getPosX(i), y: 750 }, false, 1000);
  },
  methods: { 
    getWidth(){return this.$vuetify.breakpoint.width;},
    getCardWidth() {return this.getWidth() * 0.1;},
    getCardHeigth() {return this.getCardWidth() * 150/107;},
    getPosX(index){return index * this.getCardWidth();},
    getPosY(index){return index * this.getCardHeigth();},
  }
}
</script>
