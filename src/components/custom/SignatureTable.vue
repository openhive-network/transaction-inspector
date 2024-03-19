<template>
  <div class="flex flex-col">
    <span v-if="wax.correctlySigned" class="text-2xl text-green p-4 text-center rounded-sm border-2 border-green bg-green60">
      Your transaction is valid.
    </span>
    <span v-else class="text-2xl text-destructive p-4 text-center rounded-sm border-2 border-destructive bg-red60">
      Your transaction is invalid.
    </span>
    <Table class="mt-16">
      <TableCaption>Key informations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="text-lg">Signature</TableHead>
          <TableHead class="text-lg">HF26</TableHead>
          <TableHead class="text-lg">Public key</TableHead>
          <TableHead class="text-lg">Accounts</TableHead>
          <TableHead class="text-lg">Signed by</TableHead>
          <TableHead class="text-lg">Satisfied</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="wax.keys.value.length > 0">
          <TableCell
            v-for="(signature, index) in wax.signatures.value"
            :key="index"
            class="transition-colors hover:bg-accent hover:cursor-pointer"
            @click="copy(signature)">
            <span class="flex justify-between">
              {{ `${signature.substring(0, 5)}...${signature.substring(signature.length - 5)}\n` }}
              <svg-icon type="mdi" :path="isCopied ? mdiCheck : mdiClipboardMultipleOutline" width="16" height="16" />
            </span>
          </TableCell>
          <TableCell> a </TableCell>
          <TableCell
            v-for="(key, index) in wax.keys.value"
            :key="index"
            class="transition-colors pb-5 hover:bg-accent hover:cursor-pointer"
            @click="copy(key)">
            <span class="flex justify-between">
              {{ `${key.substring(0, 5)}...${key.substring(key.length - 5)}\n` }}
              <svg-icon type="mdi" :path="isCopied ? mdiCheck : mdiClipboardMultipleOutline" width="16" height="16" />
            </span>
          </TableCell>
          <TableCell v-for="(account, index) in wax.accounts.value" :key="index" class="max-w-[100px] text-ellipsis overflow-hidden">
            <p v-for="(el, index) in account" :key="index">{{ el }}</p>
          </TableCell>
          <TableCell
            v-for="(signer, index) in wax.signedBy.value"
            :key="index"
            class="max-w-[100px] text-ellipsis overflow-hidden hover:overflow-visible">
            {{ `${signer}\n` }}
            <hr v-if="wax.signedBy.value.length > 1" class="my-3" />
          </TableCell>
          <TableCell
            v-for="(signer, index) in wax.signedBy.value"
            :key="index"
            class="max-w-[100px] text-ellipsis overflow-hidden hover:overflow-visible">
            {{ `${signer}\n` }}
            <hr v-if="wax.signedBy.value.length > 1" class="my-3" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWaxStore } from '@/store/wax';
import { inject } from 'vue';
import { mdiCheck, mdiClose, mdiClipboardMultipleOutline } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';
import { useToast } from '../ui/toast';
import { storeToRefs } from 'pinia';

const { toast } = useToast();
const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);

let isCopied = false;

const copy = async (string: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(string);
    isCopied = true;

    setTimeout(() => {
      isCopied = false;
    }, 3000);
  } catch (error: any) {
    toast({
      title: 'Failed to copy',
      variant: 'destructive',
    });
  }
};
</script>
