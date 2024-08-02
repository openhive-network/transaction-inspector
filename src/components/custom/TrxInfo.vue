<template>
  <div>
    <div class="flex flex-col lg:flex-row justify-between my-32">
      <div class="w-full lg:w-1/3 mx-0 lg:mx-4">
        <TrxTable />
      </div>
      <div class="w-full mt-16 lg:w-2/3 lg:mt-0 mx-0 lg:mx-4">
        <AuthTable />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TrxTable from './TrxTable.vue';
import AuthTable from './AuthTable.vue';
</script>
