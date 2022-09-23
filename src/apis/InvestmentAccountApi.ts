import { AxiosInstance, AxiosResponse } from 'axios';

// eslint-disable-next-line no-shadow
export enum CoverageTypeEnum {
  Single = 'SINGLE',
  Family = 'FAMILY',
  'No Longer Eligible' = 'NO_LONGER_ELIGIBLE',
}

export class InvestmentAccountApi {
  constructor(private axios: AxiosInstance) {}

  getAll(): Promise<AxiosResponse<InvestmentAccountRest[]>> {
    return this.axios.get<InvestmentAccountRest[]>('investment-accounts');
  }

  post(data: InvestmentAccountRest): Promise<AxiosResponse<InvestmentAccountRest>> {
    return this.axios.post<InvestmentAccountRest>('investment-accounts', data);
  }

  patch(data: InvestmentAccountRest): Promise<AxiosResponse<InvestmentAccountRest>> {
    return this.axios.patch<InvestmentAccountRest>('investment-accounts', data);
  }

  delete(id: number): Promise<AxiosResponse> {
    return this.axios.delete(`investment-accounts/${id}`);
  }

  getAllInvestments(id: number): Promise<AxiosResponse<InvestmentRest[]>> {
    return this.axios.get<InvestmentAccountRest[]>(`investment-accounts/${id}/investments`);
  }

  postInvestment(investmentAccountId: number, data: InvestmentRest): Promise<AxiosResponse<InvestmentRest>> {
    return this.axios.post<InvestmentRest>(`investment-accounts/${investmentAccountId}/investments`, data);
  }

  putInvestment(investmentAccountId: number, data: InvestmentRest): Promise<AxiosResponse<InvestmentRest>> {
    return this.axios.put<InvestmentRest>(`investment-accounts/${investmentAccountId}/investments`, data);
  }

  deleteInvestment(accountId: number, investmentAccountId: number): Promise<AxiosResponse> {
    return this.axios.delete(`investment-accounts/${accountId}/investments/${investmentAccountId}`);
  }

  getAllHealthSavingsAccounts(): Promise<AxiosResponse<InvestmentAccountRest[]>> {
    return this.axios.get<InvestmentAccountRest[]>('health-savings-account');
  }

  postHealthSavingsAccount(data: InvestmentAccountRest): Promise<AxiosResponse<InvestmentAccountRest>> {
    return this.axios.post<InvestmentAccountRest>('health-savings-account', data);
  }

  patchHealthSavingsAccount(data: InvestmentAccountRest): Promise<AxiosResponse<InvestmentAccountRest>> {
    return this.axios.patch<InvestmentAccountRest>('health-savings-account', data);
  }
}

export interface InvestmentAccountRest {
  adviced?: boolean;
  balance?: number;
  companyMatchDlrMax?: number;
  companyMatchRate?: number;
  companyMatchRate1?: number;
  companyMatchRate2?: number;
  companyMatchRateMax?: number;
  contribMethod?: string;
  contributionEligibility?: boolean;
  employeeContrib?: boolean;
  employeeContribPctAboveSsbw?: number;
  employerContrib?: boolean;
  employerMatch?: boolean;
  employerSsbw?: number;
  expEmpContribPctEndValue?: number;
  expectedProfitSharePctInc?: number;
  featuresFlags?: number;
  id?: number;
  matchRate1EndingPct?: number;
  matchRate2EndingPct?: number;
  matchingStock?: string;
  matchingStockPct?: number;
  name?: string;
  participantId?: number;
  planCatchUpDlrAmount?: number;
  planContribDlrLimitNoCap?: number;
  planContribLimitDlr?: number;
  planContribLimitDlrAt?: number;
  planContribLimitPct?: number;
  planContribLimitPctAt?: number;
  planContribPctMinPretax?: number;
  planId?: number;
  planSponsorName?: string;
  planType?: number;
  plancontribPctlimitBtcatchup?: number;
  postTaxSavingsAmt?: number;
  posttaxContribAllowed?: boolean;
  posttaxSavingsRate?: number;
  preTaxSavingsAmt?: number;
  pretaxSavingsRate?: number;
  profitSharing?: boolean;
  profitSharingRate?: number;
  rkPlanId?: string;
  rothContribAllowed?: boolean;
  rothSavingsAmt?: number;
  rothSavingsRate?: number;
  trustFamily?: number;
  type?: string;
  yearNeeded?: number;
  coverageType?: CoverageTypeEnum;
}

export interface InvestmentRest {
  id?: number;
  personId?: number;
  dateOfUserInfo?: string;
  dateUnrestricted?: string;
  msCategory?: number;
  pctnotallowedtotrade?: number;
  purchaseDate?: string;
  quantity?: number;
  redemptionFee?: number;
  restrictedForParticipant?: boolean;
  securities?: SecurityRest;
  securityId?: number;
  securityType?: number;
  taxType?: number;
  totalCostBasis?: number;
  totalValue?: number;
  userSuppliedPrice?: number;
  valuationMethod?: number;
}

export interface SecurityRest {
  changeAmt?: number;
  changePercent?: number;
  cusip?: string;
  datafeed?: boolean;
  expenseRatio?: number;
  id?: number;
  msCategory?: number;
  msrating?: number;
  price?: number;
  priceDate?: Date;
  publiclyTraded?: boolean;
  securityName?: string;
  securityType?: number;
  strExposureIds?: string;
  ticker?: string;
}
