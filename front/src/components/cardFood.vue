<template>
  <v-card
    class="mx-auto my-12"
    max-width="374"
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>


    <v-img
      height="250"
      :src="food.img"
    ></v-img>


    <v-card-title>{{food.title}}</v-card-title>
  </v-card>
</template>


<script>
  export default {
    name: 'cardFood',
    props: ["food"],
  }
</script>


