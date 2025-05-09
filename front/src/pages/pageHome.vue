<template>
  <div class="bg2 h100p">
      <h1>BIENVENUE</h1>
      <h2>Choisissez votre centre d'intérêt</h2>

      <div class="flex flex-responsive flex-space-around p5px h100p" style="background-color: black;">
          <router-link to="/yugioh">
              <button-big 
                  text="Yu-Gi-Oh!"
                  :image="require('@/assets/menu.png')">
              </button-big>
          </router-link>
          <router-link to="/daggerheart">
              <button-big 
                  text="Daggerheart"
                  :image="require('@/assets/Daggerheart/other/logo.png')">
              </button-big>
          </router-link>
          <router-link to="/gundamTcg">
              <button-big 
                  text="Gundam"
                  :image="require('@/assets/Gundam/GundamLogo2.png')">
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
import buttonBig from '../components/buttonBig';

export default {
name: 'pageHome',
components: {buttonBig},
data: () => ({ }),
mounted(){},
methods: { }
};
</script>