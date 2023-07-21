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

         <div v-if="tooltip==='image'" class="tooltipcard" style="font-size:8px">
            <div class="hoverFontColor" :style="{'cursor':'pointer', width: (size ? size : 150) +'px'}" @click="copyClipboard(card.NameEn);">
                {{card.NameEn}}
            </div>
            <div class="hoverFontColor" v-if="card.NameFr"  :style="{'cursor':'pointer', width: (size ? size : 150) +'px'}" @click="copyClipboard(card.NameFr);">
                {{card.NameFr}}
            </div>
            <img style="max-width:250px !important" :src="card.Image"/>
         </div>
        <div style="position:absolute; top:-5px; right:-5px;">
            <div v-if="!badgeoff && card.Limit" class="s25" style="color:red; text-align:center; font-style:bold; border-radius:15px; background:black; outline: 5px solid red">
                {{card.Limit}}
            </div>
        </div>
        <img :style="{ width: (size ? size : 150)+ 'px' }" :src="card.Image"/>
        
        <img :style="{ width: (size ? size : 150)+ 'px' }" 
              v-if="x2" 
              :src="card.Image" 
              style="position:absolute; top:18px; left:0px"
              @click="$emit('select', cardObject.Card)"/>
    </div>
</template>

<script>
  export default {
    name: 'card-image',
    props: ['card', 'badgeoff', 'size', 'tooltip', 'x2'],
    methods: {
        copyClipboard(text) {
            navigator.clipboard.writeText(text);
        }   
    }
  }
</script>
