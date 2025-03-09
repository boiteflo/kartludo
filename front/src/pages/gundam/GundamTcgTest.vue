<template>
    <div class="bg2 h100p">
        <menu-bar-gundam :hide="true">
        </menu-bar-gundam>
        <game></game>
    </div>
</template>
<script>
export default {
    name: 'StyledComponent'
}
</script>

<script>
import menuBarGundam from '../../components/menuBarGundam';
import game from '../../games/game';

  export default {
  name: 'pageGundamTcgFight',
  components: {menuBarGundam, game},
  data: () => ({ }),
  mounted(){},
  methods: { }
  };
  </script>