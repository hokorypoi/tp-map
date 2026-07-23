<template>
  <div id="list-panel" v-show="listPanelOpen">
    <q-list dense padding>
      <q-item v-for="(item, index) in list" :key="index">
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <q-item-label caption>{{ item.coordinates }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/main-store.js'
import { storeToRefs } from 'pinia'
import DbInstance from '@/db/db'

const mainStore = useMainStore()
const { listPanelOpen } = storeToRefs(mainStore)

const list = ref([])

async function fetchRoads() {
  const roads = (await DbInstance.getAllRoads()) || []
  console.log('Fetched roads from database:', roads)
  list.value = roads.map((road) => ({
    name: road.name,
    coordinates: road.coordinates,
  }))
}

watch(listPanelOpen, (newValue) => {
  if (newValue) {
    fetchRoads()
    // Perform actions when the list panel is opened
  } else {
    // Perform actions when the list panel is closed
  }
})
</script>

<style lang="scss" scoped>
#list-panel {
  position: absolute;
  top: 48px;
  left: 48px;
  width: 280px;
  min-height: 200px;
  max-height: calc(100vh - 240px);
  padding: 4px;
  border-radius: 3px;
  background-color: $dark;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
</style>
