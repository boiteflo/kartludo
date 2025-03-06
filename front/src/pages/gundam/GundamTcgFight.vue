<template>
    <div class="bg2 h100p">
        <menu-bar-gundam :hide="true">
        </menu-bar-gundam>
        <game-gundam></game-gundam>
    </div>
</template>
<script>
export default {
    name: 'StyledComponent'
}
</script>

<script>
import menuBarGundam from '../../components/menuBarGundam';
import gameGundam from '../../games/gundam/gameGundam';

  export default {
  name: 'pageGundamTcgFight',
  components: {menuBarGundam, gameGundam},
  data: () => ({ }),
  mounted(){},
  methods: { }
  };
  </script>