<template>
  <div id="list-panel" v-show="listPanelOpen">
    <template v-for="item in list" :key="item.id">
      <p>{{ item.name }}</p>
    </template>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useMaplibreStore } from '@/stores/maplibre-store.js'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const store = useMaplibreStore()
const { listPanelOpen } = storeToRefs(store)

const list = ref([])
onMounted(() => {
  const appConf = window.appMaplibreConf
  list.value = appConf.list.map((r, index) => ({ id: index, ...r }))
})
</script>
<style lang="scss">
#list-panel {
  position: absolute;
  top: 48px;
  left: 48px;
  width: 280px;
  min-height: 200px;
  max-height: calc(100vh - 240px);
  padding: 4px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  .qsa {
    min-height: 200px;
    height: calc(100vh - 250px);
    max-height: calc(100vh - 250px);
  }
}
</style>
