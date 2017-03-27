import Vue from 'vue';
export default function(store){
  return new Vue({
    store,
    el: "#toolbar",
    template: require('html-loader!src/templates/Toolbar.html'),
    //just wired up some junk data to make sure store & state are working
    //as expected
    computed: {
      count() {
        return store.state.count
      }
    },
    methods: {
      increment() {
        store.commit('increment');
      },
      decrement() {
        store.commit('decrement');
      },
      loaded() {
        store.commit('loaded');
      }
    }
  })
}
