<template>
  <RouterView />
</template>

<script setup>
// ==============================
// Import
// ==============================
import { RouterLink, RouterView } from "vue-router";
</script>

<style lang="scss">
  * {
    overflow: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>