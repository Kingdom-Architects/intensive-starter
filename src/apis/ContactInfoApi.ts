import { AxiosInstance, AxiosResponse } from 'axios';

export class ContactInfoApi {
  constructor(private axios: AxiosInstance) {}

  getContactInfo(): Promise<AxiosResponse<ContactInfoRest>> {
    return this.axios.get<ContactInfoRest>('/contact-info');
  }

  postContactInfo(data: ContactInfoRest): Promise<AxiosResponse<ContactInfoRest>> {
    return this.axios.post<ContactInfoRest>('contact-info', data);
  }

  putContactInfo(data: ContactInfoRest): Promise<AxiosResponse<ContactInfoRest>> {
    return this.axios.put<ContactInfoRest>('/contact-info', data);
  }
}

export class ContactInfoRest {
  email?: string;
  emailLastChanged?: string;
  fax?: string;
  id?: number;
  mailingAddress1?: string;
  mailingAddress2?: string;
  mailingCity?: string;
  mailingCountry?: string;
  mailingState?: string;
  mailingZip?: string;
  mobileLastChanged?: string;
  mobilePhone?: string;
  phone?: string;
  phoneExtension?: string;
}
