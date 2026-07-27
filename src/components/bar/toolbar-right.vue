<template>
  <div id="toolbar-right">
    <div class="q-gutter-sm">
      <q-btn
        round
        color="dark"
        icon="auto_mode"
        :size="btnSize"
        @click="MapController.toggleAutoRotate()"
      >
        <q-tooltip>地球自转</q-tooltip>
      </q-btn>
      <q-btn round color="dark" icon="flip_camera_android" :size="btnSize">
        <q-tooltip>绕中心旋转</q-tooltip>
      </q-btn>
      <q-btn
        round
        color="dark"
        icon="history_toggle_off"
        :size="btnSize"
        @click="toggleTimelineAnimation()"
      >
        <q-tooltip>时间轴动画</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import MapController from '@/api/cesium/controller/map-controller'

const btnSize = 'sm'

let timelineAnimationShow = true
function toggleTimelineAnimation() {
  timelineAnimationShow = !timelineAnimationShow
  const timelineClassName = 'cesium-viewer-timelineContainer'
  const animationClassName = 'cesium-viewer-animationContainer'
  const domT = document.querySelector(`.${timelineClassName}`)
  const domA = document.querySelector(`.${animationClassName}`)
  domT.style.display = timelineAnimationShow ? 'block' : 'none'
  domA.style.display = timelineAnimationShow ? 'block' : 'none'
}
</script>

<style lang="scss" scoped>
#toolbar-right {
  position: absolute;
  bottom: 48px;
  right: 10px;
  width: 32px;
  min-height: 40px;
  background-color: transparent;
  border-radius: 3px;
  z-index: 1000;
}
</style>
