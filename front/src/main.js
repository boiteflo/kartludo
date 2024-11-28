import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import VueToastr from "vue-toastr";
import VueYoutube from 'vue-youtube'

Vue.config.productionTip = false

String.prototype.includesX2 = function() {
  return this.toLowerCase().startsWith("x2") || this.toLowerCase().endsWith("x2");
}
String.prototype.cleanup = function() {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
}
Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this >= min && this <= max;
};

Vue.mixin({
  methods: {
    moveUrl(url){
      if(window.location.href === url)
        window.location.reload();
      else
        window.location.href =url;
    },
    getCardImage(helperString, cards, card){
      return cards.find(x=> x.IdName === helperString.cleanup(card))?.ImageMDM
    },
    isMobileScreen(){
      return this.$vuetify.breakpoint.width < 900;
    },
    moveImage(animatedImage, event, yMargin = 0){ //this.moveImage({Image:'image', Animation:'slideToDown'}, event);
      
      this.store.animatedImage = {
        Animation : animatedImage.Animation,
        Image: animatedImage.Image,
        Width: event.currentTarget.clientWidth, //animatedImage.Width,
        X: event.pageX -event.offsetX,
        Y: event.pageY -event.offsetY - 70 + yMargin
      }
      setTimeout(() =>  this.store.animatedImage=null, 300);
    }
  },
})

Vue.use(VueToastr, {
  /* OverWrite Plugin Options if you need */
});
Vue.use(VueYoutube)

new Vue({
  vuetify,
  router,
  render: h => h(App),
  mounted() {
    this.$toastr.defaultPosition = "toast-bottom-center";
  }
}).$mount('#app')