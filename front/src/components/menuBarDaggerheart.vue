<template>
  <div>
    <v-app-bar app dark color="black">
      <div style="width:300px; position:absolute; bottom:0px; top:5px; left:250px; overflow: hidden;">
        <img style="width:100px; object-fit:cover;" :src="require('../assets/Daggerheart/other/logo.png')" />
      </div>
      <v-app-bar-nav-icon variant="text" @click="showDrawer = true"></v-app-bar-nav-icon>
      <router-link to="/daggerheart">
        <v-btn target="_blank" style="position:relative" text @click="unselect()">
          <h3 style="position:absolute; left:0px; top:-15px; letter-spacing:5px">DAGGERHEART</h3>
          <span style="position:absolute; top:5px; left:0px; font-size:10px">{{ version }}</span>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <link-button v-for="link in links" :key="'menuBarr' + link.Text" :url="link.Url" :external="link.external"
        :text="$vuetify.breakpoint.width >= 1050 ? link.Text : ''" :icon="link.Icon" @click="unselect()">
      </link-button>

    </v-app-bar>

    <v-navigation-drawer v-model="showDrawer" absolute temporary color="black">

      <img style="width:300px; height:400px; object-position: -50px 00px; object-fit:cover; position:absolute;"
        :src="require('../assets/Daggerheart/other/logo.png')" />
      <br>
      <div>
        <router-link to="/daggerheart">
          <v-btn target="_blank" text>
            <h3 class="colorWhite">DAGGERHEART</h3>
          </v-btn>
        </router-link>
        <link-button v-for="link in links" :key="'navigationDrawer' + link.Text" :url="link.Url"
          :external="link.external" :text="link.Text" :icon="link.Icon" class="m5px w100p" @click="unselect()">
        </link-button>
      </div>
    </v-navigation-drawer>
    <div v-if="$vuetify.breakpoint.width >= 800" class="bg" style="height:60px;"></div>
    <div v-if="$vuetify.breakpoint.width < 800" class="bg" style="height:20px;"></div>
  </div>
</template>

<script>
import { store } from '../data/store.js'

import linkButton from './linkButton';

export default {
  name: 'menuBarDaggerheart',
  components: { linkButton },
  props: ['filteractive'],
  data: () => ({
    store: store,
    version : '',
    searchString: '',
    showDrawer: false,
    links: [
      { Text: 'PERSONNAGE', Icon: 'mdi-account', Url: '/character' },
      { Text: 'CARTES', Icon: 'mdi-cards', Url: '/cards' },
      { Text: 'CREATEUR', Icon: 'mdi-image-multiple', Url: '/template' },
      { Text: 'FIGHT', Icon: 'mdi-sword', Url: '/fight' },
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