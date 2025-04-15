<template>
    <div class="bg2 h100p w100p">
        <menu-bar-gundam :hide="step === 'game'">
        </menu-bar-gundam>
        <game v-if="step === 'game'"></game>

        <img v-if="isHorizontal" class="w100p h100p absolute" style="object-fit: cover"
            :src="require('@/assets/Gundam/wallpaper.webp')" />
        <img v-else class="w100p h100p absolute" style="object-fit: cover"
            :src="require('@/assets/Gundam/wallpaper2.webp')" />


        <div v-if="step === 'menu'" :class="{ absolute: 1, h100p: isHorizontal, colorBlack: 1, 'text-center': 1 }"
            :style="{ left: '10%', width: isHorizontal ? '300px' : '80%', 'background-color': isHorizontal ? 'rgba(255,255,255,0.5)' : 'transparent' }">
            <div class="fontSize2em bold colorWhite"
                :style="{ color: 'black', 'padding-top': isHorizontal ? '50px' : '200px', 'padding-bottom': isHorizontal ? '20px' : '50px' }">
                GUNDAM TCG
            </div>
            <v-btn class="w100p" hide-details
                style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                TUTORIEL
            </v-btn>
            <v-btn class="w100p" hide-details
                style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                DECKLISTS
            </v-btn>
            <v-btn class="w100p" hide-details @click="duel"
                style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                DUEL
            </v-btn>
            <v-btn class="w100p" hide-details
                style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                CAMPAIGN
            </v-btn>
            <v-btn class="w100p" hide-details
                style="margin-top:20px; height: 60px; background-color: rgba(200,200,200,0.75);">
                CREATION
            </v-btn>
            <div class="w100p textVerticalCenter"
                style="margin-top:20px; height:60px; background-color: rgba(200,200,200,0.75);">
                By FlorentOutan - 2025
            </div>
        </div>
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
  data: () => ({
    step: 'menu',
    isHorizontal: true
   }),
  mounted(){
    this.isHorizontal= this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height;
  },
  methods: { 
    duel(){
        this.step = 'game';
    }
  }
  };
  </script>