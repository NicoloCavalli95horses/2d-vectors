<template>
  <div class="top-left-corner">
    <RouterLink to="/">
      <h1>Back</h1>
    </RouterLink>
  </div>

  <div class="abs-center">
    <ul>
      <li>
        <RouterLink to="/demo"><p>Magnitude and direction</p></RouterLink>
      </li>
      <li>
        <RouterLink to="/attraction"><p>Attraction point</p></RouterLink>
      </li>
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
    margin: 12px;
    padding: 12px;
    font-size: 18px;
    transition-duration: 400ms;
    border-bottom: 1px solid #333;

    &:hover {
      padding-left: 24px;
      transition-duration: 400ms;
    }
  }
}
</style>
