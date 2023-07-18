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
        >
          <v-icon>mdi-cards</v-icon>
          <h3>MD - OLD SCHOOL</h3>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>
      <v-text-field v-if="$vuetify.breakpoint.width >= 800"
                    class="flex-grow"
                    hide-details
                    label="Chercher une carte (FR ou EN)"
                    @input="$emit('search', $event)">
      </v-text-field>

      <router-link to="/deck">
        <v-btn
          target="_blank"
          text
        >
          <v-icon>mdi-cards-outline</v-icon>
          <span class="mr-2">Decks</span>
        </v-btn>
      </router-link>

      <router-link to="/duel">
        <v-btn
          target="_blank"
          text
        >
          <v-icon>mdi-fencing</v-icon>
          <span class="mr-2">Duel</span>
        </v-btn>
      </router-link>

      <router-link to="/Boosters">
        <v-btn
          target="_blank"
          text
        >
          <v-icon>mdi-library-shelves</v-icon>
          <span class="mr-2">Boosters</span>
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
    <v-text-field v-if="$vuetify.breakpoint.width < 800"
                  class="flex-grow m5px"
                  hide-details
                  label="Chercher une carte (FR ou EN)"
                  @input="$emit('search', $event)">
    </v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'menuBar'
  }
</script>
