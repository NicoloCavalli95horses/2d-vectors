<template>
  <canvas ref="canvas" />

  <!-- Upper left info box -->
  <div class="info">
    <h3>Mouse tracker</h3>
    <p>x: {{ mouse.x }} <br> y: {{ mouse.y }}</p>
  </div>

  <!-- Tank -->
  <div class="abs-center tank"></div>

  <!-- Bottom center tip -->
  <div class="abs-center-bottom">
    <h3>Press <span class="key">Esc</span> to come back to the menu</h3>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  randomInterval,
  getDirectionInRadians,
  getRandomColor,
  getXY,
} from "../utils.js";

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
const mouse = reactive({
  x: 400,
  y: 500,
  magnitude: null,
  direction: null
})
const line = reactive({
  width: 100,
  height: 10,
  color: '#fff'
});
let interval;

// ==============================
// Functions
// ==============================
function drawLine() {
  ctx.value.save();

  // Clear the canvas
  ctx.value.fillStyle = "#222";
  ctx.value.fillRect( -offset.x, -offset.y, canvas.value.width, canvas.value.height );

  // Draw the line
  ctx.value.beginPath();
  ctx.value.moveTo( 0, 0 );
 
  // Get current mouse direction
  mouse.direction = getDirectionInRadians({ x: mouse.x, y: mouse.y });
  
  // Calculate new coordinates with fixed magnitude
  let points = getXY({ mag: line.width, dir: mouse.direction });

  // Draw the line (it ends to the new coordinates)
  ctx.value.lineTo( points.x, points.y );
  ctx.value.lineWidth = line.height;
  ctx.value.strokeStyle = line.color;
  ctx.value.lineCap = 'round';
  ctx.value.stroke();

  // Draw bullets
  // (?)
  // 

  ctx.value.restore();
}

function drawPoint(x, y, radius = 5, color = "white") {
  ctx.value.beginPath();
  ctx.value.fillStyle = color;
  ctx.value.arc(x, y, radius, 0, Math.PI * 2);
  ctx.value.fill();
}

function onkeyup(e) {
  if (e.key == "Escape") {
    router.push("/");
  }
}

function onMouseMove(e) {
  mouse.x = e.clientX - offset.x;
  mouse.y = e.clientY - offset.y;
}

// ==============================
// Life cycle
// ==============================
onMounted(() => {
  // Add event listener
  document.addEventListener("keyup", onkeyup);
  document.addEventListener("mousemove", onMouseMove);

  // Set the canvas up
  ctx.value = canvas.value.getContext("2d");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  offset.x = canvas.value.width / 2;
  offset.y = canvas.value.height / 2;
  ctx.value.translate(offset.x, offset.y);
  
  // Animate
  interval = setInterval(() => drawLine(), 30);
});

onUnmounted(() => {
  document.removeEventListener("keyup", onkeyup);
  document.removeEventListener("mousemove", onMouseMove);
  clearInterval(interval);
});
</script>

<style lang="scss" scoped>
 canvas {
  cursor: crosshair;
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

.tank {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  cursor: none;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #444;
  }
}
</style>
