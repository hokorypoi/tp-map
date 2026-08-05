<template>
  <div id="basemap-panel" v-show="basemapPanelOpen">
    <template v-for="(item, index) in list" :key="index">
      <div class="basemap-div" :id="`${w_key}${index}`" @click="changeBasemap(index)">
        <div class="bm-label">{{ item.name }}</div>
      </div>
      <div style="height: 1px"></div>
    </template>
  </div>
</template>

<script setup>
import { Map } from 'maplibre-gl'
import { onUnmounted, ref, watch } from 'vue'
import { useMaplibreStore } from '@/stores/maplibre-store.js'
import { storeToRefs } from 'pinia'
import MapController from '@/api/maplibre/controller/map-controller'

const store = useMaplibreStore()
const { basemapPanelOpen } = storeToRefs(store)

const w_key = 'basemap_'

let mapObjs = []

const list = ref([])

function changeBasemap(index) {
  MapController.setBasemap(index)
}

onUnmounted(() => {
  if (mapObjs.length) {
    mapObjs.forEach((map) => {
      map.remove()
    })
  }
})

watch(basemapPanelOpen, (newValue) => {
  if (newValue) {
    const ls = MapController.getBasemapData().list
    list.value = ls

    const { zoom, center } = MapController.getMapViewportInfo()

    setTimeout(function () {
      ls.forEach((item, index) => {
        const map = new Map({
          container: `${w_key}${index}`, // container id
          zoom: zoom,
          center: center,
          style: item.style,
          doubleClickZoom: false,
          dragPan: false,
          dragRotate: false,
        })
        mapObjs.push(map)
        MapController.addEventToMapMoveEnd(`${w_key}${index}`, function ({ center, zoom }) {
          map.easeTo({ center, zoom, speed: 0.1, curve: 1 })
        })
      })
    }, 300)

    // Perform actions when the list panel is opened
  } else {
    // Perform actions when the list panel is closed
    list.value = []
    if (mapObjs.length) {
      mapObjs.forEach((map, index) => {
        MapController.removeEventFromMapMoveEnd(`${w_key}${index}`)
        map.remove()
      })
    }
  }
})
</script>

<style lang="scss">
#basemap-panel {
  position: absolute;
  top: 50px;
  left: 10px;
  width: 240px;
  min-height: 100px;
  max-height: calc(100vh - 240px);
  padding: 2px 6px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 1);
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  .basemap-div {
    width: 100%;
    height: 60px;
    border-radius: 5px;
    position: relative;
    margin: 4px 0;
    border: 2px solid rgb(12, 121, 245);

    .bm-label {
      z-index: 2;
      position: absolute;
      top: 4px;
      left: 4px;
      color: #fff;
      font-size: 16px;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 4px 16px;
      border-radius: 5px;
    }
  }
}
</style>
