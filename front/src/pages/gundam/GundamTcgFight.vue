<template>
  <div class="bg2 h100p w100p fadeIn3sec">
    <game v-if="deck1 && deck2" :deck1="deck1" :deck2="deck2" :quickstart="quickstart" @end="end"></game>
  </div>
</template>
<script>
export default {
  name: 'StyledComponent'
}
</script>

<script>
import helperCookie from '../../helpers/helperCookie';
import helperParamUrl from '../../helpers/helperParamUrl';
import { storeMini } from '../../data/storeMini.js'
import game from '../../games/game';

  export default {
  name: 'pageGundamTcgFight',
  components: {game},
  data: () => ({
    store:storeMini,
    deck1: null,
    deck2: null,
    quickstart:false
   }),
  mounted(){
    // const deck = "4xST01-001,4xST01-010,4xST01-015,2xGD01-009,4xGD01-013,4xST03-008,4xST03-011,4xST03-016,4xGD01-026,4xGD01-030,4xGD01-031,4xGD01-041,4xGD01-091";
    this.deck1 = helperCookie.getCookieString('deck1')?.split('_').join(',');
    this.deck2 = helperCookie.getCookieString('deck2')?.split('_').join(','); 
  },
  methods: { 
    end(isVictory){
      helperCookie.setCookieString('victory', isVictory);
      window.location.href = `/gundamTcg?continue=1`;
    }
  }
  };
  </script>