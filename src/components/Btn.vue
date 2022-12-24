<template>
    <button :class="{ 'disabled' : disabled }"> 
      <div>
        <h3>{{ text }}</h3>
        <slot name="icon" />
      </div>
    </button>
  </template>
  
  <script setup>
  // ==============================
  // Props
  // ==============================
  const props = defineProps({
    text: String,
    disabled: Boolean,
  });
  </script>
  
  <style lang="scss" scoped>
  button {
    text-decoration: none;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 8px;
  
    &:hover {
      filter: brightness(160%);
      cursor: pointer;
    }

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
    }
  }
  
  .disabled {
      opacity: 0.5;
      touch-action: none;
      pointer-events: none;
      &:hover {
        filter: none;
      }
    }
  </style>