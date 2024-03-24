<template>
  <div class="circle">
    <template v-for="layer in points">
      <div v-for="(p, i) in layer" :key="i" class="dot" :style="{ 'left': `${p.x * 100}%`, 'top': `${p.y * 100}%` }" />
    </template>
  </div>
  <div class="abs-center-left pointer" @click="addLevel"><h3>Add level</h3></div>
  <div class="abs-center-bottom pointer" @click="router.push('/')"><h3>Back</h3></div>
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
const router      = useRouter();
const points      = ref([]);
const gui         = new GUI();
const init_radius = ref(0.49);
const init_step   = ref(25);
const levels      = ref(0);

const STEP_MIN   = 1;
const STEP_MAX   = 180;
const RADIUS_MIN = 0.100;
const RADIUS_MAX = 0.49;

// ==============================
// Functions
// ==============================
/**
 * 
 * @param {Object} 
 * @param {number} object.radius - radius of the circle, from 0 to 0.5 (half the container)
 * @param {number} object.step   - define the step, in degrees, from 0 to 180°
 */
function calculatePointsOnCircle({ radius, step }) {
  const points = [];
  const angleIncrement = step * Math.PI / 180; // from 0 to 2π
  const numPoints = Math.floor(360 / step);
  const c = { x: 0.5, y: 0.5 };

  for (let i = 0; i < numPoints; i++) {
    let angle = angleIncrement * i;
    let x = radius * Math.cos(angle) + c.x;
    let y = radius * Math.sin(angle) + c.y;
    points.push({ x, y });
  }
  return points;
}

function onControlsChange({radius, step}, points) {
  const _points = calculatePointsOnCircle({radius, step});
  points.length = 0;
  Array.prototype.push.apply(points, _points);
}

function addLevel() {
  const newStep   = init_step.value; 
  const newRadius = init_radius.value;
  const newPoints = calculatePointsOnCircle({step: newStep, radius: newRadius});
  const currentLevel = levels.value;
  points.value.push(newPoints);
  gui
    .add({step: newStep, radius: newRadius}, "step", STEP_MIN, STEP_MAX)
    .name(`Lv. ${levels.value} - step`)
    .onChange(val => onControlsChange({ radius: newRadius, step: val }, points.value[currentLevel]));
  gui
    .add({step: newStep, radius: newRadius}, "radius", RADIUS_MIN, RADIUS_MAX)
    .name(`Lv. ${levels.value} - radius`)
    .onChange(val => onControlsChange({ radius: val, step: newStep }, points.value[currentLevel]));

  levels.value++;
  init_radius.value -= 0.05;
}


// ==============================
// Life cycle
// ==============================
addLevel();

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
