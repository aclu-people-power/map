<template>
  <div :class="['button-dropdown', { open: isOpen }]">
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
    }
  }
}
</script>
