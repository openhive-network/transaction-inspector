import { ApiAccount, ApiTransaction, type TWaxApiRequest } from '@hive/wax';

interface IVerifyAuthorityRequest {
  trx: ApiTransaction;
  pack: EPackType;
}

export interface IVerifyAuthorityResponse {
  valid: boolean;
}

export interface IRequiredSignaturesResponse {
  keys: string[];
}

export interface IAccountType {
  accounts: ApiAccount[];
}

export interface IWaxEntireinformations {
  keys: string[];
  accounts: string[];
  signedBy: string[];
  refs: string[];
  correctlySigned: boolean;
}

export enum EPackType {
  LEGACY = 'legacy',
  HF26 = 'hf26',
}

export enum EAuthorityLevel {
  POSTING,
  ACTIVE,
  OWNER,
}

export type TVerifyAuthority = {
  database_api: {
    verify_authority: TWaxApiRequest<IVerifyAuthorityRequest, IVerifyAuthorityResponse>;
  };
};
