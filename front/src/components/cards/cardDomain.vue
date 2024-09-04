<template>
    <card-medium 
        :background="require('@/assets/Daggerheart/template/CardDomain.png')" 
        :image="getImage('','.jpg')" 
        :images="[
            {top:'0px', left:'20px', width:'70px', height:'118px', 'background-image':'url(' + getImage('banner-','.webp') + ')'},
            {top:'20px', right:'20px', width:'35px', height:'35px', 'background-image':'url(' + getImageCost() + ')'}
        ]"
        class="cursorPointer, m5px" 
        @click="$emit('click', obj)"
        :image_position="image_position">
        <div class="text textCenter rl5px colorWhite uppercase" style="top:226px"><b>{{ obj.type }}</b></div>
        <div class="text textCenter rl5px bold uppercase" style="top:248px; font-size: 20px;"><b>{{ obj.nom }}</b></div>
        <div class="text textCenter bold" :style="{top:'15px', left:'35px', width:'38px', 'font-size':'30px', color:getColorLevel()}">{{ obj.niveau }}</div>
        <div class="text colorWhite" style="top:23px; right:36px; font-size: 18px;">{{ obj.cout }}</div>
        <div class="text rl5px" style="top:275px; font-size: 10px;" v-html="obj.effet"></div>
        <div class="text textCenter r5px" :style="{bottom:'5px', 'font-size':'11px'}"><b>Domaine :</b> {{ obj.domaine }}</div>
    </card-medium>
</template>


<script>
import cardMedium from './cardMedium';

export default {
    props: ['obj', 'image_position'],
    components: { cardMedium },
    methods: {
        getColor(){
            return this.obj.type=='Maîtrise' ? '#B71C1C' : this.obj.type=='Spécialisation' ? '#FBC02D' : 'black';
        },
        getColorLevel(){return this.obj.domain == "bone" ? "black" : "white"},
        getImageCost(){return require('@/assets/Daggerheart/other/cost.webp');},
        getImage(prefix, extension){
            return require('@/assets/Daggerheart/domain/' + prefix + this.obj.domain + extension);
        }
    }
}
</script>
