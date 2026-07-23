<template>
  <div id="toolbar-right">
    <div class="q-gutter-sm">
      <q-btn round color="dark" icon="home" :size="btnSize" @click="handleBtnClick('home')" />
      <q-btn
        round
        color="dark"
        icon="navigation"
        :size="btnSize"
        @click="handleBtnClick('navigation')"
      />
      <q-btn
        round
        color="dark"
        icon="directions"
        :size="btnSize"
        @click="handleBtnClick('directions')"
      />
      <q-btn
        round
        color="dark"
        glossy
        icon="layers_clear"
        :size="btnSize"
        @click="handleBtnClick('layers_clear')"
      />

      <q-btn round color="dark" icon="edit_location" :size="btnSize" />
      <q-btn round color="dark" glossy icon="local_grocery_store" :size="btnSize" />
      <q-btn
        round
        color="dark"
        icon="my_location"
        :size="btnSize"
        @click="handleBtnClick('my_location')"
      />
    </div>
  </div>
</template>

<script setup>
import MapController from '@/api/cesium/controller/map-controller'
import DrawTool from '@/api/cesium/tool/draw-tool'
const btnSize = 'sm'

function handleBtnClick(action) {
  switch (action) {
    case 'home':
      MapController.goHome()
      break
    case 'navigation':
      // Handle navigation action
      MapController.testFlyToPoint()
      break
    case 'layers_clear':
      // Handle layers clear action
      DrawTool.disableDrawTool()
      break
    case 'directions':
      // Handle directions action
      DrawTool.initDrawTool(MapController.getViewer())
      break
    case 'edit_location':
      // Handle edit location action
      break
    case 'local_grocery_store':
      // Handle local grocery store action
      break
    case 'my_location':
      // Handle my location action
      MapController.goToMyLocation()
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
#toolbar-right {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 32px;
  min-height: 200px;
  background-color: transparent;
  border-radius: 3px;
  z-index: 1000;
}
</style>
