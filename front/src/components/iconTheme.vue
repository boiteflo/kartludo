<template>
    <div class="m5px" style="width:275px; height:340px; position:relative; overflow: hidden;">
        <img v-if="image" @click="$emit('select')" style="cursor:pointer; width: 440px; object-fit: cover; object-position: -80px -115px;" :src="image" />
        <img v-else-if="cardObj && cardObj.ImageMDM" @click="$emit('select')" style="cursor:pointer; width: 440px; object-fit: cover; object-position: -80px -115px;" :src="cardObj.ImageMDM" />
        <div @click="$emit('select')" class="my-triangle-code" style="cursor:pointer; text-align:end">
            <span class="themeText3">{{text3}}</span>
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
    text-shadow: black 1px 0 10px;
   }  
   
  .themeTitle{
    position:absolute;
    text-align: end;
    top:190px; 
    right:5px; 
    color:white; 
    font-size:26px; 
    width:250px; 
    height:80px; 
    line-height: 26px;
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
  }
   
  .themeText1{
    position:absolute;
    text-align: end;
    top:160px; 
    right:5px; 
    color:white; 
    font-size:16px; 
    width:250px; 
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
  }
   
  .themeText2{
    position:absolute;
    text-align: end;
    top:135px; 
    right:5px; 
    color:white; 
    font-size:16px; 
    width:250px; 
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
  }
   
  .themeText3{
    position:absolute;
    text-align: end;
    top:110px; 
    right:5px; 
    color:white; 
    font-size:16px; 
    width:250px; 
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
  }
</style>

<script>
import helperString from '../helpers/helperString'

  export default {
    name: 'icon-theme',
    props: ['image', 'cards', 'card', 'text', 'text1', 'text2', 'text3'],
    data: () => ({
        cardObj: null
    }),
    mounted() {
      if(this.card && this.cards){
        this.cardObj= this.cards.find(x=> x.IdName === helperString.cleanup(this.card));
      }
    }
  }
</script>
