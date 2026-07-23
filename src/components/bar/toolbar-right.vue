<template>
  <div id="toolbar-right">
    <div class="q-gutter-sm">
      <q-btn round color="dark" icon="shopping_cart" :size="btnSize" />
      <q-btn round color="dark" icon="navigation" :size="btnSize" />
    </div>
  </div>
</template>

<script setup>
const btnSize = 'sm'
</script>

<style lang="scss" scoped>
#toolbar-right {
  position: absolute;
  bottom: 48px;
  right: 10px;
  width: 32px;
  min-height: 200px;
  background-color: transparent;
  border-radius: 3px;
  z-index: 1000;
}
</style>
