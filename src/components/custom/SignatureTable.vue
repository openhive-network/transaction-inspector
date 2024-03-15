<template>
  <Table>
    <TableCaption>Key informations.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="text-lg">Signature</TableHead>
        <TableHead class="text-lg">HF26</TableHead>
        <TableHead class="text-lg">Public key</TableHead>
        <TableHead class="text-lg">Accounts</TableHead>
        <TableHead class="text-lg">Signed by</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(trx, index) in transactions" :key="index">
        <TableCell
          v-for="(signature, index) in trx.signatures"
          :key="index"
          class="max-w-[100px] text-ellipsis overflow-hidden hover:overflow-visible">
          {{ signature }}
        </TableCell>
        <TableCell class="max-w-[100px] text-ellipsis overflow-hidden hover:overflow-visible">
          <svg-icon type="mdi" :path="trx.HF26 ? mdiCheck : mdiClose" />
        </TableCell>
        <TableCell v-for="(key, index) in trx.keys" :key="index" class="max-w-[100px] text-ellipsis overflow-hidden hover:overflow-visible">
          {{ key }}
        </TableCell>
        <TableCell v-for="(account, index) in trx.accounts" :key="index" class="max-w-[100px] text-ellipsis overflow-hidden hover:overflow-visible">
          {{ `${account}\n` }}
          <hr v-if="trx.accounts.length > 1" class="my-3" />
        </TableCell>
        <TableCell v-for="(signer, index) in trx.signedBy" :key="index" class="max-w-[100px] text-ellipsis overflow-hidden hover:overflow-visible">
          {{ `${signer}\n` }}
          <hr v-if="trx.signedBy.length > 1" class="my-3" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { TWaxAccountInformations } from '@/plugins/wax';
import { useWaxStore } from '@/store/wax';
import { inject } from 'vue';
import { mdiCheck, mdiClose } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';

const wax = inject<TWaxAccountInformations>('wax')!;
const store = useWaxStore();
const trx = {
  expiration: '2024-02-21T06:55:40',
  extensions: [],
  operations: [
    {
      type: 'account_update2_operation',
      value: {
        account: 'thatcryptodave',
        extensions: [],
        json_metadata: '',
        posting_json_metadata:
          '{"name":"David P.","about":"","website":"","location":"Ontario, Canada","birthday":"03.28.1984","profile":{"name":"David P.","about":"","website":"","location":"Ontario, Canada","birthday":"03.28.1984","profile_image":"","cover_image":""}}',
      },
    },
  ],
  signatures: ['1f6ad21ddf9f57f1a94c1462185744cb0ea779ec1e99899f2556a3ce02b18d1b810fcddaccb349a53037798aea8023909447df756db461235ba5b63984d515c977'],
  ref_block_num: 26295,
  ref_block_prefix: 26859167,
};

const keys = await wax.getNormalizeKeysFor(trx);
const accounts = await wax.getAccountsKeyReferencesFor(trx);
const signedBy = await wax.getKeyTypeFor('thatcryptodave', keys[0]);
const refs = await wax.getAccountsKeyReferencesFor(trx);

const transactions = [
  {
    signatures: trx.signatures,
    HF26: false,
    keys: keys,
    accounts: accounts,
    signedBy: signedBy,
    refs: refs,
  },
];
</script>
