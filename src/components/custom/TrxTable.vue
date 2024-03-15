<template>
  <h3 class="text-lg">Transaction:</h3>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Transaction ID</TableHead>
        <TableHead>Sign Digest</TableHead>
        <TableHead>Transaction Hash</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <span id="1">1</span>
          <Button variant="ghost" size="icon" @click="copy(1)">
            <svg-icon type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
          </Button>
        </TableCell>
        <TableCell>
          <span id="2">2</span>
          <Button variant="ghost" size="icon" @click="copy(2)">
            <svg-icon type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
          </Button>
        </TableCell>
        <TableCell>
          <span id="3">3</span>
          <Button variant="ghost" size="icon" @click="copy(3)">
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

const { toast } = useToast();

const copy = async (id: number): Promise<void> => {
  const textToCopy = document.getElementById(id.toString())! as HTMLSpanElement;

  try {
    await navigator.clipboard.writeText(textToCopy.innerHTML);
    toast({
      title: 'Successfully copied',
      description: textToCopy.innerHTML,
    });
  } catch (error: any) {
    toast({
      title: 'Failed to copy',
      variant: 'destructive',
    });
  }
};
</script>
