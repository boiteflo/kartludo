

<template> 
    <div class="">
        <a :href="url" v-if="external">
            <v-btn
            target=""
            @click="$emit('click')"
            >
            <v-icon class="colorWhite" v-if="icon">{{icon}}</v-icon>
            <span class="mr-2 colorWhite">{{text}}</span>
            </v-btn>
        </a> 

        <router-link :to="url" v-else>
            <v-btn
            target="_blank"
            text
            @click="$emit('click')"
            >
            <v-icon class="colorWhite" v-if="icon">{{icon}}</v-icon>
            <span class="mr-2 colorWhite" >{{text}}</span>
            </v-btn>
        </router-link>
    </div>

</template>

<script>
  export default {
    name: 'link-button',
    props: ['url', 'external', 'text', 'icon']
  }
</script>
