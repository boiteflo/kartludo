<template>
  <div class="bg2 h100p w100p fadeIn3sec">
    <game v-if="texts && deck1 && deck2" :playerinfo="playerInfo" :texts="texts" :deck1="deck1" :deck2="deck2" :quickstart="quickstart" @end="end" :campaign="campaign"></game>
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
import game from '../../games/game';
import gundamTexts from '../../data/gundamTexts.json';

  export default {
  name: 'pageGundamTcgFight',
  components: {game},
  data: () => ({
    playerInfo: null,
    texts: null,
    deck1: null,
    deck2: null,
    quickstart: false //"8xC001,4xC002"
   }),
  mounted(){
    this.playerInfo = helperCookie.getLocalStorage('playerInfo');
    this.texts = gundamTexts[this.playerInfo.lang];
    this.deck1 = this.quickstart ? this.quickstart : helperCookie.getCookieString('deck1')?.split('_').join(',');
    this.deck2 = this.quickstart ? this.quickstart : helperCookie.getCookieString('deck2')?.split('_').join(','); 
    this.campaign = this.quickstart ? this.quickstart : helperCookie.getCookieString('campaign')==1; 
  },
  methods: { 
    end(isVictory){
      helperCookie.setCookieString('victory', isVictory);
      window.location.href = `/gundamTcg?continue=1`;
    }
  }
  };
  </script>