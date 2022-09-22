import { AxiosResponse } from 'axios';
//import { AuthTwoFactorData } from '../account-settings/AccountSettingsTypes';
import ApiBase from './ApiBase';
import { AccessTokenProvider } from './AccessTokenProvider';
//import { AppleRequestResponse } from '@invertase/react-native-apple-authentication';
//import { User as GoogleLoginRequest } from '@react-native-google-signin/google-signin';

export default class AuthApi extends ApiBase {

  registerUser(request: RegisterUserRequest): Promise<AxiosResponse> {
    return this.axios.post('mobile/new-register', request);
  }

  validateAccount(request: TwoFactorRequest): Promise<AxiosResponse> {
    return this.axios.post(
      `mobile/new-register/verify?verificationCode=${request.code}`,
      {},
      {
        headers: {
          useTempToken: true,
        },
      },
    );
  }

  login(request: LoginRequest): Promise<AxiosResponse<LoginResultRest>> {
    return this.axios.post('mobile/login', request);
  }

  validateTwoFactor(request: TwoFactorRequest): Promise<AxiosResponse> {
    return this.axios.post('mobile/login/two-factor', request, {
      headers: {
        useTempToken: true,
      },
    });
  }

  getTwoFactorMethods(): Promise<AxiosResponse<AuthTwoFactorData[]>> {
    return this.axios.get('mobile/two-factor');
  }

  /* saveTwoFactorMethod(data: AuthTwoFactorData): Promise<AxiosResponse> {
    return this.axios.post(`mobile/two-factor?type=${data.twoFactorType?.toUpperCase()}`, { info: data.info });
  } */

  verifyTwoFactorMethod(
    code: string,
    type: TwoFactorTypeEnum,
    token: string,
  ): Promise<AxiosResponse<AuthTwoFactorResultRest>> {
    return this.axios.post(
      `mobile/two-factor/verify?type=${type.toUpperCase()}`,
      { code },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  setDefaultTwoFactorMethod(id: number, type: TwoFactorTypeEnum): Promise<AxiosResponse<AuthTwoFactorResultRest>> {
    return this.axios.post(`mobile/two-factor/default/${id}?type=${type.toUpperCase()}`);
  }

  deleteTwoFactorMethod(id: number, type: TwoFactorTypeEnum): Promise<AxiosResponse> {
    return this.axios.delete(`mobile/two-factor/${id}?type=${type.toUpperCase()}`);
  }
  resendTwoFactor(request: LoginTwoFactorData): Promise<AxiosResponse> {
    return this.axios.post('mobile/login/resend-two-factor', request, {
      headers: {
        useTempToken: true,
      },
    });
  }

  initiateChangePassword(data: ChangePasswordRest): Promise<AxiosResponse> {
    return this.axios.post('mobile/change-password/initiate', data);
  }

  changePassword(data: ChangePasswordRest, token: string): Promise<AxiosResponse> {
    return this.axios.post('mobile/change-password/change', data, { headers: { Authorization: `Bearer ${token}` } });
  }

  initiateResetPassword(data: ForgotPasswordRest): Promise<AxiosResponse> {
    return this.axios.post('mobile/reset-password/initiate', data);
  }

  resetPassword(data: ForgotPasswordResetRest, token: string): Promise<AxiosResponse> {
    return this.axios.post('mobile/reset-password/reset', data, { headers: { Authorization: `Bearer ${token}` } });
  }

  verifyResetPassword(code: string, token: string): Promise<AxiosResponse> {
    return this.axios.post(
      `mobile/reset-password/verify-2fa`,
      { code },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  refreshToken(token: string): Promise<AxiosResponse> {
    return this.axios.post('mobile/login/refresh-token', { token: token });
  }

  getAccessTokenAsync(): Promise<string | null> {
    return AccessTokenProvider.getTempAccessToken();
  }

  setAccessTokenAsync(token: string | null): Promise<void> {
    return AccessTokenProvider.setTempAccessToken(token);
  }
}

export interface AuthTwoFactorData {
  authenticationMethod?: TwoFactorTypeEnum;
  email?: string;
  mobilePhone?: string;
}
// eslint-disable-next-line no-shadow
export enum TwoFactorTypeEnum {
Email = 'email',
'Mobile Phone' = 'phone',
}

export interface RegisterUserRequest {
birthdate?: string;
emailAddress?: string;
firstName?: string;
lastName?: string;
password?: string;
}

export interface TwoFactorRequest {
code: string;
twoFactorType: TwoFactorTypeEnum;
}

export interface AuthTwoFactorResultRest {
defaultSelection?: boolean;
id?: number;
info?: string;
twoFactorType?: TwoFactorTypeEnum;
}

export interface LoginRequest {
username?: string;
password: string;
}

export interface LoginResultRest {
twoFactorEnabled?: boolean;
defaultTwoFactor?: LoginTwoFactorData;
twoFactorAlternatives?: Array<LoginTwoFactorData>;
}

export interface LoginTwoFactorData {
id?: number;
twoFactorType?: TwoFactorTypeEnum;
info?: string;
}

export interface ChangePasswordRest {
password?: string;
}

export interface ForgotPasswordRest {
username?: string;
birthDate?: Date;
}

export interface ForgotPasswordResetRest {
password?: string;
}