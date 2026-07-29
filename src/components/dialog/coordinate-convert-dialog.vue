<template>
  <q-dialog
    :model-value="coordinateConvertDialogOpen"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row items-center">
        <div class="text-h6">坐标数据转换</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="mainStore.toggleCoordinateConvertDialog()" />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: calc(100vh - 280px)" class="scroll">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left" style="width: 20%">上传文件</th>
              <th class="text-left" style="width: 80%">
                <q-file
                  dense
                  :model-value="file"
                  @update:model-value="onChooseFile"
                  label="选择 .ovkml 文件"
                  outlined
                  accept=".ovkml"
                  style="max-width: 240px"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left" style="width: 20%">原始坐标数据</td>
              <td class="text-left" style="width: 80%">
                <q-input
                  outlined
                  dense
                  v-model="lineInput"
                  type="textarea"
                  placeholder="请输入坐标数据"
                />
              </td>
            </tr>
            <tr>
              <td colspan="2" class="text-right">
                <q-btn dense color="dark" @click="doClear()">
                  <q-icon name="clear" style="padding-right: 4px" />
                  清空
                </q-btn>

                <q-btn dense color="secondary" @click="doConvert()" style="margin-left: 8px">
                  <q-icon name="build_circle" style="padding-right: 4px" />
                  数据转换3维
                </q-btn>
                <q-btn dense color="secondary" @click="doConvert2()" style="margin-left: 8px">
                  <q-icon name="build_circle" style="padding-right: 4px" />
                  数据转换2维
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">转换后的坐标数据</td>
              <td class="text-left">
                <q-input outlined dense v-model="coordinates" type="textarea" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn label="取消" @click="mainStore.toggleCoordinateConvertDialog()" />
        <q-btn label="复制" color="primary" @click="copyOutputCoordinates()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useMainStore } from '@/stores/main-store.js'
import { storeToRefs } from 'pinia'
import NotifyTool from '@/tool/notify-tool'

const mainStore = useMainStore()
const { coordinateConvertDialogOpen } = storeToRefs(mainStore)

const file = ref([])

const lineInput = ref('')
const coordinates = ref('')

async function onChooseFile(f) {
  file.value = f
  try {
    const xmlDoc = await parseXmlFile(f)

    const nodes = xmlDoc.getElementsByTagName('LineString')

    if (nodes.length) {
      let text = ''
      for (const node of nodes) {
        text += node.textContent
      }
      lineInput.value = text
    }
  } catch (err) {
    console.error(err)
  }
}

async function parseXmlFile(file) {
  if (!file) {
    throw new Error('请传入文件')
  }

  const text = await file.text() // 读取文件内容
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(text, 'application/xml')

  const parserError = xmlDoc.getElementsByTagName('parsererror')[0]
  if (parserError) {
    throw new Error('XML 格式有误')
  }

  return xmlDoc
}

function doClear() {
  lineInput.value = ''
}

function doConvert() {
  const lineStrValue = lineInput.value
  if (!lineStrValue || lineStrValue === '') {
    NotifyTool.showNotification('请输入要转换的坐标数据！', 'warning')
    return
  }
  let lineStr = lineStrValue.replace(/,0/g, ',0,')
  const lineArr = lineStr.split(',')
  const lineJoinArr = []
  const lineCoords = []
  let tmpPoint = []
  for (let i = 0; i < lineArr.length; i++) {
    tmpPoint.push(Number(lineArr[i]))

    if (tmpPoint.length == 3) {
      lineJoinArr.push(JSON.parse(JSON.stringify(tmpPoint)))
      lineCoords.push({
        longitude: Number(tmpPoint[0]),
        latitude: Number(tmpPoint[1]),
        height: 0,
      })
      tmpPoint = []
    }
  }

  coordinates.value = JSON.stringify(lineCoords)
}

function doConvert2() {
  const lineStrValue = lineInput.value
  if (!lineStrValue || lineStrValue === '') {
    NotifyTool.showNotification('请输入要转换的坐标数据！', 'warning')
    return
  }
  let lineStr = lineStrValue.replace(/,0/g, ',0,')
  const lineArr = lineStr.split(',')
  const lineJoinArr = []
  const lineCoords = []
  let tmpPoint = []
  for (let i = 0; i < lineArr.length; i++) {
    tmpPoint.push(Number(lineArr[i]))

    if (tmpPoint.length == 3) {
      lineJoinArr.push(JSON.parse(JSON.stringify(tmpPoint)))
      lineCoords.push([Number(tmpPoint[0]), Number(tmpPoint[1])])
      tmpPoint = []
    }
  }

  coordinates.value = JSON.stringify(lineCoords)
}

function copyOutputCoordinates() {
  const coordinatesValue = coordinates.value
  if (!coordinatesValue || coordinatesValue === '') {
    NotifyTool.showNotification('没有可复制的数据！', 'warning')
    return
  }
  // Copy the message to clipboard
  navigator.clipboard
    .writeText(coordinatesValue)
    .then(() => {
      NotifyTool.showNotification('坐标数据已复制到剪切板！', 'positive', 'top')
    })
    .catch((err) => {
      console.error('Failed to copy: ', err)
    })
}

onMounted(function () {})
</script>
