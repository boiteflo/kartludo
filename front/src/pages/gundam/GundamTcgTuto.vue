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
      quickstart: false,
      deck:  "4xST01-001,4xST01-010,4xST01-015,2xGD01-009,4xGD01-013,4xST03-008,4xST03-011,4xST03-016,4xGD01-026,4xGD01-030,4xGD01-031,4xGD01-041,4xGD01-091"
     }),
    mounted(){
      this.deck1 = '1xST01-005,1xGD01-004,1xST01-010,47xST01-001';
      this.deck2 = '1xST03-011,1xGD01-031,48xST03-011';
    },
    methods: { 
      end(isVictory){
        window.location.href = `/gundamTcg`;
      }
    }
    };
    </script>