<template>
  <div>
    <v-app-bar
      app
      color="#212A3C"
      dark
    >
      <router-link to="/">
        <v-btn
          target="_blank"
          text
          @click="unselect"
        >
          <v-icon>mdi-cards</v-icon>
          <h3>MD - OLD SCHOOL</h3>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>
      <template v-if="$vuetify.breakpoint.width >= 800">
        <v-btn class="bg s32 m5px" @click="$emit('filter')" style="min-width:32px">
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
          @input="selectFormat">
        </v-combobox>
      </template>

      <router-link to="/decks">
        <v-btn
          target="_blank"
          text
          @click="unselect"
        >
          <v-icon>mdi-cards-outline</v-icon>
          <span class="mr-2">Decks</span>
        </v-btn>
      </router-link>
      
      <a href="https://discord.gg/zouloux">
        <v-btn
          target=""
          text
        >
          <v-icon>mdi-chat</v-icon>
          <span class="mr-2">Discord</span>
        </v-btn>
      </a>
    </v-app-bar>
    <template v-if="$vuetify.breakpoint.width < 800"> 
      <v-combobox class="flex-grow m5px"
        v-model="store.formatSelected" 
        label="Format" 
        :items="store.formats" 
        item-text="Title"
        hide-details
        @input="selectFormat">
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
  </div>
</template>

<script>
import { store } from '../data/store.js'
import ServiceFormat from '../services/serviceFormat'

  export default {
    name: 'menuBar',
    props: ['filteractive'],
    data: () => ({
        store : store,
        searchString: '',
    }),
    methods:{
      unselect(){
        this.searchString = '';
        this.$emit('search', '');
      },
      selectFormat(format){
        let result = ServiceFormat.setFormat(format, store.cards);
        store.format = result.format;
        store.cards = result.cards;
      }
    }
  }
</script>
