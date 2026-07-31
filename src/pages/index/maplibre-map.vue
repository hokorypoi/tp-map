<template>
  <div id="maplibreMap"></div>
  <toolbar-left-top />
  <list-panel />
  <feature-info-box />
</template>

<script setup>
import MapController from '@/api/maplibre/controller/map-controller'
import { onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import ToolbarLeftTop from '@/components-maplibre/bar/toolbar-left-top.vue'
import listPanel from '@/components-maplibre/panel/list-panel.vue'
import FeatureInfoBox from '@/components-maplibre/box/feature-info-box.vue'
const $q = useQuasar()

onMounted(() => {
  MapController.initMap()
  $q.dark.set(false) // or false or "auto"
  console.log(window.appMaplibreConf)
})

onUnmounted(() => {
  $q.dark.set(true) // or false or "auto"
})
</script>

<style>
#maplibreMap {
  height: calc(100vh - 50px);
}
.maplibregl-ctrl-bottom-right {
  display: none;
}

.maplibre-marker {
  background-size: contain;
  display: block;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  border: 4px solid rgba(243, 31, 137, 0.8);
}
</style>
