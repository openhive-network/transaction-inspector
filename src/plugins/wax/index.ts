import {
  ApiAccount,
  ApiAuthority,
  ApiKeyAuth,
  ApiTransaction,
  type IHiveChainInterface,
  type TAccountName,
  createHiveChain,
  transaction,
} from '@hive/wax';
import { EAuthorityLevel, EPackType, type IAccountType, type TRequiredSignatures, type TVerifyAuthority } from './types.js';
import type { App } from 'vue';

class WaxAccountInformations {
  private chain!: IHiveChainInterface;

  private async requireChain(): Promise<void> {
    if (typeof this.chain === 'undefined') this.chain = await createHiveChain();
  }

  async getTransactionIdFor(transaction: ApiTransaction): Promise<string> {
    await this.requireChain();
    return this.chain.TransactionBuilder.fromApi(transaction).id;
  }

  async getSigDigestFor(transaction: ApiTransaction): Promise<string> {
    await this.requireChain();
    return this.chain.TransactionBuilder.fromApi(transaction).sigDigest;
  }

  async getNormalizeKeysFor(transaction: ApiTransaction): Promise<string[]> {
    await this.requireChain();

    const signatureKeys = this.chain.TransactionBuilder.fromApi(transaction).signatureKeys;
    return signatureKeys.map(key => (key.startsWith('STM') ? `${key}` : `STM${key}`));
  }

  async getSignaturesFor(transaction: ApiTransaction): Promise<string[]> {
    return transaction.signatures;
  }

  async accountToCheck(account: string): Promise<IAccountType> {
    await this.requireChain();

    return await this.chain.api.database_api.find_accounts({ accounts: [account] });
  }

  async checkVerifyAuthorityFor(transaction: ApiTransaction): Promise<boolean> {
    await this.requireChain();

    return (
      await this.chain.extend<TVerifyAuthority>().api.database_api.verify_authority({
        trx: transaction,
        pack: EPackType.HF26,
      })
    ).valid;
  }

  async isDirectlySigned(expectedSigner: TAccountName, expectedAuthorityLevel: EAuthorityLevel, transaction: ApiTransaction): Promise<boolean> {
    const accounts = await this.accountToCheck(expectedSigner);
    const keys = await this.getNormalizeKeysFor(transaction);

    for (let i = 0; i < accounts.accounts.length; ++i) {
      let authorityToVerify: ApiAuthority;
      const account = accounts.accounts[i];

      switch (expectedAuthorityLevel) {
        case EAuthorityLevel.POSTING:
          authorityToVerify = account.posting;
          break;
        case EAuthorityLevel.ACTIVE:
          authorityToVerify = account.active;
          break;
        case EAuthorityLevel.OWNER:
          authorityToVerify = account.owner;
          break;
        default:
          throw new Error('Invalid authority level');
      }

      for (let i = 0; i < keys.length; ++i) return authorityToVerify.key_auths.some((auth: ApiKeyAuth) => auth['0'] === keys[i]);
    }

    return false;
  }

  async getAccountsKeyReferencesFor(transaction: ApiTransaction): Promise<string> {
    await this.requireChain();

    const mappedKeys = await this.getNormalizeKeysFor(transaction);
    const accountsByRefs = (await this.chain.api.account_by_key_api.get_key_references({ keys: mappedKeys })).accounts;

    const accounts = new Array<string[]>(...accountsByRefs);

    return accounts.join(',');
  }

  async getAuthorityTypeFor(account: string, transactionKeys: string[]): Promise<string[]> {
    await this.requireChain();

    const accountToCheck = await this.accountToCheck(account);

    for (let i = 0; i < transactionKeys.length; ++i) {
      const signedBy = [
        { type: 'owner', key: accountToCheck.accounts[0].owner.key_auths[0][0] },
        { type: 'active', key: accountToCheck.accounts[0].active.key_auths[0][0] },
        { type: 'posting', key: accountToCheck.accounts[0].posting.key_auths[0][0] },
      ]
        .map(acc => (acc.key === transactionKeys[i] ? acc.type : ''))
        .filter(el => el.length > 0);

      if (signedBy.length > 0) return signedBy;
    }
    return ['other'];
  }
  async getRequiredSignatures(transaction: ApiTransaction): Promise<string[]> {
    const transactionKeys = await this.getNormalizeKeysFor(transaction);
    return (
      await this.chain.extend<TRequiredSignatures>().api.database_api.get_required_signatures({
        trx: transaction,
        available_keys: transactionKeys,
      })
    ).keys;
  }

  async compareSignatures(account: string, transaction: ApiTransaction): Promise<any> {
    const accountToCheck = await this.accountToCheck(account);
    const requiredSignatures = await this.getRequiredSignatures(transaction);

    for (let i = 0; i < requiredSignatures.length; ++i) {
      if (requiredSignatures[i] === accountToCheck.accounts[0].owner.key_auths[0][0]) return 'owner';
      else if (requiredSignatures[i] === accountToCheck.accounts[0].active.key_auths[0][0]) return 'active';
      else if (requiredSignatures[i] === accountToCheck.accounts[0].posting.key_auths[0][0]) return 'posting';
      else return 'other';
    }
  }

  async getAccountAuthsFor(account: string): Promise<string[][]> {
    await this.requireChain();

    const accountToCheck = await this.accountToCheck(account);

    return [
      { type: 'owner', auths: accountToCheck.accounts[0].owner.account_auths },
      { type: 'active', auths: accountToCheck.accounts[0].active.account_auths },
      { type: 'posting', auths: accountToCheck.accounts[0].posting.account_auths },
    ]
      .filter(acc => acc.auths.length > 0)
      .map(acc => acc.auths.map(node => node[0]));
  }
}

export type TWaxAccountInformations = WaxAccountInformations;

export default {
  install: (app: App) => {
    app.provide('wax', new WaxAccountInformations());
  },
};
