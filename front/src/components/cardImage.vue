<template>
    <div class="tooltip" style="position:relative; margin: 5px 5px -10px 5px !important; text-overflow: ellipsis;" @click="$emit('select', card)">
         <div v-if="tooltip==='text'" class="tooltipcard flex-row">
            <div class="hoverFontColor" style="font-size: 8px; cursor:pointer" @click="copyClipboard(card.NameEn);">
                {{card.NameEn}}
            </div>
            <div class="hoverFontColor" v-if="card.NameFr"  style="font-size: 8px; cursor:pointer" @click="copyClipboard(card.NameFr);">
                {{card.NameFr}}
            </div>
            <img :style="{ width: (size ? size*0.8 : 150*.8)+ 'px' }" :src="card.Image"/>
         </div>

         <div v-if="tooltip==='image'" class="tooltipcard">
            <div class="hoverFontColor" style="font-size: 8px; cursor:pointer; width:200px" @click="copyClipboard(card.NameEn);">
                {{card.NameEn}}
            </div>
            <div class="hoverFontColor" v-if="card.NameFr"  style="font-size: 8px; cursor:pointer; width:200px" @click="copyClipboard(card.NameFr);">
                {{card.NameFr}}
            </div>
            <img style="width:200px" :src="card.Image"/>
         </div>
        <div style="position:absolute; top:-5px; right:-5px;">
            <div class="">
                <div v-if="!badgeoff && card.Limit" class="s25" style="color:red; text-align:center; font-style:bold; border-radius:15px; background:black; outline: 5px solid red">
                    {{card.Limit}}
                </div>
                <div v-for="friend in card.LimitFriendsCards" v-bind:key="card.Id + 'Sub' + friend.Id + friend.RefId">
                    <img class="w25" :src="friend.Image" style="outline: 2px solid red; margin-top:8px" />
                </div>
            </div>
        </div>
        <img :style="{ width: (size ? size : 150)+ 'px' }" :src="card.Image"/>
    </div>
</template>
<style>
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 100%;
  height:100%;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
<script>
  export default {
    name: 'card-image',
    props: ['card', 'badgeoff', 'size', 'tooltip'],
    methods: {
        copyClipboard(text) {
            navigator.clipboard.writeText(text);
        }   
    }
  }
</script>
