<template>
  <div id="cesiumContainer" class="fullSize"></div>
</template>

<script setup>
// import * as Cesium from "cesium";
const Cesium = window.Cesium

const initMap = () => {
  // clear dom
  const container = document.getElementById('cesiumContainer')
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }

  const viewer = new Cesium.Viewer('cesiumContainer')

  // 设置相机视角
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 10000000 * 1.5), // 设置相机位置和高度
  })
}

setTimeout(() => {
  initMap()
}, 300)
</script>

<style lang="scss">
#cesiumContainer {
  width: 100%;
  height: calc(100vh - 64px);
}
</style>
