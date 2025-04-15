<template>
    <div class="bg2 h100p">
        <menu-bar-gundam :hide="step === 'game'">
        </menu-bar-gundam>
        <game v-if="step === 'game'"></game>

        <img v-if="isHorizontal" class="w100p h100p absolute"
            style="object-fit: cover" :src="require('@/assets/Gundam/wallpaper.webp')" />
        <img v-else class="w100p h100p absolute" style="object-fit: cover"
            :src="require('@/assets/Gundam/wallpaper2.webp')" />


        <div v-if="step === 'menu'" class="absolute h100p colorBlack text-center"
            style="left:10%; width:300px; background-color: rgba(255,255,255,0.5);">
            <h2 style="background-color: transparent !important; color:black; padding: 50px;">
                GUNDAM TCG
            </h2>
            <v-btn class="w100p" hide-details
                style="margin-top:10px; height: 60px; background-color: rgba(200,200,200,0.75);">
                TUTORIEL
            </v-btn>
            <v-btn class="w100p" hide-details
                style="margin-top:10px; height: 60px; background-color: rgba(200,200,200,0.75);">
                DECKLISTS
            </v-btn>
            <v-btn class="w100p" hide-details @click="duel"
                style="margin-top:10px; height: 60px; background-color: rgba(200,200,200,0.75);">
                DUEL
            </v-btn>
            <v-btn class="w100p" hide-details
                style="margin-top:10px; height: 60px; background-color: rgba(200,200,200,0.75);">
                CAMPAIGN
            </v-btn>
            <v-btn class="w100p" hide-details
                style="margin-top:10px; height: 60px; background-color: rgba(200,200,200,0.75);">
                CREATION
            </v-btn>
            <div class="w100p textVerticalCenter"
                style="margin-top:10px; height:60px; background-color: rgba(200,200,200,0.75);">
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