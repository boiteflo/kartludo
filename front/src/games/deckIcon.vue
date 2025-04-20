<template>
    <div>
        <img @click="$emit('click')" class="w100p h100p" style="object-fit:contain" :src="require('@/assets/Gundam/' + icon)" />
        <div class="absolute text-center w100p text-shadow-black" style="top: 35%;">
            {{ text }}
            <br>
            {{ length }}
        </div>
    </div>
</template>


<script>
export default {
    name: 'deck-icon',
    props: ['icon', 'length', 'text']
}
</script>