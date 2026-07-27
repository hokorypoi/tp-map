<template>
  <q-dialog
    :model-value="modifyRoadDialogData.open"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    @show="onShow()"
    @hide="onHide()"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row items-center">
        <div class="text-h6">修改路线</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="toggleModifyRoadDialog" />
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
        <q-btn label="取消" @click="toggleModifyRoadDialog()" />
        <q-btn label="修改" color="primary" @click="modifyRoad()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import { useMainStore } from '@/stores/main-store.js'
import { storeToRefs } from 'pinia'
import DbInstance from '@/db/db'
import RoadController from '@/api/cesium/controller/road-controller'
import NotifyTool from '@/tool/notify-tool'

const mainStore = useMainStore()
const { modifyRoadDialogData } = storeToRefs(mainStore)

const roadName = ref('')
const coordinates = ref('')
const selectedModel = ref('')

const modelList = ref([])

async function onShow() {
  const list = RoadController.MODEL_LIST.map((r) => ({ label: r.name, value: r.id }))
  selectedModel.value = list[0]
  modelList.value = list

  const { id } = toRaw(modifyRoadDialogData.value)
  const road = await DbInstance.findById(id)
  const { name, coordinates: c, model_id } = road
  roadName.value = name
  coordinates.value = c
  selectedModel.value = list.find((r) => r.value === model_id) || list[0]
}

function onHide() {
  roadName.value = ''
  coordinates.value = ''
  selectedModel.value = ''
}

function toggleModifyRoadDialog() {
  mainStore.updateModifyRoadDialogData({ open: false })
}

async function modifyRoad() {
  const { value } = toRaw(selectedModel.value)
  const { id } = toRaw(modifyRoadDialogData.value)
  await DbInstance.modifyRoad({
    id: id,
    name: roadName.value,
    coordinates: coordinates.value,
    model_id: value,
  })
  NotifyTool.showNotification('修改完成！', 'positive')
  mainStore.updateModifyRoadDialogData({ open: false })
}
</script>
