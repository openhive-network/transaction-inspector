<template>
  <h3 class="text-lg">Required Authorities:</h3>
  <Skeleton v-if="wax.isLoading.value" class="h-[125px] w-full rounded-xl" />
  <Table v-else>
    <TableHeader>
      <TableRow>
        <TableHead>Authority account</TableHead>
        <TableHead>Authority type</TableHead>
        <TableHead>Satisfied</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-if="wax.signedBy.value.length > 0">
        <TableCell>
          <a
            :href="`https://explore.openhive.network/@${wax.signedBy.value}`"
            target="_blank"
            class="inline-flex items-center p-3 transition-colors rounded-lg hover:bg-accent">
            {{ `@${wax.signedBy.value}` }} <svg-icon class="ml-2" type="mdi" :path="mdiOpenInNew" width="16" height="16" />
          </a>
        </TableCell>
        <TableCell>
          <div v-for="(signer, index) in wax.authType.value" :key="index">{{ signer }}</div>
        </TableCell>
        <TableCell>
          <div v-for="(signer, index) in wax.authType.value" :key="index" class="flex justify-center">
            <svg-icon type="mdi" :path="signer === wax.expectedAuthType.value ? mdiCheck : mdiClose" width="16" height="16" />
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script lang="ts" setup>
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { storeToRefs } from 'pinia';
import { useWaxStore } from '@/store/wax';
import { mdiOpenInNew, mdiCheck, mdiClose } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';

const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);
</script>
