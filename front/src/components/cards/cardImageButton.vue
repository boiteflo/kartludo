<template>
    <div class="wCard hCard cursorPointer bgImage"
        :style="{ 'background-image': 'url(' + image + ')' }" @click="$emit('click')">
        <div class="w100p h100p" :class="{ yellowGradient: selected }">
        </div>
    </div>
</template>

<script>
export default {
    props: ['image', 'selected']
}
</script>
