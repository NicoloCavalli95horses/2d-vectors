<template>
  <!-- Menu -->
  <div class="abs-center menu">
    <h1 class="bottom-24">2D vectors</h1>
    <ul>
      <li>
        <RouterLink to="/demo"><p>Magnitude and direction</p></RouterLink>
      </li>
      <li>
        <RouterLink to="/shape"><p>Shape editor</p></RouterLink>
      </li>
      <li>
        <RouterLink to="/attraction"><p>Attraction point</p></RouterLink>
      </li>
      <li>
        <RouterLink to="/mouse"><p>Mouse tracker</p></RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
</script>

<style scoped lang="scss">
.menu {
  h1 {
    text-align: center;
  }
  ul li {
    margin: 22px 0;
    font-size: 18px;
    p {
      padding: 8px 12px;
      border: 2px solid white;
      border-radius: 8px;
      transition-duration: 800ms;
      &:hover {
        background-color: white;
        color: black;
        transition-duration: 800ms;
      }
    }
  }
}
</style>
