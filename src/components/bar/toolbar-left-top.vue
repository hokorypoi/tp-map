<template>
  <div id="toolbar-right">
    <div class="q-gutter-sm">
      <q-btn round color="dark" icon="home" :size="btnSize" @click="handleBtnClick('home')">
        <q-tooltip> Home </q-tooltip>
      </q-btn>
      <q-btn
        round
        color="dark"
        icon="navigation"
        :size="btnSize"
        @click="handleBtnClick('navigation')"
      >
        <q-tooltip> Draw Road </q-tooltip>
      </q-btn>

      <q-btn
        round
        color="dark"
        icon="directions"
        :size="btnSize"
        @click="handleBtnClick('directions')"
      >
        <q-tooltip> Draw Road </q-tooltip>
      </q-btn>
      <q-btn
        round
        color="dark"
        glossy
        icon="directions_off"
        :size="btnSize"
        @click="handleBtnClick('directions_off')"
      >
        <q-tooltip> Draw Road Cancel </q-tooltip>
      </q-btn>

      <q-btn round color="dark" icon="add" :size="btnSize" @click="mainStore.toggleAddRoadDialog()">
        <q-tooltip> Add Road </q-tooltip>
      </q-btn>
      <q-btn round color="dark" glossy icon="list_alt" :size="btnSize" @click="toggleListPanel">
        <q-tooltip> Toggle List Panel </q-tooltip>
      </q-btn>
      <q-btn
        round
        color="dark"
        icon="my_location"
        :size="btnSize"
        @click="handleBtnClick('my_location')"
      >
        <q-tooltip> My Location </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import MapController from '@/api/cesium/controller/map-controller'
import DrawTool from '@/api/cesium/tool/draw-tool'
import { useMainStore } from '@/stores/main-store.js'

const mainStore = useMainStore()

function toggleListPanel() {
  mainStore.toggleListPanel()
}

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
    case 'directions_off':
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
