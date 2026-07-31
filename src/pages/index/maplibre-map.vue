<template>
  <div id="maplibreMap"></div>
  <toolbar-left-top />
  <list-panel />
</template>

<script setup>
import MapController from '@/api/maplibre/controller/map-controller'
import { onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import ToolbarLeftTop from '@/components-maplibre/bar/toolbar-left-top.vue'
import listPanel from '@/components-maplibre/panel/list-panel.vue'
const $q = useQuasar()

onMounted(() => {
  MapController.initMap()
  $q.dark.set(false) // or false or "auto"
})

onUnmounted(() => {
  $q.dark.set(true) // or false or "auto"
})
</script>

<style>
#maplibreMap {
  height: calc(100vh - 50px);
}
</style>
