<template>
  <q-layout view="hHh lpR fFf" class="bg-dark-page">
    <q-header elevated class="bg-dark" height-hint="64">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
          <img src="logo/logo-google.svg" />
          <span class="q-ml-sm">TPMap</span>
        </q-toolbar-title>

        <q-space />

        <q-space />
        <HeaderRightContent />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-dark" :width="280">
      <q-scroll-area class="fit">
        <LeftDrawerContent />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div id="page-inner" class="relative-position">
        <MapView />
        <ToolbarRight />
        <ToolbarLeftTop />
        <ListPanel />
        <AddRoadDialog />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import MapView from '@/components/view/map-view.vue'
import ToolbarRight from '@/components/bar/toolbar-right.vue'
import ToolbarLeftTop from '@/components/bar/toolbar-left-top.vue'
import LeftDrawerContent from '@/components/content/left-drawer-content.vue'
import HeaderRightContent from '@/components/content/header-right-content.vue'
import ListPanel from '@/components/panel/list-panel.vue'
import AddRoadDialog from '@/components/dialog/add-road-dialog.vue'
import { useMainStore } from '@/stores/main-store.js'
import { storeToRefs } from 'pinia'

const mainStore = useMainStore()

const { leftDrawerOpen } = storeToRefs(mainStore)

function toggleLeftDrawer() {
  mainStore.toggleLeftDrawer()
}
</script>

<style lang="sass">
.GNL

  &__toolbar
    height: 48px

  &__toolbar-input
    width: 55%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #fff

    .q-item__label
      color: #fff
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #fff
</style>
