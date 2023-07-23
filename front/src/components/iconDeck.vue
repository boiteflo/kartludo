<template>
    <div class="m5px" style="width:150px; height:150px; position:relative; overflow: hidden;">
        <img @click="$emit('select')" 
            style="cursor:pointer; width: 210px; object-fit: cover; object-position: -30px -55px;" 
            :src="deck.MainCardsImages[0]" 
        />
        <div @click="$emit('select')" class="triangle-code" style="cursor:pointer; text-align:end">
            <div style="position:absolute; top:65px; right:5px; color:white; font-size:10px; width:150px">{{text}}</div>
            <div style="position:absolute; top:85px; right:5px; color:white; font-size:10px; width:150px">{{deck.Author}}</div>
            <div style="position:absolute; top:100px; right:5px; color:white; font-size:18px; width:150px">{{deck.Title}}</div>
        </div>
    </div>
</template>

<style>
  .triangle-code{
    display : inline-block;
    height : 0;
    width : 0;
    position:absolute;
    left:0px;
    top:0px;
    border-bottom : 150px solid #212a3cD0;
    border-left : 150px solid transparent;
   }   
</style>

<script>
  export default {
    name: 'icon-deck',
    props: ['deck', 'text']
  }
</script>
