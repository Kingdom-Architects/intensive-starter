import { AxiosInstance, AxiosResponse } from 'axios';

export class PersonApi {
  constructor(private axios: AxiosInstance) {}

  getPerson(): Promise<AxiosResponse<PersonRest>> {
    return this.axios.get<PersonRest>('person');
  }

  patchPerson(data: PersonRest): Promise<AxiosResponse<PersonRest>> {
    return this.axios.patch<PersonRest>('person', data);
  }
}

export interface PersonRest {
  annualIncome?: number;
  birthDate?: string;
  contactInfoId?: number;
  creditScore?: number;
  expectedMortalityAge?: number;
  filingStatus?: number;
  firstName?: string;
  gender?: string;
  id?: number;
  includeSpouse?: boolean;
  includeSsi?: boolean;
  lastName?: string;
  maritalStatus?: boolean;
  middleInitial?: string;
  otherIncome?: number;
  preferredName?: string;
  retirementAge?: number;
  retirementIncomeGoalPct?: number;
  salary?: number;
  socSecNum?: string;
  spouseId?: number;
  strbirthdate?: string;
  totalIncome?: number;
  eligibleForHsa?: boolean;
  selfEmployed?: boolean;
}
