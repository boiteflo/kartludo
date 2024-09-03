<template>
    <card-small :background="require('@/assets/Daggerheart/template/CardArmor.png')"
        :image="require('@/assets/Daggerheart/' + armor.image)"
        :class="{ cursorPointer: true, m5px: true, borderYellow: highlight }" :highlight="selected"
        @click="$emit('click', armor)">
        <div class="text textCenter rl5px" style="top:155px"><b>{{ armor.name }}</b></div>
        <div class="text textCenter rl5px colorWhite" style="top:125px"><b>{{ armor.armor }}</b>
        </div>
        <div class="text rl5px" style="top:175px; font-size:12px" v-html="armor.feature"></div>
    </card-small>
</template>

<script>
import cardSmall from './cardSmall';

export default {
    props: ['armor', 'highlight', 'selected'],
    components: { cardSmall }
}
</script>
