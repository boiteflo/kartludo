<template>
    <div class="m5px" style="width:200px; height:250px; position:relative; overflow: hidden;">
        <img @click="$emit('select')" style="cursor:pointer; width: 350px; object-fit: cover; object-position: -75px -100px;" :src="image" />
        <div @click="$emit('select')" class="my-triangle-code" style="cursor:pointer; text-align:end">
            <div style="position:absolute; top:140px; right:5px; color:white; font-size:12px; width:200px">{{subtext}}</div>
            <div style="position:absolute; top:148px; right:5px; color:white; font-size:24px; width:200px">{{text}}</div>
        </div>
    </div>
</template>

<style>
  .my-triangle-code{
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
    props: ['image', 'text', 'subtext']
  }
</script>
