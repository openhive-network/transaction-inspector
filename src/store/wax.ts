import { toast } from '@/components/ui/toast';
import type { TWaxAccountInformations } from '@/plugins/wax';
import { ApiTransaction } from '@hive/wax';
import { defineStore } from 'pinia';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    keys: [] as string[],
    accounts: [] as string[][],
    signedBy: [] as string[],
    refs: [] as string[],
    signatures: [] as string[],
    correctlySigned: false,
    id: '',
    sigDigest: '',
    accountName: '',
  }),

  actions: {
    async getEntireWaxInformations(wax: TWaxAccountInformations, transaction: ApiTransaction, username: string): Promise<void> {
      this.keys = await wax.getNormalizeKeysFor(transaction);
      this.accounts = await wax.getAccountAuthsFor(username);
      this.signedBy = await wax.getKeyTypeFor(username, this.keys[0]);
      this.refs = await wax.getAccountsKeyReferencesFor(transaction);
      this.signatures = await wax.getSignaturesFor(transaction);
      this.correctlySigned = await wax.checkVerifyAuthorityFor(transaction);
      this.id = await wax.getTransactionIdFor(transaction);
      this.sigDigest = await wax.getSigDigestFor(transaction);
      this.accountName = username;
    },

    async copy(string: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(string);
        toast({
          title: 'Copied to clipboard!',
          description: string.length > 30 ? `${string.substring(0, 30)}...` : string,
        });
      } catch (error: any) {
        toast({
          title: 'Failed to copy',
          variant: 'destructive',
        });
      }
    },
  },
});
