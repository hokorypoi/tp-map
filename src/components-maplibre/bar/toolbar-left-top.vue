<template>
  <div id="toolbar-left-top">
    <q-btn @click="MapController.toggleBufferCircle()">Buffer</q-btn>
    <q-btn @click="store.toggleListPanel()">List</q-btn>
  </div>
</template>

<script setup>
import MapController from '@/api/maplibre/controller/map-controller'
import { useMaplibreStore } from '@/stores/maplibre-store.js'

const store = useMaplibreStore()
</script>

<style lang="scss">
#toolbar-left-top {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.7);
}
</style>
