<template>
  <div id="cesiumContainer" class="fullSize"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import MapController from '@/api/cesium/controller/map-controller'

const initMap = () => {
  // clear dom
  MapController.initMap()
}

onMounted(() => {
  initMap()
})
</script>

<style lang="scss">
#cesiumContainer {
  width: 100%;
  height: calc(100vh - 50px);
}
.cesium-viewer-bottom {
  display: none !important;
}
</style>
