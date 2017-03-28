import Vue from 'vue';

export default function(store){
  return new Vue({
    name: 'loading-bar',
    store,
    el: "#loading-bar",
    template: require('src/templates/LoadingBar.html'),
    computed: {
      loading() {
        return store.state.loading
      }
    }
  })
}
