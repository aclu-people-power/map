<template>
  <div ref="root" :class="['button-dropdown', { open: isOpen }]">
    <button 
       :class="['button-dropdown-button', buttonClass]" 
      @click="toggleVisibility"
    >
      <span>
        {{ buttonText }}
      </span>
    </button>
    <div v-show="isOpen" class="button-dropdown-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'button-dropdown',
  props: ['buttonText', 'buttonClass'],
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleVisibility() {
      this.isOpen = !this.isOpen;
    },
    handleWindowClick(event) {
      if (this.$refs.root.contains(event.target)) {
        return;
      } else if (this.isOpen) {
        this.isOpen = false;
      }
    }
  },
  mounted() {
    window.addEventListener('click', this.handleWindowClick);
  },
  destroyed() {
    window.removeEventListener('click', this.handleWindowClick);
  }
}
</script>
