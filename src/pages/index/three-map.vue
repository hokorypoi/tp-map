<template>
  <div :id="ID"></div>
</template>

<script setup>
import { onMounted, watch, onBeforeUnmount } from 'vue'
import { useMainStore } from '@/stores/main-store.js'
import { storeToRefs } from 'pinia'
import SceneController from '@/api/three/controller/scene-controller'

const mainStore = useMainStore()
const { leftDrawerOpen } = storeToRefs(mainStore)

const ID = 'three-container'

onMounted(() => {
  SceneController.initScene(ID)
})

watch(leftDrawerOpen, () => {
  SceneController.resizeRenderer()
})

onBeforeUnmount(() => {
  SceneController.destroyScene()
})
</script>

<style lang="scss">
#three-container {
  width: 100%;
  height: calc(100vh - 50px);
  overflow: hidden;
}
</style>
