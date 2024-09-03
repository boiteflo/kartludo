<template>
    <card-small :background="require('@/assets/Daggerheart/template/CardWeapon.png')"
        :image="require('@/assets/Daggerheart/other/weapon.png')" class="cursorPointer m5px" :highlight="selected"
        @click="$emit('click', weapon)">
        <div class="overlay-image"
            :style="{ top: '5px', right: '5px', width: '25px', height: '30px', 'background-image': 'url(' + require('@/assets/Daggerheart/other/hand.png') + ')' }">
            <div class="colorBlack" style="margin-top:5px; margin-left:5px"><b>{{ weapon.hands }}</b></div>
        </div>
        <div class="text textCenter rl5px" style="top:130px"><b>{{ weapon.nom }}</b></div>
        <div class="text rl5px" style="top:150px; font-size:12px"><b>Trait : </b> {{ weapon.trait
            }}, <b>Dégâts :</b> {{ weapon.degats }}, <b>Type : </b> {{ weapon.type_de_degats }},
            <b>Portée :</b> {{ weapon.portee }}
            <div style="font-size:10px" v-html="weapon.caracteristique">
            </div>
        </div>
    </card-small>
</template>

<script>
import cardSmall from '../cardSmall';

export default {
    props: ['weapon', 'selected'],
    components: { cardSmall }
}
</script>
