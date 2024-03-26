<template>
  <h3 class="text-lg">Required Authorities:</h3>
  <Skeleton v-if="wax.isLoading.value" class="h-[125px] w-full rounded-xl" />
  <Table v-else>
    <TableHeader>
      <TableRow>
        <TableHead>Authority account</TableHead>
        <TableHead>Authority type</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow class="leading-10" v-if="wax.signedBy.value.length > 0">
        <TableCell>
          <a
            :href="`https://explore.openhive.network/@${wax.signedBy.value}`"
            target="_blank"
            class="transition-colors p-3 rounded-lg hover:bg-accent">
            {{ `@${wax.signedBy.value}` }}
          </a>
        </TableCell>
        <TableCell>
          <div v-for="(signer, index) in wax.authType.value" :key="index">{{ signer }}</div>
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

const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);
</script>
