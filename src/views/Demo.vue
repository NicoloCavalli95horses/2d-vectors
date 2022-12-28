<template>
  <canvas ref="canvas" />
  <div class="info">
    <h3>Magnitude: ~{{ getMagnitude( point ).toFixed(2) }}</h3>
    <p>Vector distance from the center of the Cartesian plane</p>
    <h3 class="top-12">Direction: ~{{ getDirection( point ).toFixed(2) }}</h3>
    <p>Radians from the center. Range from 0 to π/2</p>
  </div>

  <!-- Center point of the cartesian plane -->
  <div class="abs-center top-12">
    <h4>(0, 0)</h4>
  </div>
  
  <div :style="{ 
    'position' : 'absolute', 
    'top' : `${ point.y + offset.y + 20 }px`, 
    'left' : `${ point.x + offset.x }px`,
    'transform' : 'translate(-50%, -50%)' 
  }">
    <h4>(X: {{ point.x }}, Y: {{ point.y }})</h4>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { onUnmounted } from "vue";
import { useRouter } from 'vue-router'

// ==============================
// Const
// ==============================
const router = useRouter();
const canvas = ref( undefined );
const ctx = ref( undefined );
const offset = reactive({
  x: null,
  y: null
})

const point = reactive({
  x: 90,
  y: 120,
  radius: 6,
  color: '#800'
})

// ==============================
// Functions
// ==============================
function drawPoint( x, y, radius = 5, color = "white" ){
  ctx.value.beginPath();
  ctx.value.fillStyle = color;
  ctx.value.arc(x, y, radius, 0, Math.PI*2);
  ctx.value.fill();
}

function drawAxes(){
  ctx.value.save();
  ctx.value.beginPath();

  // X axes
  ctx.value.moveTo( -offset.x, 0 );
  ctx.value.lineTo( offset.x, 0 );

  // Y axes
  ctx.value.moveTo( 0, - offset.y );
  ctx.value.lineTo( 0,  offset.y );
  
  ctx.value.setLineDash([ 5,5 ]);
  ctx.value.stroke();
  ctx.value.restore();
}

// Get distance from the center (magnitude)
function getMagnitude({ x, y}){
  return Math.hypot(x, y);
}

// Get direction (angle from the center in radians)
// The angle ranges from 0 (the point is on the X axis) to 1.56 (1/2 pi)
function getDirection({ x, y }){
  return Math.atan( y / x );
}

function onMouseMove( e ) {
  point.x = e.clientX - offset.x;
  point.y = e.clientY - offset.y;
  update();
}

function update() {
  // Update canvas
  ctx.value.save();
  ctx.value.fillStyle = "#222";
  ctx.value.fillRect( -offset.x, -offset.y, canvas.value.width, canvas.value.height );
  drawAxes();
  drawPoint( 0, 0 ); // center point
  drawPoint( point.x, point.y, point.radius, point.color );
  ctx.value.restore();
}

function onkeyup( e ) {
  if ( e.key == 'Escape' ){
    router.push('/menu');
  }
}

// ==============================
// Life cycle
// ==============================
onMounted(() => {
  document.addEventListener('mousemove', onMouseMove );
  document.addEventListener('keyup', onkeyup) ;

  ctx.value = canvas.value.getContext('2d');
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  
  // Set offset
  offset.x = canvas.value.width / 2;
  offset.y = canvas.value.height / 2;
  
  // Translate the canvas in order to set the center point to (0,0)
  ctx.value.translate( offset.x, offset.y );
  
  // Initial point
  ctx.value.save();
  ctx.value.fillStyle = "#222";
  ctx.value.fillRect( -offset.x, -offset.y, canvas.value.width, canvas.value.height );
  drawAxes();
  drawPoint( point.x, point.y, point.radius, point.color );
  drawPoint( 0, 0 ); // center point
  ctx.value.restore();
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove );
  document.removeEventListener('keyup', onkeyup) ;
})

</script>

<style lang="scss" scoped>
.info {
  position: absolute;
  top: 22px;
  left: 22px;
  width: max-content;
  height: auto;
  h3, p {
    margin: 8px 12px;
  }
}
</style>