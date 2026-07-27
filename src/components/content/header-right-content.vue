<template>
  <div class="q-gutter-sm row items-center no-wrap">
    <q-btn v-if="$q.screen.gt.sm" round dense flat icon="apps">
      <q-tooltip>Google Apps</q-tooltip>
    </q-btn>
    <q-btn round dense flat color="grey-8" icon="notifications">
      <q-badge color="red" text-color="white" floating> 2 </q-badge>
      <q-tooltip>Notifications</q-tooltip>
    </q-btn>
    <q-btn round flat>
      <q-avatar size="26px">
        <img src="static/imgs/avatar/rikka.gif" />
      </q-avatar>
      <q-tooltip>Account</q-tooltip>
    </q-btn>
  </div>
</template>
