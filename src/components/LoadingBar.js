import Vue from 'vue';

export default function(store){
  return new Vue({
    store,
    el: "#loading-bar",
    template: require('html-loader!src/templates/LoadingBar.html'),
    computed: {
      loading() {
        return store.state.loading
      }
    }
  })
}
