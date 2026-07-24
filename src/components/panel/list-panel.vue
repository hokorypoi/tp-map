<template>
  <div id="list-panel" v-show="listPanelOpen">
    <q-scroll-area class="qsa">
      <q-list dense bordered separator>
        <q-item v-for="(item, index) in list" :key="index" clickable style="padding: 2px 6px">
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
          <q-item-section avatar style="padding: none">
            <div class="row justify-center">
              <q-btn-group>
                <q-btn
                  dense
                  square
                  size="sm"
                  color="dark"
                  icon="play_arrow"
                  @click="handleItemClick(item)"
                >
                  <q-tooltip>播放动画</q-tooltip>
                </q-btn>
                <q-btn dense square size="sm" color="dark" icon="stop" @click="stopAnimation()">
                  <q-tooltip>停止播放</q-tooltip>
                </q-btn>
              </q-btn-group>
              <q-separator vertical />
              <q-btn-group>
                <q-btn dense square size="sm" color="dark" icon="color_lens">
                  <q-tooltip>线路样式</q-tooltip>
                </q-btn>
              </q-btn-group>
              <q-separator vertical />
              <q-btn-group>
                <q-btn dense square size="sm" color="dark" icon="drive_file_rename_outline">
                  <q-tooltip>编辑线路</q-tooltip>
                </q-btn>
                <q-btn
                  dense
                  square
                  size="sm"
                  color="dark"
                  icon="delete_forever"
                  @click="deleteRoad(item)"
                >
                  <q-tooltip>删除线路</q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/main-store.js'
import { storeToRefs } from 'pinia'
import DbInstance from '@/db/db'
import RoadController from '@/api/cesium/controller/road-controller'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const mainStore = useMainStore()
const { listPanelOpen } = storeToRefs(mainStore)

const list = ref([])

async function fetchRoads() {
  const roads = (await DbInstance.getAllRoads()) || []
  list.value = roads.map((road) => ({
    id: road.id,
    name: road.name,
    coordinates: road.coordinates,
  }))
}

function handleItemClick(item) {
  // Handle item click event, e.g., zoom to the road on the map
  const rowData = {
    id: item.id,
    name: item.name,
    coordinates: JSON.parse(item.coordinates),
  }
  RoadController.playRoadAnimation(rowData) // Assuming coordinates are stored in the item
}

function stopAnimation() {
  RoadController.clearAnimation()
}

function deleteRoad(item) {
  $q.dialog({
    title: '操作提示',
    message: '确定要删除当前线路吗？',
    persistent: true,
    ok: {
      label: '删除',
      color: 'red',
      dense: true,
    },
    cancel: {
      label: '取消',
      color: 'dark',
      dense: true,
    },
  }).onOk(() => {
    DbInstance.deleteRoad(item.id)
    // 如果是当前动画对象，删除之
    RoadController.checkAnimationObjectById(item.id)
    // 刷新列表
    fetchRoads()
  })
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
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  .qsa {
    min-height: 200px;
    height: 400px;
    max-height: calc(100vh - 250px);
  }
}
</style>
