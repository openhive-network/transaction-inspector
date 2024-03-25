<template>
  <div class="flex flex-col">
    <div v-if="wax.keys.value.length > 0">
      <p v-if="wax.correctlySigned" class="text-2xl text-green p-4 text-center rounded-sm border-2 border-green bg-green60">
        Your transaction is valid.
      </p>
      <p v-else class="text-2xl text-destructive p-4 text-center rounded-sm border-2 border-destructive bg-red60">Your transaction is invalid.</p>
    </div>
    <Table class="mt-16">
      <TableCaption>Key informations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="text-lg">Signature</TableHead>
          <TableHead class="text-lg">HF26</TableHead>
          <TableHead class="text-lg">Public key</TableHead>
          <TableHead class="text-lg">Account auths</TableHead>
          <TableHead class="text-lg text-center">
            Authorities
            <hr class="my-2" />
            <div class="flex justify-between">
              <span class="text-lg">Signed by</span>
              <span class="text-lg">Satisfied</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="wax.keys.value.length > 0">
          <TableCell>
            <span
              v-for="(signature, index) in wax.signatures.value"
              :key="index"
              class="inline-flex transition-colors p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
              @click="waxStore.copy(signature)">
              <span class="inline-flex items-center">
                {{ `${signature.substring(0, 5)}...${signature.substring(signature.length - 5)}\n` }}
                <svg-icon class="ml-2" type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
              </span>
              <hr v-if="wax.signatures.value.length > 1" class="my-3" />
            </span>
          </TableCell>
          <TableCell> a </TableCell>
          <TableCell>
            <span
              v-for="(key, index) in wax.keys.value"
              :key="index"
              class="inline-flex transition-colors p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
              @click="waxStore.copy(key)">
              <span class="inline-flex items-center">
                {{ `${key.substring(0, 5)}...${key.substring(key.length - 5)}\n` }}
                <svg-icon class="ml-2" type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
              </span>
              <hr v-if="wax.keys.value.length > 1" class="my-3" />
            </span>
          </TableCell>
          <TableCell
            v-if="wax.accountsAuth.value.length !== 0"
            v-for="(account, index) in wax.accountsAuth.value"
            :key="index"
            class="max-w-[100px] text-ellipsis overflow-hidden">
            <p v-for="(el, index) in account" :key="index">{{ el }}</p>
            <hr v-if="wax.accountsAuth.value.length > 1" class="my-3" />
          </TableCell>
          <TableCell v-else>...</TableCell>
          <TableCell>
            <a
              :href="`https://explore.openhive.network/@${wax.signedBy.value}`"
              target="_blank"
              class="transition-colors p-3 rounded-lg hover:bg-accent">
              {{ `@${wax.signedBy.value}` }}
            </a>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWaxStore } from '@/store/wax';
import { mdiClipboardMultipleOutline, mdiCheck, mdiClose } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';
import { storeToRefs } from 'pinia';

const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);
</script>
