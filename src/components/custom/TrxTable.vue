<template>
  <h3 class="text-lg">Transaction:</h3>
  <Skeleton v-if="wax.isLoading.value" class="h-[125px] w-full rounded-xl" />
  <Table v-else>
    <TableHeader>
      <TableRow>
        <TableHead>Transaction ID</TableHead>
        <TableHead>Sig Digest</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-if="wax.id.value.length > 0 && wax.shouldDisplayInformation.value">
        <TableCell>
          <TooltipWorker>
            <template #trigger>
              <span class="inline-flex transition-colors p-3 rounded-lg hover:bg-accent hover:cursor-pointer" @click="waxStore.copy(wax.id.value)">
                <span class="inline-flex items-center">
                  {{ `${wax.id.value.slice(0, 5)}...${wax.id.value.slice(-5)}` }}
                  <svg-icon class="ml-2" type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
                </span>
              </span>
            </template>
            <template #content>
              <div class="flex flex-col">
                <span class="text-lg">Transaction ID</span>
                <hr class="my-2" />
                <span>{{ wax.id.value }}</span>
              </div>
            </template>
          </TooltipWorker>
        </TableCell>
        <TableCell>
          <TooltipWorker>
            <template #trigger>
              <span class="inline-flex transition-colors p-3 rounded-lg hover:bg-accent hover:cursor-pointer" @click="waxStore.copy(wax.sigDigest.value)">
                <span class="inline-flex items-center">
                  {{ `${wax.sigDigest.value.slice(0, 5)}...${wax.sigDigest.value.slice(-5)}` }}
                  <svg-icon class="ml-2" type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
                </span>
              </span>
            </template>
            <template #content>
              <div class="flex flex-col">
                <span class="text-lg">Sig Digest</span>
                <hr class="my-2" />
                <span>{{ wax.sigDigest.value }}</span>
              </div>
            </template>
          </TooltipWorker>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script lang="ts" setup>
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import TooltipWorker from './TooltipWorker.vue';
// @ts-expect-error Missing declaration files
import svgIcon from '@jamescoyle/vue-icon';
import { mdiClipboardMultipleOutline } from '@mdi/js';
import { useWaxStore } from '@/store/wax';
import { storeToRefs } from 'pinia';

const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);
</script>
