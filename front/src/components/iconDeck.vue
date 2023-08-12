<template>
    <div class="m5px" style="width:150px; height:150px; position:relative; overflow: hidden;">
        <img @click="$emit('select')" 
            style="cursor:pointer; width: 210px; object-fit: cover; object-position: -30px -55px;" 
            :src="deck.MainCardImage" 
        />
        <div @click="$emit('select')" class="triangle-code" style="cursor:pointer; text-align:end">
            <v-icon v-if="deck.Errors && deck.Errors.length > 0" color="red" style="position:absolute; top:5px; right:5px; font-size:30px;">mdi-alert</v-icon>
            <v-icon v-if="deck.IdTournament" style="position:absolute; top:45px; right:5px; font-size:16px; color:white">mdi-trophy</v-icon>
            <v-icon v-else-if="deck.IsDraft" style="position:absolute; top:45px; right:5px; font-size:16px; color:white">mdi-wrench</v-icon>      
            <div style="position:absolute; top:65px; right:5px; color:white; font-size:10px; width:150px">{{deck.Format}}</div>
            <div style="position:absolute; top:85px; right:5px; color:white; font-size:10px; width:150px">{{deck.Author}}</div>
            <div style="position:absolute; top:100px; right:5px; color:white; font-size:18px; width:150px">{{deck.Title}}</div>
        </div>
        <div v-if="rarity" style="position:absolute; bottom:2px; right:2px;" class="flex">
            <div style="background:#9E9E9E; color:white; font-weight:bold; width:30px; height:15px; font-size:10px; text-align:center; font-style:bold">
              {{formatInt(deck.N,2)}}N
            </div>
            <div style="background:#3F51B5; color:white; font-weight:bold; width:30px; height:15px; font-size:10px; text-align:center; font-style:bold">
               {{formatInt(deck.R,2)}}R
            </div>
            <div style="background:#FFA000; color:white; font-weight:bold; width:30px; height:15px; font-size:10px; text-align:center; font-style:bold">
               {{formatInt(deck.SR,2)}}SR
            </div>
            <div style="background:#673AB7; color:white; font-weight:bold; width:30px; height:15px; font-size:10px; text-align:center; font-style:bold">
              {{formatInt(deck.UR,2)}}UR
            </div>
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
import helperString from '../helpers/helperString'

  export default {
    name: 'icon-deck',
    props: ['deck', 'rarity'],
    methods: {
      formatInt(value){return helperString.formatInt(value,2);}
    }
  }
</script>
