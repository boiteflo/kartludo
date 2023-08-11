<template>
    <div class="flex flex-wrap bg p5px">  
        <div v-for="(item,i) in items" :key="item.Id"> 
            <v-btn class="m5px bg2" @click="$emit('select', item)">
              <h3 style="color:white">{{item.Text}}</h3>
            </v-btn>
            <v-icon style="color:white" v-if="i < items.length-1">mdi-chevron-right</v-icon>
        </div>     
    </div>
</template>

<script>
  export default {
    name: 'card-image',
    props: ['items']
  }
</script>
