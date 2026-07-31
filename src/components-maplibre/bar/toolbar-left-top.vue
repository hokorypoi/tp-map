<template>
  <div id="toolbar-left-top">
    <q-btn @click="MapController.toggleBufferCircle()">toggle</q-btn>
  </div>
</template>

<script setup>
import MapController from '@/api/maplibre/controller/map-controller'
</script>

<style lang="scss">
#toolbar-left-top {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
