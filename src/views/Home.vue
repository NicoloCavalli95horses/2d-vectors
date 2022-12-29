<template>
  <div class="abs-center flex-column">
    <h1 class="bottom-24">2D vectors</h1>
    
    <RouterLink to="/menu">
    <Btn text="play">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-play" />
      </template>
    </Btn>
    </RouterLink>
  </div>

</template>

<script setup>
// ==============================
// Import
// ==============================
import { RouterLink, RouterView } from "vue-router";
import { Store } from "@/stores/store";
import Btn from '../components/Btn.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

// ==============================
// Consts
// ==============================
const store = Store();
library.add(faPlay);

</script>

<style lang="scss" scoped>

</style>