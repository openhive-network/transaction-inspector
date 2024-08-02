import { toast } from '@/components/ui/toast';
import type { TWaxAccountInformations } from '@/plugins/wax';
import { EAuthorityLevel, EPackType } from '@/plugins/wax/types';
import { ApiTransaction } from '@hiveio/wax';
import { defineStore } from 'pinia';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    keys: [] as string[],
    accountsAuth: [] as string[][] | undefined,
    authWeight: 0 as number | undefined,
    weightThreshold: 0 as number | undefined,
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
    shouldDisplayInformation: false,
    entireRequiredThreshold: 0,
    enitreAuthsWeight: 0
  }),

  actions: {
    async getEntireWaxInformations(wax: TWaxAccountInformations, transaction: ApiTransaction, username: string): Promise<void> {
      try {
        this.isLoading = true;
        this.keys = await wax.getNormalizeKeysFor(transaction);
        this.accountsAuth = await wax.getAccountAuthsFor(username);
        this.authWeight = await wax.getAuthorityWeightFor(username, this.keys);
        this.weightThreshold = await wax.getWeightThresholdFor(username, this.keys);
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

        if (this.weightThreshold)
          this.entireRequiredThreshold += this.weightThreshold;

        if (this.authWeight)
          this.enitreAuthsWeight += this.authWeight;

        if (this.enitreAuthsWeight < this.entireRequiredThreshold)
          throw new Error('Not enough weight to sign this transaction!');
      } catch (error) {
        let message = 'Unknown error occurred!';

        const err = error instanceof Error ? error.message : message;

        if (err.includes('!required_active.size()'))
          message = 'Missing active authority!';

        if (err.includes('!required_posting.size()'))
          message = 'Missing posting authority!';

        if (err.includes('!required_owner.size()'))
          message = 'Missing owner authority!';

        toast({
          title: message,
          variant: 'destructive',
        });
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
