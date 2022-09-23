import { AxiosInstance, AxiosResponse } from 'axios';

export class SpouseApi {
  constructor(private axios: AxiosInstance) {}

  getSpouse(): Promise<AxiosResponse<SpouseRest>> {
    return this.axios.get<SpouseRest>('person/spouse');
  }

  postSpouse(data: SpouseRest): Promise<AxiosResponse<SpouseRest>> {
    return this.axios.post<SpouseRest>('person/spouse', data);
  }

  patchSpouse(data: SpouseRest): Promise<AxiosResponse<SpouseRest>> {
    return this.axios.patch<SpouseRest>('person/spouse', data);
  }
}

export interface SpouseRest {
  annualIncome?: number;
  birthDate?: string;
  expectedMortalityAge?: number;
  creditScore?: number;
  firstName?: string;
  gender?: string;
  id?: number;
  includeSsi?: boolean;
  lastName?: string;
  middleInitial?: string;
  preferredName?: string;
  otherIncome?: number;
  retirementAge?: number;
  retirementIncomeGoalPct?: number;
  strbirthdate?: string;
  totalIncome?: number;
  lifeExpectancy?: number;
  eligibleForHsa?: boolean;
  selfEmployed?: boolean;
}
