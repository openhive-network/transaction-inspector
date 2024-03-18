import { ApiTransaction, type IHiveChainInterface, createHiveChain } from '@hive/wax';
import { EPackType, type IAccountType, type TVerifyAuthority } from './types.js';
import type { App } from 'vue';

class WaxAccountInformations {
  private chain!: IHiveChainInterface;

  private async requireChain(): Promise<void> {
    if (typeof this.chain === 'undefined') this.chain = await createHiveChain();
  }

  async getNormalizeKeysFor(transaction: ApiTransaction): Promise<string[]> {
    await this.requireChain();

    const signatureKeys = this.chain.TransactionBuilder.fromApi(transaction).signatureKeys;
    return signatureKeys.map(key => (key.startsWith('STM') ? `${key}` : `STM${key}`));
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

  async getAccountsKeyReferencesFor(transaction: ApiTransaction): Promise<string[]> {
    await this.requireChain();

    const mappedKeys = await this.getNormalizeKeysFor(transaction);
    const keyReferences = await this.chain.api.account_by_key_api.get_key_references({ keys: mappedKeys });

    return keyReferences.accounts[0];
  }

  async getKeyTypeFor(account: string, transactionKey: string): Promise<string[]> {
    await this.requireChain();

    const accountToCheck = await this.accountToCheck(account);

    return [
      { type: 'owner', key: accountToCheck.accounts[0].owner.key_auths[0][0] },
      { type: 'active', key: accountToCheck.accounts[0].active.key_auths[0][0] },
      { type: 'posting', key: accountToCheck.accounts[0].posting.key_auths[0][0] },
    ]
      .map(acc => (acc.key === transactionKey ? acc.type : ''))
      .filter(el => el.length > 0);
  }

  async getAccountAuthsFor(account: string): Promise<string[]> {
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
