<template>
  <div class="flex flex-col">
    <div class="my-4">
      <Label>Transaction (JSON format)</Label>
      <Textarea placeholder="Provide your transaction" class="min-h-64 max-h-64" v-model="transaction" required />
      <p class="text-destructive">{{ transactionError }}</p>
    </div>
    <DialogFooter>
      <Button v-if="typeof transaction === 'undefined'" @click="validateForm">Submit</Button>
      <DialogClose as-child v-else>
        <Button @click="validateForm">Submit</Button>
      </DialogClose>
    </DialogFooter>
  </div>
</template>

<script lang="ts" setup>
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useWaxStore } from '@/store/wax';
import type { ApiTransaction } from '@hiveio/wax';
import { inject, ref } from 'vue';
import type { TWaxAccountInformations } from '@/plugins/wax';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { toast } from '../ui/toast/use-toast';

const store = useWaxStore();
const transaction = defineModel<string>('transaction');
const transactionError = ref('');

const wax = inject<TWaxAccountInformations>('wax')!;

const getEntireWaxInformations = async () => {
  store.$state.shouldDisplayInformation = false;

  try {
    store.$state.shouldDisplayInformation = true;
    await store.getEntireWaxInformations(wax, JSON.parse(String(transaction.value?.trim())) as ApiTransaction);
  } catch (error) {
    store.$state.shouldDisplayInformation = false;
    toast({
      title: `An error occured: ${error}`,
      variant: 'destructive',
    });
  }
};

const validateForm = (): void => {
  transactionError.value = '';

  if (typeof transaction.value === 'undefined' || transaction.value.length === 0)
    transactionError.value = 'Please provide your transaction';
  else getEntireWaxInformations();
};
</script>
