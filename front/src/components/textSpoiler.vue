<template>
    <div>
        <v-card class="flex m5px p5px" @click="show=!show">
            <v-icon v-if="icon">{{icon}}</v-icon>
            <span>{{title}}</span>
        </v-card>
         <v-expand-transition>
            <div v-show="show">
                <v-textarea :value="text" class="m5px" readonly />
            </div>
        </v-expand-transition>
    </div>
</template>

<script>
  export default {
    name: 'text-spoiler',
    props: ['title', 'icon', 'text'],
    data: () => ({
        show: false
    }),
  }
</script>
