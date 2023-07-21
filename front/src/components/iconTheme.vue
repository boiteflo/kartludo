<template>
    <div class="m5px" style="width:200px; height:250px; position:relative;">
        
        <!--
     <v-parallax height="300" :src="image"></v-parallax>
        <v-img
            :width="200" height="350"
            aspect-ratio="1"
            cover
            :src="image">
        </v-img>
        -->
        <div class="" style="width:200px; height:160px; top:250px; position:absolute; background:white"></div>
        <div class="" style="width:95px; height:410px; left:200px; position:absolute; background:white"></div>
        <img @click="$emit('select')" style="cursor:pointer; width: 300px; height: 500px; object-fit: cover; object-position: -70px -90px;" :src="image" />
        <div @click="$emit('select')" class="triangle-code" style="cursor:pointer;">
            <div style="position:absolute; top:148px; right:5px; color:white; font-size:24px">{{text}}</div>
        </div>
    </div>
</template>

<style>
  .triangle-code{
    display : inline-block;
    height : 0;
    width : 0;
    position:absolute;
    left:70px;
    top:70px;
    border-bottom : 180px solid #212a3cD0;
    border-left : 130px solid transparent;
   }
</style>

<script>
  export default {
    name: 'icon-theme',
    props: ['image', 'text']
  }
</script>
