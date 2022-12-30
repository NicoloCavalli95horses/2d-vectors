<template>
  <div class="wrapper" @mousedown="repeat(shoot, 30)" @mouseup="onMouseUp">
    <canvas ref="canvas" />

    <!-- Range -->
    <div class="abs-center-left">
      <h3> Press <div class="key">&larr;</div> <div class="key">&rarr;</div> <div class="key">&uarr;</div> <div class="key">&darr;</div> to</h3>
      <h3> increse the bullets's size</h3>
    </div>

    <!-- Upper left info box -->
    <div class="top-left-corner">
      <h3>Mouse tracker</h3>
      <p> x: {{ mouse.x }} <br> y: {{ mouse.y }} </p>
      <p>Fired: {{ bulletsConfig.counter }}</p>
      <p>Bullets width: {{ bulletsConfig.size.width }}</p>
      <p>Bullets height: {{ bulletsConfig.size.height }}</p>
    </div>

    <!-- Top center tip -->
    <div class="abs-center-top">
      <h3>Click or hold-click to shoot</h3>
    </div>

    <!-- Tank -->
    <div class="abs-center tank"></div>

    <!-- Bottom center tip -->
    <div class="abs-center-bottom">
      <h3>Press <span class="key">Esc</span> to come back to the menu</h3>
    </div>
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
  getMagnitude,
} from "../utils.js";

// ==============================
// Const
// ==============================

// System
const router = useRouter();
const clearAllIntervals = ref(false);

// Canvas
const canvas = ref(undefined);
const ctx = ref(undefined);
const offset = reactive({
  x: null,
  y: null,
});

// Mouse
const mouse = reactive({
  x: 400,
  y: 500,
  magnitude: null,
  direction: null,
});

// Cannon
const cannon = reactive({
  width: 100,
  height: 10,
  color: "#fff",
  interval: null,
});

// Bullets
const bulletsConfig = {
  interval: null,
  counter: 0,
  size: {
    width: 15,
    height: 3,
  },
  speed: 5,
};

const bullets = [];
const bullet = {
  ref: null,
  magnitude: 120,
  x: null,
  y: null,
  next: {
    x: null,
    y: null,
  },
  interval: null,
};

// ==============================
// Functions
// ==============================
function shoot() {
  // Get current mouse direction
  let actualDirection = mouse.direction;

  // Create new bullet
  bullets.push({ ...bullet, id: bulletsConfig.counter, color: getRandomColor() });

  // Get ID of bullet (bullets's length may vary, an ID for every bullet is needed)
  let id = bullets.map((b) => b.id).indexOf(bulletsConfig.counter);

  // Animate bullet with that ID
  bullets.at(id).interval = setInterval(() => {
    updateBulletPosition(id, actualDirection, clearAllIntervals.value);
  }, 10);

  // Update counter
  bulletsConfig.counter++;
}

function updateBulletPosition(id, direction, forceStop = false) {
  // Force stop
  if (forceStop) {
    clearInterval(bullets.at(id).interval);
    return;
  }

  // Calculate next bullet coordinates based on fixed direction
  bullets.at(id).next = getXY({ mag: bullets.at(id).magnitude, dir: direction });
  bullets.at(id).x = bullets.at(id).next.x + offset.x;
  bullets.at(id).y = bullets.at(id).next.y + offset.y;

  // Create new one if doesn't exist
  if (!bullets.at(id).ref) bullets.at(id).ref = document.createElement("div");
  bullets.at(id).ref.style.cssText = `
    width: ${bulletsConfig.size.width}px;
    height: ${bulletsConfig.size.height}px;
    background-color: ${bullets.at(id).color};
    position: absolute;
    top: ${bullets.at(id).y}px;
    left: ${bullets.at(id).x}px;
    transform: translate(-50%, -50%) rotate(${direction}rad);
  `;
  // Append to the DOM
  document.querySelector(".wrapper").appendChild(bullets.at(id).ref);

  // Update bullet magnitude
  bullets.at(id).magnitude += bulletsConfig.speed;

  if (
    bullets.at(id).x > window.innerWidth ||
    bullets.at(id).y > window.innerHeight ||
    bullets.at(id).x < 0 ||
    bullets.at(id).y < 0
  ) {
    clearInterval(bullets.at(id).interval);

    // Remove bullet from the DOM and from the bullets array
    bullets.at(id).ref.remove();
  }
}

// Repeat a function n times
function repeat(fun, int) {
  bulletsConfig.interval = setInterval(() => fun(), int);
}

function onMouseUp() {
  clearInterval(bulletsConfig.interval);
}

function drawCannon() {
  ctx.value.save();

  // Clear the canvas
  ctx.value.fillStyle = "#222";
  ctx.value.fillRect( -offset.x, -offset.y, canvas.value.width, canvas.value.height );

  // Draw the cannon
  ctx.value.beginPath();
  ctx.value.moveTo(0, 0);

  // Calculate new coordinates with fixed magnitude
  let points = getXY({ mag: cannon.width, dir: mouse.direction });

  // Draw the cannon (it ends to the new coordinates)
  ctx.value.lineTo(points.x, points.y);
  ctx.value.lineWidth = cannon.height;
  ctx.value.strokeStyle = cannon.color;
  ctx.value.lineCap = "round";
  ctx.value.stroke();
  ctx.value.restore();
}

// Clear the intervals, come back to the homepage
function onkeyup(e) {
  switch( e.key ) {
    case 'Escape':
      clearAllIntervals.value = true;
      router.push("/");
      break;
    case 'ArrowLeft':
      bulletsConfig.size.width = bulletsConfig.size.width > 0 ? bulletsConfig.size.width - 5 : 0;  
      break;
    case 'ArrowRight':
      bulletsConfig.size.width = bulletsConfig.size.width < 100 ? bulletsConfig.size.width + 5 : 100;  
      break;
    case 'ArrowDown':
      bulletsConfig.size.height = bulletsConfig.size.height > 0 ? bulletsConfig.size.height - 5 : 0;  
      break;
    case 'ArrowUp':
      bulletsConfig.size.height = bulletsConfig.size.height < 100 ? bulletsConfig.size.height + 5 : 100;  
      break
    }
}

// Update mouse x, y, magnitude, direction
function onMouseMove(e) {
  mouse.x = e.clientX - offset.x;
  mouse.y = e.clientY - offset.y;
  mouse.magnitude = getMagnitude({ x: mouse.x, y: mouse.y });
  mouse.direction = getDirectionInRadians({ x: mouse.x, y: mouse.y });
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
  cannon.interval = setInterval(() => drawCannon(), 30);
});

onUnmounted(() => {
  document.removeEventListener("keyup", onkeyup);
  document.removeEventListener("mousemove", onMouseMove);
  clearInterval(cannon.interval);
  clearInterval(bullet.interval);
});
</script>

<style lang="scss" scoped>
.wrapper {
  cursor: crosshair;
  .tank {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: white;
    cursor: none;
    &::after {
      content: "";
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
  .key {
    display: inline;
  }
}
</style>
