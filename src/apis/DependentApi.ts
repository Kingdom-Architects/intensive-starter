import { AxiosInstance, AxiosResponse } from 'axios';

export class DependentApi {
  constructor(private axios: AxiosInstance) {}

  getAll(): Promise<AxiosResponse<DependentRest[]>> {
    return this.axios.get<DependentRest[]>('dependents');
  }

  postDependent(data: DependentRest): Promise<AxiosResponse<DependentRest>> {
    return this.axios.post<DependentRest>('dependents', data);
  }

  putDependent(data: DependentRest): Promise<AxiosResponse<DependentRest>> {
    return this.axios.patch<DependentRest>('dependents', data);
  }

  deleteDependent(id: number): Promise<AxiosResponse<void>> {
    return this.axios.delete<void>(`dependents/${id}`);
  }
}

export interface DependentRest {
  id?: number;
  name?: string;
  birthDate?: string;
  gender?: string;
}
