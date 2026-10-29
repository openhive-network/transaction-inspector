import type { ApiAccount, ApiTransaction, TWaxApiRequest } from '@hiveio/wax';

interface IVerifyAuthorityRequest {
  trx: ApiTransaction;
  pack: EPackType;
}

export interface IVerifyAuthorityResponse {
  valid: boolean;
}

interface IRequiredSignaturesRequest {
  trx: ApiTransaction;
  available_keys: string[];
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
  POSTING = 'Posting',
  ACTIVE = 'Active',
  OWNER = 'Owner',
}

export type TVerifyAuthority = {
  database_api: {
    verify_authority: TWaxApiRequest<IVerifyAuthorityRequest, IVerifyAuthorityResponse>;
  };
};

export type TRequiredSignatures = {
  database_api: {
    get_required_signatures: TWaxApiRequest<IRequiredSignaturesRequest, IRequiredSignaturesResponse>;
  };
};
