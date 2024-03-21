<template>
  <div class="flex flex-col">
    <div>
      <Label>Username</Label>
      <Input type="text" placeholder="Provide your username" v-model="username" />
    </div>
    <div class="my-4">
      <Label>Transaction (JSON format)</Label>
      <Textarea placeholder="Provide your transaction" class="min-h-64 max-h-64" v-model="transaction" />
    </div>
    <DialogFooter>
      <DialogClose as-child>
        <Button @click="getEntireWaxInformations">Submit</Button>
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
import { inject } from 'vue';
import type { TWaxAccountInformations } from '@/plugins/wax';
import { DialogClose, DialogFooter } from '../ui/dialog';

const store = useWaxStore();
const username = defineModel<string>('username');
const transaction = defineModel<string>('transaction');

const wax = inject<TWaxAccountInformations>('wax')!;

const getEntireWaxInformations = async () => {
  try {
    const parsedUsername = username.value?.startsWith('@') ? username.value.slice(1) : username.value;
    await store.getEntireWaxInformations(wax, JSON.parse(String(transaction.value)) as ApiTransaction, parsedUsername as string);
  } catch (error) {
    console.error(error);
  }
};
</script>
