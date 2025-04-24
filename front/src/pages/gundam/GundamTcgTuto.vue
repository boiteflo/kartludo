<template>
    <div class="bg2 h100p w100p fadeIn3sec">
      <game v-if="deck1 && deck2" :deck1="deck1" :deck2="deck2" :quickstart="quickstart" :tuto="true" @end="end"></game>
    </div>
  </template>
  <script>
  export default {
    name: 'StyledComponent'
  }
  </script>
  
  <script>
  import game from '../../games/game';
  
    export default {
    name: 'pageGundamTcgTuto',
    components: {game},
    data: () => ({
      deck1: null,
      deck2: null,
      quickstart: false
     }),
    mounted(){
      this.deck1 = '1xST01-005,1xST01-010,1xST01-005,1xGD01-004,1xST01-010,1xST01-002,1xST01-015,1xST02-010,39xGD01-099';
      this.deck2 = '2xST03-008,1xST03-011,1xGD01-031,1xGD01-026,1xST03-011,42xST03-008';
    },
    methods: { 
      end(isVictory){
        window.location.href = `/gundamTcg`;
      }
    }
    };
    </script>