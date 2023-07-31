<template>
    <v-img v-if="src.includes('./assets/')" :src="require(src)" />
    <image v-else :src="src" />
</template>

<script>
  export default {
    name: 'image',
    props: ['src']
  }
</script>
