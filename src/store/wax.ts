import { toast } from '@/components/ui/toast';
import type { TWaxAccountInformations } from '@/plugins/wax';
import { EAuthorityLevel } from '@/plugins/wax/types';
import { ApiTransaction } from '@hive/wax';
import { defineStore } from 'pinia';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    keys: [] as string[],
    accountsAuth: [] as string[][],
    authType: [] as string[],
    signedBy: '',
    signatures: [] as string[],
    correctlySigned: false,
    id: '',
    sigDigest: '',
    accountName: '',
    satisfied: '',
    isDirectlySigned: false,
  }),

  actions: {
    async getEntireWaxInformations(wax: TWaxAccountInformations, transaction: ApiTransaction, username: string): Promise<void> {
      this.keys = await wax.getNormalizeKeysFor(transaction);
      this.accountsAuth = await wax.getAccountAuthsFor(username);
      this.signedBy = await wax.getAccountsKeyReferencesFor(transaction);
      this.authType = await wax.getAuthorityTypeFor(this.signedBy, this.keys);
      this.signatures = await wax.getSignaturesFor(transaction);
      this.correctlySigned = await wax.checkVerifyAuthorityFor(transaction);
      this.id = await wax.getTransactionIdFor(transaction);
      this.sigDigest = await wax.getSigDigestFor(transaction);
      this.satisfied = await wax.compareSignatures(username, transaction);
      this.accountName = username;
      this.isDirectlySigned = await wax.isDirectlySigned(username, EAuthorityLevel.POSTING, transaction);
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
