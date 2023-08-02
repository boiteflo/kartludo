import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

String.prototype.includesX2 = function() {
  return this.toLowerCase().startsWith("x2") || this.toLowerCase().endsWith("x2");
}
String.prototype.cleanup = function() {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
}

Vue.mixin({
  methods: {
    moveUrl(url){
      if(window.location.href === url)
        window.location.reload();
      else
        window.location.href =url;
    },
    moveImage(animatedImage, event){
      
      this.store.animatedImage = {
        Animation : animatedImage.Animation,
        Image: animatedImage.Image,
        Width: event.currentTarget.clientWidth, //animatedImage.Width,
        X: event.pageX -event.offsetX,
        Y: event.pageY -event.offsetY - 70
      }
      setTimeout(() =>  this.store.animatedImage=null, 300);
    }
  },
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')