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
      <TableRow class="leading-10">
        <TableCell>thatcryptodave</TableCell>
        <TableCell>Posting</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script lang="ts" setup>
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/table';
</script>
