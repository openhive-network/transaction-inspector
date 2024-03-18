import type { TWaxAccountInformations } from '@/plugins/wax';
import { ApiTransaction } from '@hive/wax';
import { defineStore } from 'pinia';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    keys: [] as string[],
    accounts: [] as string[],
    signedBy: [] as string[],
    refs: [] as string[],
    correctlySigned: false as boolean,
  }),

  actions: {
    async getEntireWaxInformations(wax: TWaxAccountInformations, transaction: ApiTransaction, username: string): Promise<void> {
      this.keys = await wax.getNormalizeKeysFor(transaction);
      this.accounts = await wax.getAccountAuthsFor(username);
      this.signedBy = await wax.getKeyTypeFor(username, this.keys[0]);
      this.refs = await wax.getAccountsKeyReferencesFor(transaction);
      this.correctlySigned = await wax.checkVerifyAuthorityFor(transaction);
    },
  },
});
