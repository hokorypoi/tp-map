<template>
  <div id="list-panel" v-show="listPanelOpen">
    <q-list dense bordered separator>
      <q-item
        v-for="(item, index) in list"
        :key="index"
        clickable
        style="padding: 2px 6px"
        @click="flyToFeature(item.id)"
      >
        <q-item-section avatar no-wrap>
          <q-icon color="primary" name="flight_takeoff" size="20px" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useMaplibreStore } from '@/stores/maplibre-store.js'
import { storeToRefs } from 'pinia'
import MapController from '@/api/maplibre/controller/map-controller'

const store = useMaplibreStore()
const { listPanelOpen } = storeToRefs(store)

const list = ref([])

function flyToFeature(id) {
  MapController.flyToById(id)
  store.updateFeatureInfoBoxState({ open: true, id })
}

watch(listPanelOpen, (newValue) => {
  if (newValue) {
    list.value = MapController.getDataList()
    // Perform actions when the list panel is opened
  } else {
    // Perform actions when the list panel is closed
    list.value = []
  }
})
</script>
<style lang="scss">
#list-panel {
  position: absolute;
  top: 50px;
  left: 10px;
  width: 240px;
  min-height: 100px;
  max-height: calc(100vh - 240px);
  padding: 4px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 1);
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  .qsa {
    min-height: 200px;
    height: calc(100vh - 250px);
    max-height: calc(100vh - 250px);
  }

  .q-item__section--avatar {
    min-width: 30px;
    padding-right: 2px;
  }
}
</style>
