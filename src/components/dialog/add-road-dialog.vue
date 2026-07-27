<template>
  <q-dialog
    :model-value="addRoadDialogOpen"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row items-center">
        <div class="text-h6">添加路线</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="mainStore.toggleAddRoadDialog()" />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: calc(100vh - 280px)" class="scroll">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left" style="width: 20%">线路名</th>
              <th class="text-left" style="width: 80%">
                <q-input outlined dense v-model="roadName" placeholder="请输入线路名" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">模型</td>
              <td class="text-left">
                <q-select outlined dense v-model="selectedModel" :options="modelList" />
              </td>
            </tr>
            <tr>
              <td class="text-left">坐标数组</td>
              <td class="text-left">
                <q-input
                  outlined
                  dense
                  v-model="coordinates"
                  type="textarea"
                  placeholder="请输入坐标数组"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn label="取消" @click="mainStore.toggleAddRoadDialog()" />
        <q-btn label="添加" color="primary" @click="addRoad" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue'
import { useMainStore } from '@/stores/main-store.js'
import { storeToRefs } from 'pinia'
import DbInstance from '@/db/db'
import RoadController from '@/api/cesium/controller/road-controller'

const mainStore = useMainStore()
const { addRoadDialogOpen } = storeToRefs(mainStore)

const roadName = ref('')
const coordinates = ref('')
const selectedModel = ref('')

const modelList = ref([])

onMounted(function () {
  const list = RoadController.MODEL_LIST.map((r) => ({ label: r.name, value: r.id }))
  selectedModel.value = list[0]
  modelList.value = list
})

async function addRoad() {
  const { value } = toRaw(selectedModel.value)

  await DbInstance.addRoad({
    name: roadName.value,
    coordinates: coordinates.value,
    model_id: value,
  })
  mainStore.toggleAddRoadDialog()
}
</script>
