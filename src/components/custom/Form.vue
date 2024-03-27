<template>
  <div class="flex flex-col">
    <div>
      <Label>Username</Label>
      <Input type="text" placeholder="Provide your username" v-model="username" required />
      <p class="text-destructive">{{ usernameError }}</p>
    </div>
    <div class="my-4">
      <Label>Transaction (JSON format)</Label>
      <Textarea placeholder="Provide your transaction" class="min-h-64 max-h-64" v-model="transaction" required />
      <p class="text-destructive">{{ transactionError }}</p>
    </div>
    <DialogFooter>
      <Button v-if="typeof transaction === 'undefined' || typeof username === 'undefined'" @click="validateForm">Submit</Button>
      <DialogClose as-child v-else>
        <Button @click="validateForm">Submit</Button>
      </DialogClose>
    </DialogFooter>
  </div>
</template>

<script lang="ts" setup>
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useWaxStore } from '@/store/wax';
import type { ApiTransaction } from '@hive/wax';
import { inject, ref } from 'vue';
import type { TWaxAccountInformations } from '@/plugins/wax';
import { DialogClose, DialogFooter } from '../ui/dialog';

const store = useWaxStore();
const username = defineModel<string>('username');
const transaction = defineModel<string>('transaction');
const usernameError = ref('');
const transactionError = ref('');

const wax = inject<TWaxAccountInformations>('wax')!;

const getEntireWaxInformations = async () => {
  try {
    const parsedUsername = username.value?.startsWith('@') ? username.value.slice(1) : username.value;
    await store.getEntireWaxInformations(wax, JSON.parse(String(transaction.value?.trim())) as ApiTransaction, parsedUsername?.trim() as string);
  } catch (error) {}
};

const validateForm = (): void => {
  usernameError.value = '';
  transactionError.value = '';

  if (typeof username.value === 'undefined' || username.value.length === 0) usernameError.value = 'Please provide your username';
  else if (typeof transaction.value === 'undefined' || transaction.value.length === 0) transactionError.value = 'Please provide your transaction';
  else getEntireWaxInformations();
};
</script>
