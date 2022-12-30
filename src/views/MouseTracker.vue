<template>
  <div class="wrapper">
    <canvas ref="canvas" @mousedown="repeat(shoot, 30)" @mouseup="onMouseUp" />
    
    <!-- Upper left info box -->
    <div class="info">
      <h3>Mouse tracker</h3>
      <p>x: {{ mouse.x }} <br> y: {{ mouse.y }}</p>
      <p>Fired: {{ bulletCounter }}</p>
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
const router = useRouter();
const canvas = ref(undefined);
const ctx = ref(undefined);
const clearAllIntervals = ref( false );
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
const cannon = reactive({
  width: 100,
  height: 10,
  color: '#fff',
  interval: null,
});
const bullets = [];
const bullet = {
  id: null,
  ref: null,
  magnitude: 120,
  speed: 5,
  x: null,
  y: null,
  next: {
    x: null,
    y: null
  },
  interval: null,
  color: null
}

let bulletCounter = 0;
let bulletsInterval = null;

// ==============================
// Functions
// ==============================
function shoot() {
  // Update bullet counter
  bulletCounter++;
  
  // Get current mouse direction
  let actualDirection = mouse.direction;

  // Create new bullet
  bullets.push( {...bullet} );
  bullets.at(-1).id = bulletCounter;
  bullets.at(-1).color = getRandomColor();
  
  // Get ID of bullet (bullets's length may vary, an ID for every bullet is needed)
  let id = bullets.map(b => b.id).indexOf( bulletCounter );

  // Animate bullet with that ID
  bullets.at( id ).interval = setInterval(() => {
    updateBulletPosition( id, actualDirection );
  }, 10);
}

function updateBulletPosition( id, direction ) {
  // Calculate next bullet coordinates based on fixed direction
  bullets.at(id).next = getXY({ mag: bullets.at(id).magnitude, dir: direction })
  bullets.at(id).x = bullets.at(id).next.x + offset.x;
  bullets.at(id).y = bullets.at(id).next.y + offset.y;
  
  // Create new one if doesn't exist
  if ( !bullets.at(id).ref ) bullets.at(id).ref = document.createElement('div');
  bullets.at(id).ref.style.cssText = `
    width: 15px;
    height: 3px;
    background-color: ${ bullets.at(id).color };
    position: absolute;
    top: ${ bullets.at(id).y }px;
    left: ${ bullets.at(id).x }px;
    transform: translate(-50%, -50%) rotate(${ direction }rad);
  `;
  // Append to the DOM
  document.querySelector('.wrapper').appendChild( bullets.at(id).ref );

  // Update bullet magnitude
  bullets.at(id).magnitude += bullets.at(id).speed;

  if ( 
    bullets.at(id).x > window.innerWidth || 
    bullets.at(id).y > window.innerHeight ||
    bullets.at(id).x < 0 || 
    bullets.at(id).y < 0 ||
    clearAllIntervals.value
  ) {
    clearInterval( bullets.at(id).interval );
    
    // Remove bullet from the DOM and from the bullets array
    bullets.at(id).ref.remove();
  }
}

function repeat( fun, int ){
  bulletsInterval = setInterval(() => fun(), int )
}

function onMouseUp(){
  clearInterval( bulletsInterval )
}

function drawCannon() {
  ctx.value.save();

  // Clear the canvas
  ctx.value.fillStyle = "#222";
  ctx.value.fillRect( -offset.x, -offset.y, canvas.value.width, canvas.value.height );

  // Draw the cannon
  ctx.value.beginPath();
  ctx.value.moveTo( 0, 0 );
  
  // Calculate new coordinates with fixed magnitude
  let points = getXY({ mag: cannon.width, dir: mouse.direction });

  // Draw the cannon (it ends to the new coordinates)
  ctx.value.lineTo( points.x, points.y );
  ctx.value.lineWidth = cannon.height;
  ctx.value.strokeStyle = cannon.color;
  ctx.value.lineCap = 'round';
  ctx.value.stroke();
  ctx.value.restore();
}

// Clear the intervals, come back to the homepage
function onkeyup(e) {
  clearAllIntervals.value = true;
  if (e.key == "Escape") {
    router.push("/");
  }
}

// Update mouse x, y, magnitude, direction
function onMouseMove(e) {
  mouse.x = e.clientX - offset.x;
  mouse.y = e.clientY - offset.y;
  mouse.magnitude = getMagnitude({ x: mouse.x, y: mouse.y })
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
