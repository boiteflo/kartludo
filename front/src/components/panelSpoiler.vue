<template>
    <div>
        <div class="flex bg2">
            <v-btn class="m5px bg" @click='showOrHide'>
                <v-icon>{{ showPanel ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
            </v-btn>
            <div class="flex-grow m5px" style="padding-top:5px">{{title}}</div>
        </div>
        <v-expand-transition>
            <div v-show="showPanel">
                <slot></slot>
            </div>
        </v-expand-transition>
        <v-btn v-if="showPanel" class="m5px bg w100p" @click='showOrHide'>
            <v-icon>{{ showPanel ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
        </v-btn>
    </div>
</template>

<script>
  export default {
    name: 'panelSpoiler',
    data: () => ({
        showPanel:false
    }),
    props: ['title','show'],
    methods: {
        showOrHide(){
            this.showPanel = !this.showPanel ? true : false;
        }
    }
  }
</script>
