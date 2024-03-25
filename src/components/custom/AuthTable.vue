<template>
  <h3 class="text-lg">Required Authorities:</h3>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Authority account</TableHead>
        <TableHead>Authority type</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow class="leading-10" v-if="wax.signedBy.value.length > 0">
        <TableCell>@{{ wax.signedBy.value }}</TableCell>
        <TableCell>
          <div v-for="(signer, index) in wax.authType.value" :key="index">{{ signer }}</div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script lang="ts" setup>
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/table';
import { storeToRefs } from 'pinia';
import { useWaxStore } from '@/store/wax';

const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);
</script>
