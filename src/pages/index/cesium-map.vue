<template>
  <MapView />
  <ToolbarRight />
  <ToolbarLeftTop />
  <ListPanel />
  <AddRoadDialog />
  <ModifyRoadDialog />
  <CoordinateConvertDialog />
</template>

<script setup>
import MapView from '@/components/view/map-view.vue'
import ToolbarRight from '@/components/bar/toolbar-right.vue'
import ToolbarLeftTop from '@/components/bar/toolbar-left-top.vue'
import ListPanel from '@/components/panel/list-panel.vue'
import AddRoadDialog from '@/components/dialog/add-road-dialog.vue'
import ModifyRoadDialog from '@/components/dialog/modify-road-dialog.vue'
import CoordinateConvertDialog from '@/components/dialog/coordinate-convert-dialog.vue'
</script>
