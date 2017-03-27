<template>
  <h2 id="event-map">EVENT MAP</h2>
</template>

<script>
  import codes from 'json-loader!src/data/us_postal_codes'
  export default {
    name: 'event-map',
    props: ['loaded'],
    mounted: function() {
      this.loaded();
    }
  }
</script>
