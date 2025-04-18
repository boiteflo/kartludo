<template>
  <div class="bg2 h100p w100p fadeIn3sec">
    <menu-bar-gundam :hide="true">
    </menu-bar-gundam>
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
import menuBarGundam from '../../components/menuBarGundam';
import helperParamUrl from '../../helpers/helperParamUrl';
import { storeMini } from '../../data/storeMini.js'
import game from '../../games/game';

  export default {
  name: 'pageGundamTcgFight',
  components: {menuBarGundam, game},
  data: () => ({
    store:storeMini,
    deck1: null,
    deck2: null,
    quickstart:false
   }),
  mounted(){
    this.deck1 = helperCookie.getCookieString('deck1').split('_').join(',');
    this.deck2 = helperCookie.getCookieString('deck2').split('_').join(','); 
  },
  methods: { 
    end(isVictory){
      helperCookie.setCookieString('victory', isVictory);
      window.location.href = `/gundamTcg?continue=1`;
    }
  }
  };
  </script>