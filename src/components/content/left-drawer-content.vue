<template>
  <q-list padding dense>
    <q-item class="GNL__drawer-item" v-ripple v-for="link in links1" :key="link.text" clickable>
      <q-item-section avatar>
        <q-icon :name="link.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ link.text }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset class="q-my-sm" />

    <q-item class="GNL__drawer-item" v-ripple v-for="link in links2" :key="link.text" clickable>
      <q-item-section avatar>
        <q-icon :name="link.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ link.text }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset class="q-my-sm" />

    <q-item class="GNL__drawer-item" v-ripple v-for="link in links3" :key="link.text" clickable>
      <q-item-section>
        <q-item-label>{{ link.text }} <q-icon v-if="link.icon" :name="link.icon" /></q-item-label>
      </q-item-section>
    </q-item>

    <div class="q-mt-md">
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
    </div>
  </q-list>
</template>

<script setup>
import { fasEarthAmericas } from '@quasar/extras/fontawesome-v7'
const links1 = [{ icon: 'web', text: 'Top stories' }]
const links2 = [
  { icon: 'flag', text: 'Canada' },
  { icon: fasEarthAmericas, text: 'World' },
  { icon: 'place', text: 'Local' },
]
const links3 = [
  { icon: '', text: 'Language & region' },
  { icon: '', text: 'Settings' },
]
</script>
