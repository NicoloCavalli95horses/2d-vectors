<template>
  <div class="main-container">
    <div class="sight" :style="{
      'transform': `translate(${ mouse.x - (sight.width / 2) }px, ${ mouse.y - (sight.height / 2) }px)`,
      'width' : `${ sight.width }px`,
      'height' : `${ sight.height }px`
      }"
      />
    <div class="spaceship-wrapper">
      <div class="spaceship"></div>
      <div class="cannon" ref="cannon_ref" :style="{ 'transform': `translate(-50%, -50%) rotate(${ degree }deg)` }"></div>
    </div>
  </div>
</template>

<script setup>
// ==============================
// Import
// ==============================
import { computed, onMounted, reactive, ref } from "@vue/runtime-core";
import { onUnmounted } from "vue";

// ==============================
// Const
// ==============================
const mouse = reactive({});
const sight = reactive({
  width: 50,
  height: 50
});
const cannon_ref = ref( undefined );
let cannonRect;
let cannonBox;
const dx = ref();
const dy = ref();

const degree = computed(() => Math.atan2( dx.value, -dy.value ) * ( 180 / Math.PI ) )

// ==============================
// Functions
// ==============================
function onMouseMove( e ) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
  dx.value = e.pageX - cannonBox.x;
  dy.value = e.pageY - cannonBox.y;
}
// ==============================
// Life cycle
// ==============================
onMounted(() => {
  window.addEventListener( 'mousemove', onMouseMove );
  cannonRect = cannon_ref.value.getBoundingClientRect();
  cannonBox = {
    x: cannonRect.left + (cannonRect.width / 2), 
    y: cannonRect.top + (cannonRect.height / 2),
  }
})

onUnmounted(() => {
  window.removeEventListener( 'mousemove', onMouseMove )
})
</script>

<style lang="scss" scoped>
.main-container {
  width: 100vh;
  height: 100vh;
  overflow: hidden;
  cursor: none;
  
  .sight {
    position: absolute;
    border: 4px solid #800;
    border-radius: 50%;
    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      border: 4px solid #800;
      border-radius: 50%;
      content: '';
      transform: translate(-50%, -50%);
    }
  }
  .spaceship-wrapper {
    .spaceship {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-color: #444;
    }
    .cannon {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 250px;
        height: 10px;
        background: white;
        &::after {
          content: '';
          width: 50px;
          height: 50px;
          border: 2px solid red;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

        }
    }
  }
}
</style>