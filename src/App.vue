<template>
  <Card class="p-4" style="min-height: calc(100vh - 4rem)">
    <CardHeader class="flex flex-col md:flex-row justify-between items-center">
      <div class="flex items-center mb-4 md:mb-0">
        <img src="./assets/images/hive-logo.webp" alt="hive logo" width="70px" />
        <div class="ml-3">
          <CardTitle>Information about your transaction</CardTitle>
          <CardDescription class="mt-2">Check in easy and fast way all information about your transaction.</CardDescription>
        </div>
      </div>
      <div v-if="store.signatures.value.length > 0 && store.shouldDisplayInformation.value" class="hidden md:block">
        <Skeleton v-if="store.isLoading.value" class="h-[50px] w-[50px] rounded-xl" />
        <span v-else :class="`flex items-center text-lg ${store.correctlySigned.value ? 'text-green60' : 'text-destructive'}`">
          <svg-icon type="mdi" :path="store.correctlySigned.value ? mdiCheck : mdiClose" width="24" height="24" class="mr-2" />
          {{ store.correctlySigned.value ? 'valid' : 'invalid' }}
        </span>
      </div>
      <TrxDialog />
      <div v-if="store.signatures.value.length > 0" class="mt-6 lg:mt-0 md:hidden">
        <Skeleton v-if="store.isLoading.value" class="h-[50px] w-[50px] rounded-xl" />
        <span v-else :class="`flex items-center text-lg ${store.correctlySigned.value ? 'text-green60' : 'text-destructive'}`">
          <svg-icon type="mdi" :path="store.correctlySigned.value ? mdiCheck : mdiClose" width="24" height="24" class="mr-2" />
          {{ store.correctlySigned.value ? 'valid' : 'invalid' }}
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
// @ts-expect-error Missing declaration files
import SvgIcon from '@jamescoyle/vue-icon';
import { storeToRefs } from 'pinia';
import { useWaxStore } from './store/wax';
import { inject, watch } from 'vue';
import type { TWaxAccountInformations } from './plugins/wax';
import { useRoute } from 'vue-router';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);
const wax = inject<TWaxAccountInformations>('wax')!;

const route = useRoute();

watch(() => route.params.id, async () => {
  if ('id' in route.params)
    waxStore.$state.transactionIdFromUrl = route.params.id as string;
  else
    waxStore.$state.transactionIdFromUrl = '';

  if (store.transactionIdFromUrl.value !== '')
    await waxStore.getTransactionFromUrlId(wax);
});
</script>
