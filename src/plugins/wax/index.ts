import { ApiAuthority, ApiKeyAuth, ApiTransaction, type IHiveChainInterface, createHiveChain } from '@hiveio/wax';
import { EAuthorityLevel, EPackType, type IAccountType, type TRequiredSignatures, type TVerifyAuthority } from './types.js';
import type { App } from 'vue';

class WaxAccountInformations {
  private chain!: IHiveChainInterface;

  private async requireChain(): Promise<void> {
    if (typeof this.chain === 'undefined')
      this.chain = await createHiveChain();
  }

  async getPackTypeFor(transaction: ApiTransaction): Promise<EPackType> {
    await this.requireChain();

    try {
      await this.chain.extend<TVerifyAuthority>().api.database_api.verify_authority({
        trx: transaction,
        pack: EPackType.HF26,
      });
      return EPackType.HF26;
    } catch (error) {
      return EPackType.LEGACY;
    }
  }

  async getTransactionIdFor(transaction: ApiTransaction): Promise<string> {
    await this.requireChain();

    return (await this.getPackTypeFor(transaction)) === EPackType.HF26
      ? this.chain.Transaction.fromApi(transaction).id
      : this.chain.Transaction.fromApi(transaction).legacy_id;
  }

  async getSigDigestFor(transaction: ApiTransaction): Promise<string> {
    await this.requireChain();

    return (await this.getPackTypeFor(transaction)) === EPackType.HF26
      ? this.chain.Transaction.fromApi(transaction).sigDigest
      : this.chain.Transaction.fromApi(transaction).legacy_sigDigest;
  }

  async getNormalizeKeysFor(transaction: ApiTransaction): Promise<string[]> {
    await this.requireChain();

    const pack = await this.getPackTypeFor(transaction);

    return (
      pack === EPackType.HF26
        ? this.chain.Transaction.fromApi(transaction).signatureKeys
        : this.chain.Transaction.fromApi(transaction).legacy_signatureKeys
    ).map(key => (key.startsWith('STM') ? `${key}` : `STM${key}`));
  }

  getSignaturesFor(transaction: ApiTransaction): string[] {
    return transaction.signatures;
  }

  async accountToCheck(transaction: ApiTransaction): Promise<IAccountType> {
    await this.requireChain();

    const account = await this.getAccountsKeyReferencesFor(transaction);

    for (let i = 0; i < account.length; ++i)
      return await this.chain.api.database_api.find_accounts({ accounts: [ account[i][0] ] });

    return { accounts: [] };
  }

  async checkVerifyAuthorityFor(transaction: ApiTransaction): Promise<boolean> {
    await this.requireChain();

    try {
      return (
        await this.chain.extend<TVerifyAuthority>().api.database_api.verify_authority({
          trx: transaction,
          pack: EPackType.HF26,
        })
      ).valid;
    } catch (error) {}
    try {
      return (
        await this.chain.extend<TVerifyAuthority>().api.database_api.verify_authority({
          trx: transaction,
          pack: EPackType.LEGACY,
        })
      ).valid;
    } catch (error) {
      return false;
    }
  }

  async isDirectlySigned(
    transaction: ApiTransaction,
    expectedAuthorityLevel: EAuthorityLevel
  ): Promise<boolean> {
    const signedBy = await this.getAccountsKeyReferencesFor(transaction);
    const { accounts } = await this.accountToCheck(transaction);

    if (accounts.length === 0)
      throw new Error('Provided account is not valid for given transaction or does not exist');

    if (accounts.length !== 1)
      throw new Error('Expected signer must be a single account');

    const [ account ] = accounts;

    let authorityToVerify: ApiAuthority;

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

    let direct = true;

    if (authorityToVerify.account_auths.length === 0)
      return direct;

    for (let i = 0; i < signedBy.length; ++i)
      return direct &&= authorityToVerify.account_auths.some((accAuth: ApiKeyAuth) => accAuth['0'] === signedBy[i][0]);

    return false;
  }

  async getAccountsKeyReferencesFor(transaction: ApiTransaction): Promise<string[][]> {
    await this.requireChain();

    const mappedKeys = await this.getNormalizeKeysFor(transaction);
    const accountsByRefs = (await this.chain.api.account_by_key_api.get_key_references({ keys: mappedKeys })).accounts;

    const accounts = [ ...accountsByRefs ];

    console.log(accounts);

    return accounts;
  }

  async getAuthorityTypeFor(transaction: ApiTransaction, transactionKeys: string[]): Promise<EAuthorityLevel> {
    await this.requireChain();

    const { accounts } = await this.accountToCheck(transaction);

    if (accounts.length > 0) {
      for (let i = 0; i < transactionKeys.length; ++i) {
        if (accounts[i].owner.key_auths[i][0] === transactionKeys[i])
          return EAuthorityLevel.OWNER;
        else if (accounts[i].active.key_auths[i][0] === transactionKeys[i])
          return EAuthorityLevel.ACTIVE;
        else if (accounts[i].posting.key_auths[i][0] === transactionKeys[i])
          return EAuthorityLevel.POSTING;
      }
    }

    return EAuthorityLevel.POSTING;
  }

  async getAuthorityWeightFor(transaction: ApiTransaction, transactionKeys: string[]): Promise<number | undefined> {
    await this.requireChain();

    const { accounts } = await this.accountToCheck(transaction);

    console.log(accounts);

    if (accounts.length === 0)
      throw new Error('Provided account is not valid for given transaction or does not exist');

    for (let i = 0; i < transactionKeys.length; ++i)
      if (accounts[i].owner.key_auths[i][0] === transactionKeys[i])
        return accounts[i].owner.key_auths[i][1];
      else if (accounts[i].active.key_auths[i][0] === transactionKeys[i])
        return accounts[i].active.key_auths[i][1];
      else if (accounts[i].posting.key_auths[i][0] === transactionKeys[i])
        return accounts[i].posting.key_auths[i][1];
  }

  async getWeightThresholdFor(transaction: ApiTransaction, transactionKeys: string[]): Promise<number | undefined> {
    await this.requireChain();

    const { accounts } = await this.accountToCheck(transaction);

    console.log(accounts);

    if (accounts.length === 0)
      throw new Error('Provided account is not valid for given transaction or does not exist');

    for (let i = 0; i < transactionKeys.length; ++i)
      if (accounts[i].owner.key_auths[i][0] === transactionKeys[i])
        return accounts[i].owner.weight_threshold;
      else if (accounts[i].active.key_auths[i][0] === transactionKeys[i])
        return accounts[i].active.weight_threshold;
      else if (accounts[i].posting.key_auths[i][0] === transactionKeys[i])
        return accounts[i].posting.weight_threshold;
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

  async compareSignatures(transaction: ApiTransaction): Promise<EAuthorityLevel> {
    const { accounts } = await this.accountToCheck(transaction);
    const requiredSignatures = await this.getRequiredSignatures(transaction);

    console.log(accounts);

    const length = accounts.length - requiredSignatures.length;

    for (let i = 0; i < length; ++i) {
      if (accounts[i].owner.key_auths.some((auth: ApiKeyAuth) => auth['0'] === requiredSignatures[i]))
        return EAuthorityLevel.OWNER;
      else if (accounts[i].active.key_auths.some((auth: ApiKeyAuth) => auth['0'] === requiredSignatures[i]))
        return EAuthorityLevel.ACTIVE;
      else if (accounts[i].posting.key_auths.some((auth: ApiKeyAuth) => auth['0'] === requiredSignatures[i]))
        return EAuthorityLevel.POSTING;
    }

    return EAuthorityLevel.POSTING;
  }

  async getAccountAuths(transaction: ApiTransaction): Promise<string[][] | undefined> {
    await this.requireChain();

    const { accounts } = await this.accountToCheck(transaction);

    console.log(accounts);

    for (let i = 0; i < accounts.length; ++i) {
      return [
        { type: EAuthorityLevel.OWNER, auths: accounts[i].owner.account_auths },
        { type: EAuthorityLevel.ACTIVE, auths: accounts[i].active.account_auths },
        { type: EAuthorityLevel.POSTING, auths: accounts[i].posting.account_auths },
      ]
        .filter(acc => acc.auths.length > 0)
        .map(acc => acc.auths.map(node => node[0]));
    }
  }
}

export type TWaxAccountInformations = WaxAccountInformations;

export default {
  install: (app: App) => {
    app.provide('wax', new WaxAccountInformations());
  },
};
