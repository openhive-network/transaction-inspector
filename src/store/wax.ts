import type { TWaxAccountInformations } from '@/plugins/wax';
import { ApiTransaction } from '@hive/wax';
import { defineStore } from 'pinia';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    keys: undefined as string[] | undefined,
    accounts: undefined as string[] | undefined,
    signedBy: undefined as string[] | undefined,
    refs: undefined as string[] | undefined,
    correctlySigned: undefined as boolean | undefined,
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
