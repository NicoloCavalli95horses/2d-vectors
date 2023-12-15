<template>
  <canvas ref="canvas" />

  <!-- Upper left info box -->
  <div class="info">
    <h3>Attraction point</h3>
    <p>Just a random magnitude reduction. Cool, right?</p>
  </div>

  <!-- Center point of attraction -->
  <div class="abs-center attraction-point"></div>

  <!-- Bottom center tip -->
  <div class="abs-center-bottom">
    <h3>Press <span class="key">Esc</span> to come back to the menu</h3>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
import { reactive, ref } from "vue";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  getXY,
  getMagnitude,
  getRandomColor,
  randomInterval,
  getDirectionInRadians,
} from "../utils.js";

// ==============================
// Const
// ==============================
const router = useRouter();
const canvas = ref(undefined);
const ctx = ref(undefined);
const points = ref([]);
const arrived = new Set([]);
const TOTAL = 99;
const offset = reactive({
  x: null,
  y: null,
});

let interval;

// ==============================
// Functions
// ==============================
function drawMovingPoint() {
  ctx.value.save();

  // Clear the canvas
  ctx.value.fillStyle = "#222";
  ctx.value.fillRect(
    -offset.x,
    -offset.y,
    canvas.value.width,
    canvas.value.height
  );

  // Draw the points
  for (const point of points.value) {
    ctx.value.beginPath();
    ctx.value.fillStyle = point.color;
    ctx.value.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.value.fill();

    ctx.value.restore();

    // Get current magnitude
    point.magnitude = getMagnitude({ x: point.x, y: point.y });

    // Reduce magnitude in order to get closer to the center
    point.magnitude = point.magnitude - point.speed;

    if (point.magnitude > 0) {
      let points = getXY({
        mag: point.magnitude,
        dir: getDirectionInRadians({ x: point.x, y: point.y }),
      });
      point.x = points.x;
      point.y = points.y;
    } else {
      arrived.add(point.id);
    }
    if (arrived.size == TOTAL) {
      clearInterval(interval);
    }
  }
}

function generateRandomPoints() {
  for (let i = 0; i < TOTAL; i++) {
    points.value.push({
      id: i,
      x: randomInterval(-window.innerWidth / 2, window.innerWidth / 2),
      y: randomInterval(-window.innerHeight / 2, window.innerHeight / 2),
      magnitude: null,
      speed: randomInterval(1, 3),
      radius: randomInterval(3, 15),
      color: getRandomColor(),
    });
  }
}

function onkeyup(e) {
  if (e.key == "Escape") {
    router.push("/");
  }
}

// ==============================
// Life cycle
// ==============================
onMounted(() => {
  // Add event listener
  document.addEventListener("keyup", onkeyup);

  // Set the canvas up
  ctx.value = canvas.value.getContext("2d");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  offset.x = canvas.value.width / 2;
  offset.y = canvas.value.height / 2;
  ctx.value.translate(offset.x, offset.y);

  // Generate points
  generateRandomPoints();

  // Animate points
  interval = setInterval(() => drawMovingPoint(), 10);
});

onUnmounted(() => {
  document.removeEventListener("keyup", onkeyup);
  clearInterval(interval);
});
</script>

<style lang="scss" scoped>
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

.attraction-point {
  border: 2px white dashed;
  animation: open-close 2000ms infinite;
}

@keyframes open-close {
  0% {
    width: 30px;
    height: 30px;
  }

  50% {
    width: 50px;
    height: 50px;
  }

  100% {
    width: 30px;
    height: 30px;
  }
}
</style>
