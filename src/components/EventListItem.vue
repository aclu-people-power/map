<template>
  <div ref="root" :class="['event-list-item', { '-selected': selected }]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'event-list-item',
  props: ['selected', 'onSelect'],
  watch: {
    selected() {
      if (this.selected) {
        this.$refs.root.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>
