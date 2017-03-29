import Vue from 'vue';
import { setHash } from 'src/util/url-hash';

export default function(store){
  return new Vue({
    name: 'toolbar',
    store,
    el: "#toolbar",
    template: require('src/templates/Toolbar.html'),
    data: {
      isFilterEventsOpen: false
    },
    computed: {
      zipcode() {
        return store.state.filters.zipcode;
      },
      view() {
        return store.state.view;
      }
    },
    methods: {
      updateZipcode(event) {
        const value = event.target.value;
        if (/^\d+$/.test(value) && value.length === 5) {
          setHash({ zipcode: value });
        }
      },
      toggleView() {
        store.commit('viewToggled');
      },
      toggleFilterEvents() {
        this.isFilterEventsOpen = !this.isFilterEventsOpen;
      },
    }
  })
}
