<template>
  <div>
    <div class="flex justify-between my-32">
      <div class="w-1/2 mx-4">
        <TrxTable />
      </div>
      <div class="w-1/2 mx-4">
        <AuthTable />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TrxTable from './TrxTable.vue';
import AuthTable from './AuthTable.vue';
</script>
