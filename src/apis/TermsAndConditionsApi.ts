import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class TermsAndConditionsApi {
  constructor(private axios: AxiosInstance) {}

  acceptTerms(): Promise<AxiosResponse> {
    return this.axios.post(`/terms-and-conditions/accept-terms`);
  }

  getDocs(): Promise<AxiosResponse<TermsDoc[]>> {
    return this.axios.get<TermsDoc[]>(`/terms-and-conditions`);
  }

  getDoc(id: number): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/pdf',
      },
      responseType: 'arraybuffer',
    };
    return this.axios.get(`/terms-and-conditions/terms-doc-pdf/${id}`, config);
  }
}

export interface TermsDoc {
  id: number;
  docDescription: string;
}
