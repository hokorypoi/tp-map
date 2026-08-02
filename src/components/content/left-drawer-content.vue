<template>
  <q-list padding dense>
    <q-item
      class="GNL__drawer-item"
      v-ripple
      v-for="link in links1"
      :key="link.text"
      clickable
      @click="link.onClick()"
    >
      <q-item-section avatar>
        <q-icon :name="link.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ link.text }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- <div class="q-mt-md">
      <div class="flex flex-center q-gutter-xs">
        <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="Privacy"
          >Privacy</a
        >
        <span> · </span>
        <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="Terms">Terms</a>
        <span> · </span>
        <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="About"
          >About Google</a
        >
      </div>
    </div> -->
  </q-list>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const links1 = [
  {
    icon: 'south_america',
    text: 'Cesium',
    onClick: function () {
      router.push('/cesium-map')
    },
  },
  {
    icon: 'map',
    text: 'Maplibre',
    onClick: function () {
      router.push('/maplibre-map')
    },
  },
  {
    icon: 'view_in_ar',
    text: 'ThreeJS',
    onClick: function () {
      router.push('/three-map')
    },
  },
]
</script>
