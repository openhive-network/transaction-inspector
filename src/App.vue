<template>
  <Card class="p-4 h-full">
    <CardHeader class="flex flex-row justify-between">
      <div>
        <CardTitle>Informations about your transaction</CardTitle>
        <CardDescription class="mt-2">Check in easy and fast way all informations about your transaction.</CardDescription>
      </div>
      <TrxDialog />
    </CardHeader>
    <Suspense>
      <CardContent>
        <SignatureTable class="mt-12" />
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
</script>
