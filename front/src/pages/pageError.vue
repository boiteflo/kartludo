<template>
    <div>
        <v-alert v-if="error" type="error" class="m5px">
            {{error}}
        </v-alert>
    </div>
</template>


<script>

export default {
  name: 'pageError',
  data: () => ({
    error: false
  }),
  mounted(){
    let uri = window.location.href;
    let i = uri.indexOf("text="); 
    this.error = uri.substring(i+5).replace(/%20/g, ' ');
  }
};
</script>
