<template>
  <Card class="p-4" style="min-height: calc(100vh - 4rem)">
    <CardHeader class="flex flex-col md:flex-row justify-between items-center">
      <div class="mb-4 md:mb-0">
        <CardTitle>Information about your transaction</CardTitle>
        <CardDescription class="mt-2">Check in easy and fast way all information about your transaction.</CardDescription>
      </div>
      <div v-if="wax.signatures.value.length > 0" class="hidden md:block">
        <Skeleton v-if="wax.isLoading.value" class="h-[50px] w-[50px] rounded-xl" />
        <span v-else :class="`flex items-center text-lg ${wax.correctlySigned.value ? 'text-green60' : 'text-destructive'}`">
          <svg-icon type="mdi" :path="wax.correctlySigned.value ? mdiCheck : mdiClose" width="24" height="24" class="mr-2" />
          {{ wax.correctlySigned.value ? 'valid' : 'invalid' }}
        </span>
      </div>
      <TrxDialog />
      <div v-if="wax.signatures.value.length > 0" class="mt-6 lg:mt-0 md:hidden">
        <Skeleton v-if="wax.isLoading.value" class="h-[50px] w-[50px] rounded-xl" />
        <span v-else :class="`flex items-center text-lg ${wax.correctlySigned.value ? 'text-green60' : 'text-destructive'}`">
          <svg-icon type="mdi" :path="wax.correctlySigned.value ? mdiCheck : mdiClose" width="24" height="24" class="mr-2" />
          {{ wax.correctlySigned.value ? 'valid' : 'invalid' }}
        </span>
      </div>
    </CardHeader>
    <Suspense>
      <CardContent>
        <SignatureTable class="mt-0 lg:mt-12" />
        <TrxInfo />
      </CardContent>
    </Suspense>
    <Toaster />
  </Card>
</template>

<script lang="ts" setup>
import TrxDialog from './components/custom/TrxDialog.vue';
import SignatureTable from './components/custom/SignatureTable.vue';
import TrxInfo from './components/custom/TrxInfo.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import Toaster from '@/components/ui/toast/Toaster.vue';
import { Skeleton } from './components/ui/skeleton';
import { mdiCheck, mdiClose } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';
import { storeToRefs } from 'pinia';
import { useWaxStore } from './store/wax';

const waxStore = useWaxStore();
const wax = storeToRefs(waxStore);
</script>
