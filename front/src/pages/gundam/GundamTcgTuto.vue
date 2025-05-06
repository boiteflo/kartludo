<template>
  <div class="bg2 h100p w100p fadeIn3sec">
    <game v-if="texts && deck1 && deck2" :playerinfo="playerInfo" :texts="texts" :deck1="deck1" :deck2="deck2" :quickstart="quickstart" :tuto="true" @end="end">      
    </game>
  </div>
</template>
<script>
export default {
  name: 'StyledComponent'
}
</script>

<script>
    import helperCookie from '../../helpers/helperCookie';
    import game from '../../games/game';
    import gundamTexts from '../../data/gundamTexts.json';
  
    export default {
    name: 'pageGundamTcgTuto',
    components: {game},
    data: () => ({
      playerInfo: null,
      texts: null,
      deck1: null,
      deck2: null,
      quickstart: false
     }),
    mounted(){
      this.playerInfo = helperCookie.getLocalStorage('playerInfo');
      this.texts = gundamTexts[this.playerInfo.lang];
      this.deck1 = '1xGD01-088,1xST01-002,1xST01-005,1xGD01-004,1xST01-010,1xST01-001,1xGD01-099,1xST01-015,1xST01-010,1xST01-015,42xST01-001';
      this.deck2 = '2xST03-008,1xST03-011,1xGD01-031,3xST03-008,1xGD01-026,44xST03-008';
    },
    methods: { 
      end(isVictory){
        window.location.href = `/gundamTcg`;
      }
    }
    };
    </script>