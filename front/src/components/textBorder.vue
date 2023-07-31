<template>
    <div class="bg2 colorWhite m5px" style="border-radius:15px; height:32px;">
        <v-icon v-if="icon">{{icon}}</v-icon>
        <div class="m5px">{{text}}</div>
    </div>
</template>

<script>
  export default {
    name: 'text-border',
    props: ['text', 'icon']
  }
</script>
