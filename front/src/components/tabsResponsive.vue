<template>
    <div class="flex-wrap flex-space-around">
        <div v-for="(obj, index) in tabs" :key="'Tab' + index"
            :class="{ p10px: true, 'v-tab': true, 'v-tab-active': tab == index }" @click="$emit('click', index)"
            style="height:55px">
            {{ obj }}
        </div>
    </div>
</template>

<style scoped>
.v-tab-active {
    border: #FFF59D solid;
    color: #FFF59D;
    border-right: 2px;
    border-left: 2px;
    border-top: 2px;
}
</style>
<script>
export default {
    name: 'tabs-responsive',
    props: ['tabs', 'tab']
}
</script>
