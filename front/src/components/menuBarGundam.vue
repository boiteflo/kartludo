<template>
  <div>
    <v-app-bar v-if="!hide" app dark color="black">
      <div style="width:320px; position:absolute; bottom:0px; top:0px; left:160px; overflow: hidden;">
        <img style="width:100px; " :src="require('../assets/Gundam/wingzero2.gif')" />
      </div>
      <div class="" style="width:100px; position:absolute; bottom:0px; top:0px; left:120px; overflow: hidden;">
        <img style="width:100px; height:100%" :src="require('../assets/gradientBlack.png')" />
      </div>
      
      <v-app-bar-nav-icon variant="text" @click="showDrawer = true"></v-app-bar-nav-icon>
      <router-link to="/gundam">
        <v-btn target="_blank" style="position:relative" text @click="unselect()">
          <h3 style="position:absolute; left:0px; top:-15px; letter-spacing:5px">GUNDAM</h3>
          <span style="position:absolute; top:5px; left:0px; font-size:10px">{{ version }}</span>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <link-button v-for="link in links" :key="'menuBarr' + link.Text" :url="link.Url" :external="link.external"
        :text="$vuetify.breakpoint.width >= 1050 ? link.Text : ''" :icon="link.Icon" @click="unselect()">
      </link-button>

    </v-app-bar>
    <div v-else class="absolute">
      <v-app-bar-nav-icon style="z-index:10" variant="text" @click="showDrawer = true"></v-app-bar-nav-icon>
    </div>

    <v-navigation-drawer v-model="showDrawer" absolute temporary color="black">

      <img style="width:300px; height:400px; object-position: -50px 00px; object-fit:cover; position:absolute;"
        :src="require('../assets/Gundam/GundamLogo2.png')" />
      <br>
      <div>
        <router-link to="/daggerheart">
          <v-btn target="_blank" text>
            <h3 class="colorWhite">Gundam</h3>
          </v-btn>
        </router-link>
        <link-button v-for="link in links" :key="'navigationDrawer' + link.Text" :url="link.Url"
          :external="link.external" :text="link.Text" :icon="link.Icon" class="m5px w100p" @click="unselect()">
        </link-button>
      </div>
    </v-navigation-drawer>
    <div v-if="!hide && $vuetify.breakpoint.width >= 800" class="bg" style="height:60px;"></div>
    <div v-if="!hide && $vuetify.breakpoint.width < 800" class="bg" style="height:20px;"></div>
  </div>
</template>

<script>
import { store } from '../data/store.js'

import linkButton from './linkButton';

export default {
  name: 'menuBarGundam',
  components: { linkButton },
  props: ['filteractive', 'hide'],
  data: () => ({
    store: store,
    version : '',
    searchString: '',
    showDrawer: false,
    links: [
      { Text: 'Encyclopédie', Icon: 'mdi-book', external:true, Url: 'https://docs.google.com/presentation/d/13EMZDLqcDxfhsLHIzuKSSBsFIvNwjc2QLpWlew3B8Bk/edit?usp=drive_link' },
      { Text: 'Cartes', Icon: 'mdi-cards', Url: '/gundamTcgFight' },
    ]
  }),
  mounted(){
    this.version = this.$version;
  },
  methods: {
  }
}
</script><span class="material-symbols-outlined">

</span>