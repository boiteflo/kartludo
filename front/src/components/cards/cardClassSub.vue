<template>
    <card-medium 
        :background="require('@/assets/Daggerheart/template/CardSousClass.png')" 
        :image="getImage('.jpg')" 
        :images="[{top:'0px', left:'20px', width:'70px', height:'118px', 'background-image':'url(' + getImage('-banner.webp') + ')'}]"
        class="cursorPointer, m5px" 
        @click="$emit('click', obj)"
        :image_position="image_position">
        <div class="text textCenter rl5px colorWhite uppercase" style="top:199px"><b>{{ obj.classFr }}</b></div>
        <div class="text textCenter rl5px bold uppercase" style="top:220px; font-size: 20px;"><b>{{ obj.title }}</b></div>
        <div class="text rl5px" style="top:250px; font-size: 10px;" v-html="obj.details"></div>
        <div class="text textCenter rl5px bold" :style="{bottom:'5px', 'font-size':'11px', color:getColor(obj.Type)}"><b>{{ obj.type }}</b></div>
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
        getImage(extension){
            return require('@/assets/Daggerheart/class/' + this.obj.class + extension);
        }
    }
}
</script>
