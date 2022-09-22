import { AxiosInstance, AxiosResponse } from 'axios';
//import { InvestmentPreferencesEnum } from '../constants/investment-preferences';
//import { ProductTypeEnum } from '../constants/product-types';
//import { UsStatesEnum } from '../constants/us-states';

export class AccountApi {
  constructor(private axios: AxiosInstance) {}

  getAccount(): Promise<AxiosResponse<AccountRest>> {
    return this.axios.get<AccountRest>('account');
  }

  deleteAccount(): Promise<AxiosResponse<AccountRest>> {
    return this.axios.delete<AccountRest>('account');
  }

  patchAccount(data: AccountRest): Promise<AxiosResponse<AccountRest>> {
    return this.axios.patch<AccountRest>('account', data);
  }

  subscribe(): Promise<AxiosResponse> {
    return this.axios.post('account/test/subscribe', {});
  }

  unsubscribe(): Promise<AxiosResponse> {
    return this.axios.post('account/test/unsubscribe');
  }
}

export interface AccountRest {
  acceptedCase?: number;
  annualSalary?: number;
  autoRiskLevelAdjustmentStatus?: boolean;
  baseCase?: number;
  employeeStatus?: number;
  endAdviceDate?: string;
  gcAdviceAccepted?: string;
  id?: number;
  initialAdvice?: number;
  managedAccount?: boolean;
  modifiedAdvice?: number;
  participantId?: number;
  planId?: number;
  pptClass?: string;
  //productId?: ProductTypeEnum;
  startAdviceDate?: string;
  //taxState?: UsStatesEnum;
  //investmentPreference?: InvestmentPreferencesEnum;
}
