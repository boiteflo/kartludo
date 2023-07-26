<template>
    <div>
        <v-alert v-if="success" type="success" class="m5px">
            {{success}}
        </v-alert>
    </div>
</template>


<script>

export default {
  name: 'pageSuccess',
  data: () => ({
    success: false
  }),
  mounted(){
    let uri = window.location.href;
    let i = uri.indexOf("text="); 
    this.success = uri.substring(i+5).replace(/%20/g, ' ');
  }
};
</script>
