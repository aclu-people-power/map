import Vue from 'vue';

export default function(opts) {
  var options = opts || {};
  return new Vue({
    name: 'Footer',
    el: ".footer",
    template: require('src/templates/Footer.html'),
    data: {
      showACLU: options.showACLU,
      facebookUrl: 'https://www.facebook.com/sharer/sharer.php',
      currentUrl: location.href
    },
    computed: {
      shareUrl() {
        return `${this.facebookUrl}?u=${encodeURIComponent(this.currentUrl)}`
      }
    },
    created() {
      window.addEventListener('popstate', this.updateUrl);
      window.addEventListener('pushstate', this.updateUrl);
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.updateUrl);
      window.addEventListener('pushstate', this.updateUrl);
    },
    methods: {
      updateUrl() {
        this.currentUrl = location.href
      }
    }
  })
}
