<template>
  <div class="wrapper" @pointerdown="show_circle = !show_circle">
    <div class="info">
      <h3>Magnitude: ~{{ magnitude.toFixed(2) }}</h3>
      <p>Vector distance from the center of the Cartesian plane</p>
      <h3 class="top-12">
        Direction: ~
        {{ direction.toFixed(2) }}
        ({{ degree.toFixed(2) }}°)
      </h3>
      <p>direction from the center. Range from 0 to π (180°)</p>
    </div>

    <div class="x-axis" />
    <div class="y-axis" />
    
    <div
      v-show="show_circle"
      class="circle"
      :style="{ 
        'width': `${2 * magnitude}px`,
        'height': `${2 * magnitude}px`,
        'background-image': `conic-gradient(transparent ${ 360 - degree }deg, orangered 0)`,
        }"
    />

    <div class="abs-center">
      <div class="center" />
      <h4 class="top-44">0, 0</h4>
    </div>

    <div class="cursor" :style="{ top: `${cursor.y}px`, left: `${cursor.x}px` }" />
    <h4 class="absolute" :style="{ top: `${cursor.y + 20}px`, left: `${cursor.x}px` }">
      X: {{ centered_cursor.x * -1 }}, Y: {{ centered_cursor.y }}
    </h4>

    <div class="abs-center-bottom" @click="router.push('/')">
      <h3>Back</h3>
    </div>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
import { ref, computed, reactive } from "vue";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { mapValue } from '../utils';

// ==============================
// Const
// ==============================
const router = useRouter();
const cursor = reactive({ x: null, y: null, down: false });
const show_circle = ref( false );

const centered_cursor = computed(() => {
  return {
    x: window.innerWidth / 2 - cursor.x,
    y: window.innerHeight / 2 - cursor.y,
  };
});

const magnitude = computed(() => Math.hypot(centered_cursor.value.x, centered_cursor.value.y ));
const direction = computed(() => Math.atan2(centered_cursor.value.y, centered_cursor.value.x ));
const degree    = computed(() => mapValue(direction.value, -Math.PI, Math.PI, 360, 0 ));

// ==============================
// Functions
// ==============================
function onMouseMove(e) {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
}

// ==============================
// Life cycle
// ==============================
onMounted(() => {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("keyup", onkeyup);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("keyup", onkeyup);
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  background-color: #222;
  overflow-x: hidden;
  overflow-y: hidden;
}
.cursor {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  background-color: orangered;
}
h4.absolute {
  position: absolute;
  transform: translate(-50%, 0);
}
.x-axis {
  width: 100%;
  height: 2px;
  background: #333;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.y-axis {
  width: 2px;
  height: 100%;
  background: #333;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0%);
}
.center {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.info {
  position: absolute;
  top: 22px;
  left: 22px;
  width: max-content;
  height: auto;
  h3,
  p {
    margin: 8px 12px;
  }
}
.circle {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%) rotateZ(90deg);
  border: 2px solid #666;
}
</style>
