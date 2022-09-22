import { AxiosInstance, AxiosResponse } from 'axios';

export class UserConfigApi {
  constructor(private axios: AxiosInstance) {}

  getUserConfig(): Promise<AxiosResponse<UserConfig>> {
    return this.axios.get<UserConfig>('/user-config');
  }

  getUserConfigFeatureMap(): Promise<AxiosResponse<FeatureMap>> {
    return this.axios.get<FeatureMap>('/user-config/feature-map');
  }

  setOnboardingComplete(): Promise<AxiosResponse> {
    return this.axios.post('/user-config/onboard-complete');
  }

  setAdviceOnboardingComplete(): Promise<AxiosResponse> {
    return this.axios.post('/user-config/advice-onboard-complete');
  }

  unsetAdviceOnboardingComplete(): Promise<AxiosResponse> {
    return this.axios.post('/user-config/testing/unset-advice-onboard');
  }

  setBudgetDetailsComplete(userConfig: UserConfig): Promise<AxiosResponse> {
    const data: OnboardingFlagsRest = {
      accountDetailsComplete: userConfig.accountDetailsComplete,
      adviceAcknowledged: userConfig.adviceAcknowledged,
      budgetDetailsReviewed: true,
    };

    return this.axios.put('/onboarding-flags', data);
  }

  setAdviceAcknowledged(userConfig: UserConfig): Promise<AxiosResponse> {
    const data: OnboardingFlagsRest = {
      accountDetailsComplete: userConfig.accountDetailsComplete,
      adviceAcknowledged: true,
      budgetDetailsReviewed: userConfig.budgetDetailsReviewed,
    };

    return this.axios.put('/onboarding-flags', data);
  }
}

export interface FeatureMap {
  id?: number;
  productId?: number;
  recordKeeperId?: number;
  sponsorId?: number;
  outsideAdvice?: boolean;
  stockOptions?: boolean;
  companyStock?: boolean;
  breakdownDisplayLevel?: string;
  adviceOnly?: boolean;
  oneTime?: boolean;
  autoRiskLevelAdjustment?: boolean;
  managedAccount?: boolean;
  enableGoals?: boolean;
  enableAccounts?: boolean;
  enableSpouse?: boolean;
  enableDependents?: boolean;
  enableMobilePhone?: boolean;
  enableDaytimePhone?: boolean;
  enableAddress?: boolean;
  enableLoginHistory?: boolean;
  enablePreviousGuides?: boolean;
  enablePreferredName?: boolean;
  enableOtherIncome?: boolean;
  enableTaxStateChange?: boolean;
  enableSsi?: boolean;
  enableAdditionalSavings?: boolean;
  enableRiskLevelAdjustment?: boolean;
  enableTools?: boolean;
  enableHelp?: boolean;
  enableSavingsRateUpdate?: boolean;
  enablePersonalizedTargetDatePlus?: boolean;
  enableSpendDown?: boolean;
  allowAddGoals?: boolean;
  allowAddAccounts?: boolean;
  showSidebar?: boolean;
  discontinueOptionEnabled?: boolean;
  discontinueRedirect?: boolean;
  enableCatchupContributions?: boolean;
  enablePlaidLink?: boolean;
  editLoginInfo?: boolean;
  financialFitness?: boolean;
}

export interface OnboardingFlagsRest {
  accountDetailsComplete?: boolean;
  adviceAcknowledged?: boolean;
  budgetDetailsReviewed?: boolean;
}

export interface UserConfig {
  onBoarded?: boolean;
  adviceOnboarded: boolean;
  requireToAcceptTerms?: boolean;
  accountDetailsComplete?: boolean;
  adviceAcknowledged?: boolean;
  budgetDetailsReviewed?: boolean;
  productSelected?: boolean;
}

export const DefaultUserConfig: UserConfig = {
  onBoarded: false,
  adviceOnboarded: false,
  requireToAcceptTerms: false,
  accountDetailsComplete: false,
  adviceAcknowledged: false,
  budgetDetailsReviewed: false,
  productSelected: false,
};
