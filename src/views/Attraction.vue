<template>
  <canvas ref="canvas" />

  <!-- Upper left info box -->
  <div class="info">
    <h3>Attraction point</h3>
    <p>Tap or press the space bar to animate</p>
  </div>

  <!-- Center point of attraction -->
  <div class="abs-center attraction-point"></div>

  <!-- Bottom center tip -->
  <div class="abs-center-bottom" @click="onBack">
    <h3>Back</h3>
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
const invert_animation = ref( false );
const has_finished = ref( false );
const TOTAL = 99;
const offset = reactive({
  x: null,
  y: null,
});

let interval;

// ==============================
// Functions
// ==============================
function drawMovingPoint({ invert = false } = {}) {
    ctx.value.fillStyle = "#222";
    ctx.value.fillRect(-offset.x, -offset.y, canvas.value.width, canvas.value.height);
    ctx.value.save();

    for (const point of points.value) {
        ctx.value.beginPath();
        ctx.value.fillStyle = point.color;
        ctx.value.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.value.fill();

        point.magnitude = getMagnitude({ x: point.x, y: point.y });

        // Adjust magnitude based on direction and speed
        point.magnitude = invert ? (point.magnitude + point.speed) : (point.magnitude - point.speed);

        // Check if the point can still be animated
        const canAnimate = invert ? point.magnitude <= 999 : point.magnitude >= 0;

        if (canAnimate) {
            const newPoints = getXY({
                mag: point.magnitude,
                dir: getDirectionInRadians({ x: point.x, y: point.y }),
            });

            // Update point coordinates
            point.x = newPoints.x;
            point.y = newPoints.y;
        } else {
            arrived.add(point.id);
        }
    }

    // Restore the context outside the loop
    ctx.value.restore();

    // Check if all points have arrived and stop the animation
    if (arrived.size === TOTAL) {
        clearInterval(interval);
        arrived.clear();
    }
}


function generateRandomPoints() {
  for (let i = 0; i < TOTAL; i++) {
    points.value.push({
      id: i,
      x: randomInterval(-window.innerWidth / 2, window.innerWidth / 2),
      y: randomInterval(-window.innerHeight / 2, window.innerHeight / 2),
      magnitude: null,
      speed: randomInterval(2, 6),
      radius: randomInterval(2, 19),
      color: getRandomColor(),
    });
  }
}

function onkeyup(e) {
  if (e.code == "Space") {
    invertAnimation();
  }
}

function invertAnimation() {
  clearInterval( interval );
  invert_animation.value = !invert_animation.value;
  has_finished.value = false;
  interval = setInterval(() => drawMovingPoint({invert:invert_animation.value}), 10);
}

function onResize() {
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  offset.x = canvas.value.width / 2;
  offset.y = canvas.value.height / 2;
  ctx.value.translate(offset.x, offset.y);
}

function onBack() {
  router.push("/");
}

// ==============================
// Life cycle
// ==============================
onMounted(() => {
  // Add event listener
  document.addEventListener("keyup", onkeyup);
  document.addEventListener("mouseup", invertAnimation);
  window.addEventListener("resize", onResize);

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
  document.removeEventListener("mouseup", invertAnimation);
  window.removeEventListener("resize", onResize);
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
