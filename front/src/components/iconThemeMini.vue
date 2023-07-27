<template>
    <div>
        <div class="m5px" style="width:80px; height:85px; position:relative; overflow: hidden;">
            <img @click="$emit('select')" style="cursor:pointer; width: 110px; object-fit: cover; object-position: -12px -28px;" :src="image" />
        </div>
        <div @click="$emit('select')">
            <div class="w100p" :style="{'font-size':'10px', 'text-align':'center', color:color ?? 'white'}">{{text}}</div>
        </div>
    </div>
</template>


<script>
  export default {
    name: 'icon-theme',
    props: ['image', 'text', 'color']
  }
</script>
