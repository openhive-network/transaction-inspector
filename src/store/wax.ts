import { toast } from '@/components/ui/toast';
import type { TWaxAccountInformations } from '@/plugins/wax';
import { EAuthorityLevel, EPackType } from '@/plugins/wax/types';
import { ApiTransaction } from '@hiveio/wax';
import { defineStore } from 'pinia';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    keys: [] as string[],
    accountsAuth: [] as string[][] | undefined,
    authType: EAuthorityLevel.POSTING,
    signedBy: '',
    signatures: [] as string[],
    correctlySigned: false,
    pack: EPackType.HF26,
    id: '',
    sigDigest: '',
    accountName: '',
    isDirectlySigned: false as boolean | undefined,
    expectedAuthType: '',
    isLoading: false,
    shouldDisplayInformation: false
  }),

  actions: {
    async getEntireWaxInformations(wax: TWaxAccountInformations, transaction: ApiTransaction, username: string): Promise<void> {
      try {
        this.isLoading = true;
        this.keys = await wax.getNormalizeKeysFor(transaction);
        this.accountsAuth = await wax.getAccountAuthsFor(username);
        this.signedBy = await wax.getAccountsKeyReferencesFor(transaction);
        this.authType = await wax.getAuthorityTypeFor(this.signedBy, this.keys);
        this.signatures = wax.getSignaturesFor(transaction);
        this.correctlySigned = await wax.checkVerifyAuthorityFor(transaction);
        this.isDirectlySigned = await wax.isDirectlySigned(transaction, username, this.authType);
        this.id = await wax.getTransactionIdFor(transaction);
        this.sigDigest = await wax.getSigDigestFor(transaction);
        this.accountName = username;
        this.pack = await wax.getPackTypeFor(transaction);
        this.expectedAuthType = await wax.compareSignatures(username, transaction);
      } finally {
        this.isLoading = false;
      }
    },

    async copy(string: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(string);
        toast({
          title: 'Copied to clipboard!',
          description: string.length > 30 ? `${string.slice(0, 30)}...` : string,
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
