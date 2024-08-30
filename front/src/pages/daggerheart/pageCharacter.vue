<template>
    <div class="bg2 h100p">
        <menu-bar-daggerheart>
        </menu-bar-daggerheart>
        <h1>Créer un personnage</h1>

        <div class="flex flex-responsive flex-space-around m5px">
            <router-link to="/character">
                <button-big 
                    text="Créer un personnage"
                    :image="require('@/assets/Daggerheart/other/character.png')">
                </button-big>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: 'StyledComponent'
}
</script>

<script>
import menuBarDaggerheart from '../../components/menuBarDaggerheart';
import buttonBig from '../../components/buttonBig';

  export default {
  name: 'pageCharacter',
  components: {menuBarDaggerheart, buttonBig},
  data: () => ({ }),
  mounted(){},
  methods: { }
  };
  </script>