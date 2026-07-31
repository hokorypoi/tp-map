<template>
  <div id="feature-info-box" v-show="featureInfoBoxState.open">
    <q-card class="my-card" flat bordered>
      <!-- <q-img :ratio="16 / 9" src="/static/imgs/plans/hong-jing.jpeg" /> -->

      <q-carousel
        animated
        v-model="slideZL"
        infinite
        swipeable
        :autoplay="1500"
        arrows
        :style="`height: 225px;`"
      >
        <template v-if="featureData && featureData.images && featureData.images.length">
          <template v-for="(img, index) in featureData.images" :key="index">
            <q-carousel-slide :name="index" :img-src="img" />
          </template>
        </template>
        <template v-else>
          <q-carousel-slide :name="1" img-src="/static/imgs/plans/mountains.jpg" />
        </template>
      </q-carousel>

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ featureData ? featureData.name : '' }}</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            {{ featureData ? featureData.distance : '' }}
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">{{ featureData ? featureData.subtitle : '' }}</div>
        <div class="text-caption text-grey">
          {{ featureData ? featureData.desc : '' }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMaplibreStore } from '@/stores/maplibre-store.js'
import { storeToRefs } from 'pinia'
import MapController from '@/api/maplibre/controller/map-controller'

const store = useMaplibreStore()

const { featureInfoBoxState } = storeToRefs(store)

const featureData = ref({})

const slideZL = ref(1)

watch(featureInfoBoxState, (newValue) => {
  if (newValue.open) {
    featureData.value = MapController.getDataById(newValue.id)
    // Perform actions when the list panel is opened
  } else {
    // Perform actions when the list panel is closed
    featureData.value = {}
  }
})
</script>

<style lang="scss">
#feature-info-box {
  position: absolute;
  top: 40px;
  right: 40px;
}
.my-card {
  border-radius: 10px;
  width: 400px;
}
</style>
