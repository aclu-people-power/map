<template>
  <div ref="root" :class="['event-list-item', { '-selected': selected, '-hovered': hovered }]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'event-list-item',
  props: ['selected', 'hovered', 'onSelect'],
  watch: {
    selected() {
      if (this.selected) {
        this.$refs.root.scrollIntoView({ behavior: 'smooth' });
      }
    },
    hovered() {
      if (this.hovered) {
        this.$refs.root.scrollIntoView({ behavior: 'smooth' });
      }
    }    
  }
}
</script>
