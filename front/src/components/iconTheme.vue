<template>
    <div class="m5px" style="width:275px; height:340px; position:relative; overflow: hidden;">
        <img @click="$emit('select')" style="cursor:pointer; width: 440px; object-fit: cover; object-position: -80px -115px;" :src="image" />
        <div @click="$emit('select')" class="my-triangle-code" style="cursor:pointer; text-align:end">
            <span class="themeText2">{{text2}}</span>
            <span class="themeText1">{{text1}}</span>
            <div class="themeTitle">{{text}}</div>
        </div>
    </div>
</template>

<style scoped>
  .my-triangle-code{
    display : inline-block;
    height : 0;
    width : 0;
    position:absolute;
    right:0px;
    bottom:0px;
    border-bottom : 270px solid #212a3cD0;
    border-left : 195px solid transparent;
   }  
   
  .themeTitle{
    position:absolute;
    text-align: end;
    top:180px; 
    right:5px; 
    color:white; 
    font-size:24px; 
    width:200px; 
    height:80px; 
  }
   
  .themeText1{
    position:absolute;
    text-align: end;
    top:160px; 
    right:5px; 
    color:white; 
    font-size:16px; 
    width:200px; 
  }
   
  .themeText2{
    position:absolute;
    text-align: end;
    top:135px; 
    right:5px; 
    color:white; 
    font-size:16px; 
    width:200px; 
  }
</style>

<script>
  export default {
    name: 'icon-theme',
    props: ['image', 'text', 'text1', 'text2']
  }
</script>
