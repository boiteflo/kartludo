<template>
    <div class="w100p h100p relative">
        <div class="arrow absolute"
            :style="{ top: '0px', left: '0px', 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute"
            :style="{ top: '15%', left: '15%', 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute"
            :style="{ top: '30%', left: '30%', 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute"
            :style="{ top: '45%', left: '45%', 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute"
            :style="{ top: '60%', left: '60%', 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute"
            :style="{ top: '75%', left: '75%', 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
    </div>
</template>

<style scoped>
.arrow {
    width: 25px;
    height: 25px;
    transform-origin: center center;
    pointer-events: none
}
</style>

<script>
export default {
    name: 'arrow-div',
    props: ['color']
}
</script>