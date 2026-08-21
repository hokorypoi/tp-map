<template>
  <div id="list-panel" v-show="listPanelOpen">
    <q-list dense bordered separator>
      <template v-for="(item, index) in list" :key="index">
        <template v-if="item.type === 'point'">
          <q-item clickable style="padding: 2px 6px" @click="flyToFeature(item.id)">
            <q-item-section avatar no-wrap>
              <q-icon :name="`${item.type === 'point' ? 'add_a_photo' : 'forest'}`" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label
                >{{ item.label }}
                <q-badge v-if="item.isNew" color="red" align="middle" rounded outline>New</q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-else-if="item.type === 'line'">
          <q-expansion-item
            class="expansion-parent"
            dense
            dense-toggle
            expand-separator
            @click="flyToFeature(item.id)"
            :model-value="expandKey === item.id"
            @update:model-value="
              (v) => {
                onExpandChange(v, item.id)
              }
            "
          >
            <template v-slot:header>
              <q-item-section avatar no-wrap>
                <q-icon :name="`${item.type === 'point' ? 'add_a_photo' : 'forest'}`" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ item.label }}
                  <q-badge v-if="item.isNew" color="red" align="middle" rounded outline
                    >New</q-badge
                  >
                </q-item-label>
              </q-item-section>
            </template>
            <template v-for="(line, jIndex) in item.lines" :key="jIndex">
              <q-list dense bordered separator class="inner-list">
                <q-item clickable :style="`padding: 2px 6px`" @click="flyToLine(line)">
                  <q-item-section avatar no-wrap>
                    <q-icon name="call_split" size="20px" :style="`color: ${line.color};`" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ line.name }} </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </q-expansion-item>
        </template>
      </template>
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
const expandKey = ref('')

function onExpandChange(v, id) {
  expandKey.value = v ? id : ''
}

function flyToFeature(id) {
  MapController.flyToById(id)
  store.updateFeatureInfoBoxState({ open: true, id })
}

function flyToLine(item) {
  MapController.flyToLine(item)
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
  width: 360px;
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

  .expansion-parent .q-item {
    padding: 0 6px !important;
  }
  .inner-list {
    font-size: 12px !important;
  }
}
</style>
