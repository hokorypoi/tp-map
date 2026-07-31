<template>
  <div id="temp-container-left">
    <q-card class="my-card" flat bordered>
      <!-- <q-img :ratio="16 / 9" src="/static/imgs/plans/hong-jing.jpeg" /> -->

      <q-carousel
        v-model:fullscreen="fullscreenL"
        animated
        v-model="slideZL"
        infinite
        swipeable
        autoplay
        arrows
        :style="`height: ${fullscreenL ? '100vh' : '225px'}`"
      >
        <q-carousel-slide :name="1" img-src="/static/imgs/plans/hong-jing.jpg" />
        <q-carousel-slide :name="2" img-src="/static/imgs/plans/long-xi.jpg" />
        <!-- <q-carousel-slide :name="3" img-src="/static/imgs/plans/hong-jing-r.jpg" />
        <q-carousel-slide :name="4" img-src="/static/imgs/plans/liu-shi-r.jpg" /> -->

        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[4, 4]">
            <q-btn
              push
              round
              dense
              color="white"
              text-color="primary"
              :icon="fullscreenL ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreenL = !fullscreenL"
            />
          </q-carousel-control>
        </template>
      </q-carousel>

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">北京跑山-西线</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            580 km
          </div>
        </div>

        <q-rating v-model="starsZL" :max="5" size="32px" color="amber-14" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">周张路-六石路|红井路|涞宝路-G108-龙西公路</div>
        <div class="text-caption text-grey">
          途经房山几条比较知名的跑山路线。周张路比较干净，爬升不高。周张路北上G108有三条线路可选，分别是红井路（有经典的网红弯）、六石路（摩友口碑不错）、涞宝路（凑合），
          山里气温会低些，可能需要备件稍厚的衣服。路况还可以，路上有些石子啥的。
          然后延G108绕紫荆关去龙西公路，最后是堪比高速的容易线。不走高速，全程580公里左右。个人评价3颗星。
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div id="temp-container-right">
    <q-card class="my-card" flat bordered>
      <q-carousel
        v-model:fullscreen="fullscreenR"
        animated
        v-model="slideZL"
        infinite
        arrows
        swipeable
        autoplay
        :style="`height: ${fullscreenR ? '100vh' : '225px'}`"
      >
        <q-carousel-slide :name="1" img-src="/static/imgs/plans/233.jpg" />
        <q-carousel-slide :name="2" img-src="/static/imgs/plans/233-2.jpg" />
        <!-- <q-carousel-slide :name="3" img-src="/static/imgs/plans/an-si-r.jpg" />
        <q-carousel-slide :name="4" img-src="/static/imgs/plans/fan-qi-r.jpg" /> -->

        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[4, 4]">
            <q-btn
              push
              round
              dense
              color="white"
              text-color="primary"
              :icon="fullscreenR ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreenR = !fullscreenR"
            />
          </q-carousel-control>
        </template>
      </q-carousel>

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">北京跑山-东线</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            660 km
          </div>
        </div>

        <q-rating v-model="starsAF" :max="5" size="32px" color="amber-14" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">安四路-范崎路-蓟县233咖啡</div>
        <div class="text-caption text-grey">
          安四路和范崎路是北京很有名的两条跑山线路，弯道多、路也很干净，追焦法师超多，跑了一圈数了下大概有7、8个。压弯技术好的摩友可以去试试，能获取美美的照片和视频。
          这边的路况都很好，跑着超舒服。 最后是向东出京奔233咖啡。
          没走高速，全程660公里左右。个人评价4颗星。
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const starsZL = ref(3)
const starsAF = ref(4)

const slideZL = ref(1)

const fullscreenL = ref(false)
const fullscreenR = ref(false)
</script>

<style lang="scss">
#temp-container-left {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

#temp-container-right {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 1000;
}
.maplibregl-ctrl-bottom-right {
  display: none;
}
.my-card {
  border-radius: 20px;
  width: 400px;
  display: none;
}
</style>
