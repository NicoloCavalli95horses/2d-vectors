<template>
  <canvas ref="canvas" />
  <div class="info">
    <h3>Chase simulation</h3>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";

// ==============================
// Const
// ==============================
const router = useRouter();
const canvas = ref(undefined);
const ctx = ref(undefined);
const offset = reactive({
  x: null,
  y: null,
});

const point = reactive({
  x: 500,
  y: 300,
  radius: 8,
  color: "blue",
  speed: 10
});

// ==============================
// Functions
// ==============================
function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawMovingPoint() {
  ctx.value.save();
  ctx.value.fillStyle = "#222";
  ctx.value.fillRect(
    -offset.x,
    -offset.y,
    canvas.value.width,
    canvas.value.height
  );
  
  ctx.value.beginPath();
  ctx.value.fillStyle = point.color;
  ctx.value.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
  ctx.value.fill();

  ctx.value.restore();
  point.x--; 
  point.y--;
}

function drawAxes() {
  ctx.value.save();
  ctx.value.beginPath();

  // X axes
  ctx.value.moveTo(-offset.x, 0);
  ctx.value.lineTo(offset.x, 0);

  // Y axes
  ctx.value.moveTo(0, -offset.y);
  ctx.value.lineTo(0, offset.y);

  ctx.value.setLineDash([5, 5]);
  ctx.value.stroke();
  ctx.value.restore();
}

function getMagnitude({ x, y }) {
  return Math.hypot(x, y);
}

function getDirection({ x, y }) {
  return Math.atan(y / x);
}

function onkeyup(e) {
  if (e.key == "Escape") {
    router.push("/menu");
  }
}

// ==============================
// Life cycle
// ==============================
onMounted(() => {
  ctx.value = canvas.value.getContext("2d");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  // Set offset
  offset.x = canvas.value.width / 2;
  offset.y = canvas.value.height / 2;

  // Translate the canvas in order to set the center point to (0,0)
  ctx.value.translate(offset.x, offset.y);

  setInterval(() => drawMovingPoint(), 10);
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
</style>
