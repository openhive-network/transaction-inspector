<template>
  <h3 class="text-lg">Transaction:</h3>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Transaction ID</TableHead>
        <TableHead>Sig Digest</TableHead>
        <TableHead>Transaction Hash</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-if="wax.id.value.length > 0">
        <TableCell class="transition-colors hover:bg-accent hover:cursor-pointer" @click="copy(wax.id.value)">
          <span class="flex justify-between">
            {{ `${wax.id.value.substring(0, 5)}...${wax.id.value.substring(wax.id.value.length - 5)}` }}
            <svg-icon type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
          </span>
        </TableCell>
        <TableCell class="transition-colors hover:bg-accent hover:cursor-pointer" @click="copy(wax.sigDigest.value)">
          <span class="flex justify-between">
            {{ `${wax.sigDigest.value.substring(0, 5)}...${wax.sigDigest.value.substring(wax.sigDigest.value.length - 5)}` }}
            <svg-icon type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
          </span>
        </TableCell>
        <TableCell>
          <span id="3">3</span>
          <Button variant="ghost" size="icon">
            <svg-icon type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
          </Button>
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
import { useToast } from '@/components/ui/toast/use-toast';
import { useWaxStore } from '@/store/wax';
import { storeToRefs } from 'pinia';

const { toast } = useToast();
const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);

const copy = async (string: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(string);
    toast({
      title: 'Copied to clipboard!',
      description: string.length > 30 ? `${string.substring(0, 30)}...` : string,
    });
  } catch (error: any) {
    toast({
      title: 'Failed to copy',
      variant: 'destructive',
    });
  }
};
</script>
