<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>Provide transaction</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Check your transaction</DialogTitle>
        <DialogDescription>Simply paste your username and transaction.</DialogDescription>
      </DialogHeader>
      <Suspense>
        <Form class="mt-4" />
      </Suspense>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Form from './Form.vue';
</script>
