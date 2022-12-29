<template>
  <div class="abs-center">
    <h1 class="bottom-24">2D vectors</h1>
    <ul>
      <li><RouterLink to="/demo"><p>Magnitude and direction</p></RouterLink></li>
      <li><RouterLink to="/attraction"><p>Attraction point</p></RouterLink></li>
      <li><RouterLink to="/mouse"><p>Mouse tracker</p></RouterLink></li>
    </ul>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
import { RouterLink, RouterView } from "vue-router";
import Btn from "../components/Btn.vue";

</script>

<style scoped lang="scss">
ul {
  width: 300px;
  li {
    margin: 12px 0;
    padding: 12px 0;
    font-size: 18px;
    transition-duration: 400ms;

    &:hover {
      padding-left: 24px;
      transition-duration: 400ms;
    }
  }
}
</style>
