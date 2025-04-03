<template>
    <div @click="$emit('click', deck)" class="relative cursorHand parentHover"
        style="width:300px; height:255px;">
        <div id="cardLeft" style="width:50%; transform: rotate(-15deg); left:30px; height: 82%; top:30px" class="bgYellow absolute card">
            <img class="w100p shineParentHover" style="object-fit: cover;"
                :src="require('@/assets/' + folder + deck.card2 + '.webp')">
        </div>
        <div id="cardRight" style="width:50%; transform: rotate(15deg); right:30px; height:82%; top:30px" class="bgYellow absolute card">
            <img class="w100p shineParentHover" style="object-fit: cover;"
                :src="require('@/assets/' + folder + deck.card3 + '.webp')">
        </div>
        <div style="width:50%; transform: rotate(0deg); left:25%; height: 82%; top:30px" class="bgYellow absolute">
            <img class="w100p shineParentHover" style="object-fit: cover;"
                :src="require('@/assets/' + folder + deck.card1 + '.webp')">
        </div>
        <div id="title" class="bgWhite bgYellowParentHover absolute text-center textVerticalCenter circle15px"
            style="width:40%; top:65%; left:30%;">
            {{deck.name}}
        </div>
    </div>
</template>

<style scoped>
.card{
    transition: left .5s ease, right .5s ease, transform .5s ease;
}
#title {transition: background-color .5s ease;}

.parentHover:hover #cardLeft {
    transform: rotate(-22deg) !important;
    left:0px !important;
}
.parentHover:hover #cardRight {
    transform: rotate(22deg) !important;
    right:0px !important;
}
</style>

<script>
export default {
    name: 'game-deck',
    props: ['deck', 'folder']
}
</script>