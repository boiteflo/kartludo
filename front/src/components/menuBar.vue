<template>
<div>
    <v-app-bar app dark color="black" >
      <div style="width:300px; position:absolute; bottom:0px; top:0px; left:90px; overflow: hidden;">
        <img :style="{width:$vuetify.breakpoint.width >= 950 ? 150 + 'px' :130 + 'px', 'object-fit': 'cover'}" :src="require('../assets/header.png')"/>
      </div>
      <v-app-bar-nav-icon variant="text" @click="showDrawer=true"></v-app-bar-nav-icon>
      <router-link to="/">
        <v-btn
          target="_blank"
          style="position:relative"
          text
          @click="unselect()"
        >
          <h3 style="position:absolute; top:-15px; letter-spacing:5px">MDOS</h3>
          <span style="position:absolute; top:5px; left:-17px; font-size:10px">{{version}}</span>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>
      
      <template v-if="$vuetify.breakpoint.width >= 800">
        <v-btn class="bg2 s32 m5px" @click="$emit('filter')" style="min-width:32px">
          <v-icon :style="{color: filteractive ? 'red' : 'white'}"> mdi-filter</v-icon>
        </v-btn>
        <v-text-field class="flex-grow"
                      hide-details
                      v-model="searchString"
                      label="Chercher une carte (FR ou EN)"
                      @input="$emit('search', $event)">
        </v-text-field>
        <v-combobox v-model="store.formatSelected" 
          label="Format" 
          :items="store.formats" 
          item-text="Title"
          hide-details
          style="margin: 0px 5px 0px 5px; width:100px;"
          @input="$emit('format', store.formatSelected)">
        </v-combobox>
      </template>
      
      <link-button v-for="link in links" 
        :key="'menuBarr' +link.Text" 
        :url="link.Url" 
        :external="link.external" 
        :text="$vuetify.breakpoint.width >= 1050 ? link.Text : ''" 
        :icon="link.Icon"
        @click="unselect()">
      </link-button>

    </v-app-bar>

    <template v-if="$vuetify.breakpoint.width < 800"> 
      <v-combobox class="flex-grow m5px"
        v-model="store.formatSelected" 
        label="Format" 
        :items="store.formats" 
        item-text="Title"
        hide-details
        @input="$emit('format', store.formatSelected)">
      </v-combobox>     
      <div class="flex">
        <v-btn class="w32" @click="$emit('filter')" style="height:50px;">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
        <v-text-field class="flex-grow m5px"
                      hide-details
                      v-model="searchString"
                      label="Chercher une carte (FR ou EN)"
                      @input="$emit('search', $event)">
        </v-text-field>
      </div>
    </template>

      <v-navigation-drawer v-model="showDrawer" absolute temporary color="black">
        
        <img style="width:400px; height:600px; object-position: -100px 00px; object-fit:cover; position:absolute;" :src="require('../assets/menu.png')"/>
        <br>
        <div>
          <router-link to="/">
            <v-btn
              target="_blank"
              text
              @click="unselect()"
            >
              <v-icon class="colorWhite">mdi-cards</v-icon>
              <h3 class="colorWhite">MD - OLD SCHOOL</h3>
            </v-btn>
          </router-link>
          <link-button v-for="link in links" 
            :key="'navigationDrawer' +link.Text" 
            :url="link.Url" 
            :external="link.external" 
            :text="link.Text" 
            :icon="link.Icon"
            class="m5px w100p"
            @click="unselect()">
          </link-button>
        </div>
      </v-navigation-drawer>
</div>
</template>

<script>
import { store } from '../data/store.js'

import linkButton from './linkButton';

  export default {
    name: 'menuBar',
    components : {linkButton},
    props: ['filteractive', 'version'],
    data: () => ({
        store : store,
        searchString: '',
        showDrawer: false,
        links : [
          {Text: 'Decks', Icon: 'mdi-cards-outline', Url:'/decks'},
          {Text: 'Cubes', Icon: 'mdi-cube', Url:'/cubes'},
          {Text: 'Outils', Icon: 'mdi-hammer-wrench', Url:'/tool'},
          {Text: 'Discord', Icon: 'mdi-chat', Url:'https://discord.gg/zouloux', External:true},
        ]
    }),
    methods:{
      unselect(){
        this.searchString = '';
        this.$emit('search', '');
      }
    }
  }
</script>
