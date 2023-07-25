<template>
    <div class="tooltip" 
        style="position:relative; margin: 5px 5px -10px 5px !important; text-overflow: ellipsis; cursor:pointer" 
        @click="$emit('select', card)"
        @mouseover="$emit('hover', card)">
        <div v-if="showname" style="font-size: 16px; cursor:pointer; color:white; text-align:center" class="bg2">
            <div class="p5px hoverFontColor" @click="copyClipboard(card.NameEn);">
                {{card.NameEn}}
            </div>
            <div class="p5px hoverFontColor" @click="copyClipboard(card.NameFr);">
                {{card.NameFr}}
            </div>
        </div>
        <div class="tooltipcard" v-if="card.IdName === 'exodiatheforbiddenone'">            
                <img style="width:100px !important; top:140px; left:60px; position:absolute" src="https://images.ygoprodeck.com/images/cards/44519536.jpg"/>
                <img style="width:100px !important; top:140px; left:-40px; position:absolute" src="https://images.ygoprodeck.com/images/cards/8124921.jpg"/>
                <img style="width:120px !important; top:0px; left:-80px; position:absolute" src="https://images.ygoprodeck.com/images/cards/70903634.jpg"/>
                <img style="width:120px !important; top:0px; left:80px; position:absolute" src="https://images.ygoprodeck.com/images/cards/7902349.jpg"/>
                <img style="width:100px !important; top:5px; left:10px; position:absolute" src="https://images.ygoprodeck.com/images/cards/33396948.jpg"/>
        </div>
        <div v-else>
            <div v-if="tooltip==='text'" class="tooltipcard flex-row">
                <div class="hoverFontColor" style="font-size: 8px; cursor:pointer" @click="copyClipboard(card.NameEn);">
                    {{card.NameEn}}
                </div>
                <div class="hoverFontColor" style="font-size: 8px; cursor:pointer" @click="copyClipboard(card.NameFr);">
                    {{card.NameFr}}
                </div>
                <img :style="{ width: (size ? size*0.8 : 150*.8)+ 'px' }" :src="card.Image"/>
            </div>

            <div v-if="tooltip==='image'" class="tooltipcard" style="font-size:8px">
                <div class="hoverFontColor" :style="{'cursor':'pointer', width: (size ? size : 150) +'px'}" @click="copyClipboard(card.NameEn);">
                    {{card.NameEn}}
                </div>
                <div class="hoverFontColor" :style="{'cursor':'pointer', width: (size ? size : 150) +'px'}" @click="copyClipboard(card.NameFr);">
                    {{card.NameFr}}
                </div>
                <img style="max-width:250px !important" :src="card.Image"/>
            </div>
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
    props: ['card', 'badgeoff', 'size', 'tooltip', 'x2', 'showname'],
    methods: {
        copyClipboard(text) {
            navigator.clipboard.writeText(text);
        }   
    }
  }
</script>
