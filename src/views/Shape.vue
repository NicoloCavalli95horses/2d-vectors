<template>
  <div class="circle">
    <div v-for="(p, i) in points" :key="i" class="dot" :style="{ 'left': `${p.x * 100}%`, 'top': `${p.y * 100}%` }" />
  </div>
  <div class="abs-center-bottom" @click="router.push('/')">
    <h3>Back</h3>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
import { useRouter } from "vue-router";
import { ref } from "vue";
import GUI from "lil-gui";

// ==============================
// Consts
// ==============================
const router       = useRouter();
const points       = ref([]);
const gui          = new GUI();
const radius       = 0.25;
const step_degrees = 45;

const guiObj = {
  radius: radius,
  step: step_degrees
};

const STEP_MIN   = 1;
const STEP_MAX   = 180;
const RADIUS_MIN = 0.100;
const RADIUS_MAX = 0.49;

gui.add(guiObj, "radius", RADIUS_MIN, RADIUS_MAX).onChange(val => calculatePointsOnCircle({ radius: val, step: step_degrees }));
gui.add(guiObj, "step", STEP_MIN, STEP_MAX).onChange(val => calculatePointsOnCircle({ radius: radius, step: val }));

// ==============================
// Function
// ==============================

/**
 * 
 * @param {Object} 
 * @param {number} object.radius - radius of the circle, from 0 to 0.5 (half the container)
 * @param {number} object.step   - define the step, in degrees, from 0 to 180°
 */
function calculatePointsOnCircle({ radius, step }) {
  points.value = [];
  const angleIncrement = step * Math.PI / 180; // from 0 to 2π
  const numPoints = Math.floor(360 / step);
  const c = { x: 0.5, y: 0.5 };

  for (let i = 0; i < numPoints; i++) {
    let angle = angleIncrement * i;
    let x = radius * Math.cos(angle) + c.x;
    let y = radius * Math.sin(angle) + c.y;
    points.value.push({ x, y });
  }
}

// ==============================
// Life cycle
// ==============================
calculatePointsOnCircle({ radius: radius, step: step_degrees });

</script>

<style lang="scss" scoped>
.circle {
  width: 100vh;
  height: 100vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: orangered;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
  }
}
</style>
