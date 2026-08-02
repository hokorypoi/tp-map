<template>
  <div :id="ID">
    <canvas id="c"></canvas>
    <div id="three-toolbar-top-left"></div>
  </div>
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
  SceneController.initScene()
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
  position: relative;

  #c {
    width: 100%;
    height: 100%;
    display: block;
  }

  #three-toolbar-top-left {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 32px;
    min-height: 40px;
    background-color: black;
    border-radius: 3px;
  }
}
</style>
