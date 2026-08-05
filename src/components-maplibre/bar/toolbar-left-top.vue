<template>
  <div id="toolbar-left-top">
    <q-btn dense @click="MapController.goHome()">
      <q-icon name="home" :size="iconSize" />
      <q-tooltip>Home</q-tooltip>
    </q-btn>
    <q-btn dense @click="MapController.toggleBufferCircle()">
      <q-icon name="noise_aware" :size="iconSize" />
      <q-tooltip>Buffer</q-tooltip>
    </q-btn>
    <q-btn dense @click="MapController.toggleRouteLineObjects()">
      <q-icon name="airline_stops" :size="iconSize" />
      <q-tooltip>Route</q-tooltip>
    </q-btn>
    <q-btn dense @click="MapController.togglePulsingDotObjects()">
      <q-icon name="rss_feed" :size="iconSize" />
      <q-tooltip>PulsingDot</q-tooltip>
    </q-btn>
    <q-btn dense @click="store.toggleListPanel()" style="margin-left: 4x">
      <q-icon name="view_list" :size="iconSize" />
      <q-tooltip>List</q-tooltip>
    </q-btn>
    <q-btn dense @click="store.toggleBasemapPanel()" style="margin-left: 4x">
      <q-icon name="layers" :size="iconSize" />
      <q-tooltip>Layers</q-tooltip>
    </q-btn>
    <q-btn
      dense
      @click="store.updateFeatureInfoBoxState({ open: false, id: '' })"
      style="margin-left: 4x"
    >
      <q-icon name="live_help" :size="iconSize" />
      <q-tooltip>InfoBox</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import MapController from '@/api/maplibre/controller/map-controller'
import { useMaplibreStore } from '@/stores/maplibre-store.js'

const store = useMaplibreStore()

const iconSize = '20px'
</script>

<style lang="scss">
#toolbar-left-top {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 1);
  // padding: 2px 4px;
}
</style>
