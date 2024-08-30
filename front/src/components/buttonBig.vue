<template>
    <div class="m5px" style="width:340px; position:relative; cursor:pointer" @click="$emit('click')">
        <img v-if="image" :src="image" style="width:340px;" />
        <div class="w100p h100p blackGradient absolute t0px"></div>
        <p class="text-center w100p bold fs30px colorWhite absolute t100px">{{ text }}</p>
    </div>
</template>

<script>
export default {
    name: 'button-big',
    props: ['text', 'image']
}
</script>
