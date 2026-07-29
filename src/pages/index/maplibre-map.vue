<template>
  <div id="maplibreMap"></div>
</template>

<script setup>
import MapController from '@/api/maplibre/controller/map-controller'
import { onMounted } from 'vue'

onMounted(() => {
  MapController.initMap()
})
</script>

<style>
#maplibreMap {
  height: calc(100vh - 50px);
}
</style>
