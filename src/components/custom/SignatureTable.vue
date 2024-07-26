<template>
  <Skeleton v-if="wax.isLoading.value" class="h-[125px] w-full rounded-xl" />
  <div v-else class="flex flex-col">
    <Table class="md:mt-6">
      <TableHeader>
        <TableRow>
          <TableHead class="text-lg">Signature</TableHead>
          <TableHead class="text-lg">Pack</TableHead>
          <TableHead class="text-lg">Public key</TableHead>
          <TableHead class="text-lg">Account auths</TableHead>
          <TableHead class="text-lg text-center">
            Authorities
            <hr class="my-2" />
            <div class="flex justify-between">
              <span class="text-lg mr-20 lg:mr-0">Signed by</span>
              <span class="text-lg">Direct</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="wax.keys.value.length > 0 && wax.shouldDisplayInformation.value">
          <TableCell>
            <span
              v-for="(signature, index) in wax.signatures.value"
              :key="index"
              class="inline-flex transition-colors p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
              @click="waxStore.copy(signature)">
              <span class="inline-flex items-center">
                {{ `${signature.slice(0, 5)}...${signature.slice(-5)}\n` }}
                <svg-icon class="ml-2" type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
              </span>
              <hr v-if="wax.signatures.value.length > 1" class="my-3" />
            </span>
          </TableCell>
          <TableCell>{{ wax.pack.value }}</TableCell>
          <TableCell>
            <span
              v-for="(key, index) in wax.keys.value"
              :key="index"
              class="inline-flex transition-colors p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
              @click="waxStore.copy(key)">
              <span class="inline-flex items-center">
                {{ `${key.slice(0, 5)}...${key.slice(-5)}\n` }}
                <svg-icon class="ml-2" type="mdi" :path="mdiClipboardMultipleOutline" width="16" height="16" />
              </span>
              <hr v-if="wax.keys.value.length > 1" class="my-3" />
            </span>
          </TableCell>
          <TableCell
            v-if="typeof wax.accountsAuth.value !== 'undefined' && wax.accountsAuth.value.length !== 0"
            v-for="(account, index) in wax.accountsAuth.value"
            :key="index"
            class="max-w-[100px] text-ellipsis overflow-hidden">
            <p v-for="(el, index) in account" :key="index">{{ el }}</p>
            <hr v-if="wax.accountsAuth.value.length > 1" class="my-3" />
          </TableCell>
          <TableCell v-else>...</TableCell>
          <TableCell class="flex justify-between items-center">
            <a
              :href="`https://explore.openhive.network/@${wax.signedBy.value}`"
              target="_blank"
              class="inline-flex items-center transition-colors p-3 rounded-lg hover:bg-accent">
              {{ `@${wax.signedBy.value}` }} <svg-icon class="ml-2" type="mdi" :path="mdiOpenInNew" width="16" height="16" />
            </a>
            <svg-icon type="mdi" :path="wax.isDirectlySigned.value ? mdiCheck : mdiClose" width="16" height="16" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useWaxStore } from '@/store/wax';
import { mdiClipboardMultipleOutline, mdiCheck, mdiClose, mdiOpenInNew } from '@mdi/js';
// @ts-expect-error Missing declaration files
import SvgIcon from '@jamescoyle/vue-icon';
import { storeToRefs } from 'pinia';

const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);
</script>
