<template>
  <div ref="root" :class="['button-dropdown', { open: isOpen }]">
    <button
       ref="button"
       class="button-dropdown-button"
      @click="toggleVisibility"
    >
      <span>
        {{ buttonText }}
      </span>
    </button>
    <div v-if="isOpen" class="button-dropdown-content" :style="dropdownStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'button-dropdown',
  props: ['buttonText'],
  data() {
    return {
      isOpen: false,
      dropdownStyle: { width: 0 },
    };
  },
  methods: {
    toggleVisibility() {
      // When opening, calculate width based on the parent
      if (!this.isOpen) {
        this.dropdownStyle.width =
          `${this.$refs.button.offsetWidth * 2}px`;
      }
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
