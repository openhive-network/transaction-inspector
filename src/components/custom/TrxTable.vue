<template>
  <h3 class="text-lg">Transaction:</h3>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Transaction ID</TableHead>
        <TableHead>Sig Digest</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-if="wax.id.value.length > 0">
        <TableCell>
          <span class="inline-flex transition-colors p-3 rounded-lg hover:bg-accent hover:cursor-pointer" @click="waxStore.copy(wax.id.value)">
            <span class="inline-flex items-center">
              {{ `${wax.id.value.substring(0, 5)}...${wax.id.value.substring(wax.id.value.length - 5)}` }}
              <svg-icon class="ml-2" type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
            </span>
          </span>
        </TableCell>
        <TableCell>
          <span class="inline-flex transition-colors p-3 rounded-lg hover:bg-accent hover:cursor-pointer" @click="waxStore.copy(wax.sigDigest.value)">
            <span class="inline-flex items-center">
              {{ `${wax.sigDigest.value.substring(0, 5)}...${wax.sigDigest.value.substring(wax.sigDigest.value.length - 5)}` }}
              <svg-icon class="ml-2" type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
            </span>
          </span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script lang="ts" setup>
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/table';
import Button from '../ui/button/Button.vue';
import svgIcon from '@jamescoyle/vue-icon';
import { mdiClipboardMultipleOutline } from '@mdi/js';
import { useWaxStore } from '@/store/wax';
import { storeToRefs } from 'pinia';

const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);
</script>
