<template>
    <div class="m5px" style="width:137px; height:170px; position:relative; overflow: hidden;">
        <img @click="$emit('select')" style="cursor:pointer; width: 220px; object-fit: cover; object-position: -40px -58px;" :src="image" />
        <img v-if="cardObj" @click="$emit('select')" style="cursor:pointer; width: 220px; object-fit: cover; object-position: -40px -58px;" :src="cardObj.ImageMDM" />
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
    border-bottom : 135px solid #212a3cD0;
    border-left : 98px solid transparent;
   }  
   
  .themeTitle{
    position:absolute;
    text-align: end;
    top:95px; 
    right:5px; 
    color:white; 
    font-size:16px; 
    width:130px; 
    height:40px; 
    line-height:17px;
  }
   
  .themeText1{
    position:absolute;
    text-align: end;
    top:75px; 
    right:5px; 
    color:white; 
    font-size:12px; 
    width:130px; 
  }
   
  .themeText2{
    position:absolute;
    text-align: end;
    top:60px; 
    right:5px; 
    color:white; 
    font-size:10px; 
    width:130px; 
  }
</style>

<script>
import helperString from '../helpers/helperString'

  export default {
    name: 'icon-card',
    props: ['image', 'cards', 'card', 'text', 'text1', 'text2'],
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
