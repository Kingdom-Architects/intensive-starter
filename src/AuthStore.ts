import jwtDecode from 'jwt-decode';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { delay, distinctUntilChanged, map } from 'rxjs/operators';
import { AccessToken, AccessTokenProvider } from './apis/AccessTokenProvider';
import { LoginResultRest, RegisterUserRequest, TwoFactorTypeEnum } from './apis/AuthApi';
import { AUTH } from './apis/instances';
//import { APPLICATION_EVENTS_STORE_DATA_KEY } from '../client-metrics/ClientMetricsStore';
//import { ForgotPasswordData } from '../forgot-password/ForgotPasswordTypes';
//import { LOGGING_APPLICATION_STORE_DATA_KEY } from '../server-side-logging/ServerSideLoggingTypes';
//import { AsyncStorageService } from '../services/AsyncStorageService';
//import { BiometricService } from '../services/BiometricService';
import { firstValueFrom } from 'rxjs';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import { PlaidStateService } from '../services/PlaidStateService';
/* mport { NonAdvicedPlaidStore } from '../advice/account-details/PlaidStore';
import { NonAdvicedRealEstateStore } from '../advice/account-details/real-estate/AdviceRealEstateStore';
import { ApplicationLogLevelEnum } from '../apis/LoggingApi'; */

export interface IAuthStore {
  isAuthenticated$: Observable<boolean>;
}

export class AuthStore implements IAuthStore {
  private signUpInProgress = new BehaviorSubject<boolean>(false);
  private initialized = new BehaviorSubject<boolean>(false);

  get isAuthenticated$(): Observable<boolean> {
    return combineLatest([this.hasJwtValid$]).pipe(
      //this.throwIfInitError(),
      map(([isAuth]) => {
        if (!isAuth) {
          console.log('oh no :(')
        }
        return isAuth;
      }),
      distinctUntilChanged(),
    );
  }

  get hasJwtValid$(): Observable<boolean> {
    return AccessTokenProvider.accessToken$.pipe(
      //this.throwIfInitError(),
      map((x) => {
        if (typeof x !== 'undefined' && x !== null) {
          return {
            jwtToken: jwtDecode<{ exp: number }>(x?.accessToken),
            refreshToken: jwtDecode<{ exp: number }>(x?.refreshToken),
          };
        }
        return null;
      }),
      map((x) => {
        if (x === null) return false;
        const current = new Date().getTime() / 1000;
        return x.jwtToken.exp > current || x.refreshToken.exp > current;
      }),
      distinctUntilChanged(),
    );
  }

  get initialized$(): Observable<boolean> {
    return this.initialized.pipe(delay(1));
  }

  get ready$(): Observable<boolean> {
    return combineLatest([this.isAuthenticated$, this.signUpInProgress.pipe(delay(1))]).pipe(
      //this.throwIfInitError(),
      map(([isAuth, signUpInProgress]) => {
        return isAuth && !signUpInProgress;
      }),
    );
  }


  /* private throwIfInitError<T>() {
    return throwIfInitError<T>(this.initialized$);
  } */

  private async ensureInitialized(): Promise<void> {
    const isInitialized = await firstValueFrom(this.initialized$);
    if (!isInitialized) {
      throw new Error('Store not initialized');
    }
  }

  setSignUpInProgress(val: boolean): void {
    this.signUpInProgress.next(val);
  }

  async attemptSignUp(registerData: RegisterUserRequest): Promise<boolean> {
    await this.ensureInitialized();
    await this.clearAccessTokens();
    const response = await AUTH.registerUser(registerData);
    const token = response.headers.authorization;

    if (!token) {
      throw new Error('No access token returned.');
    }

    // token comes back with Bearer included. Stripping it out so it's standard.
    await this.setAuthAccessToken(token.replace('Bearer ', ''));
    return true;
  }

  async attemptLogin(username: string, password: string): Promise<LoginResultRest> {
    // await this.ensureInitialized();
    await this.clearAccessTokens();
    const result = await AUTH.login({ username, password });
    // token comes back with Bearer included. Stripping it out so it's standard.
    const token = result.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No access token returned.');
    }

    if (result.data.twoFactorEnabled) {
      await this.setAuthAccessToken(token);
    } else {
      const refreshToken = result.headers['authorization-refresh']?.replace('Bearer', '');

      if (!refreshToken) {
        throw new Error('No refresh token returned.');
      }

      //this.biometricService.validateBiometricByLoginWithCredentials();
      await AccessTokenProvider.setAccessToken(new AccessToken(token, refreshToken));
    }
    return result.data;
  }

  async attemptSignUpTwoFactor(code: string): Promise<boolean> {
    await this.ensureInitialized();
    const response = await AUTH.validateAccount({ code: code, twoFactorType: TwoFactorTypeEnum.Email });
    const token = response.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No access token returned.');
    }
    await this.setAuthAccessToken(token);
    const refreshToken = response.headers['authorization-refresh']?.replace('Bearer', '');

    if (!refreshToken) {
      throw new Error('No refresh token returned');
    }

    //this.biometricService.validateBiometricByLoginWithCredentials();
    await AccessTokenProvider.setAccessToken(new AccessToken(token, refreshToken));
    this.setSignUpInProgress(false);
    return true;
  }

  async impersonate(token: string): Promise<void> {
    await AccessTokenProvider.setAccessToken(new AccessToken(token, token));
  }

  async impersonateFromDeepLink(token: string): Promise<void> {
    await AccessTokenProvider.setAccessToken(new AccessToken(token, token));
  }

  async attemptLoginTwoFactor(code: string): Promise<void> {
    await this.ensureInitialized();
    const result = await AUTH.validateTwoFactor({ code: code, twoFactorType: TwoFactorTypeEnum.Email });
    const token = result.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No access token returned.');
    }

    await this.setAuthAccessToken(token);
    const refreshToken = result.headers['authorization-refresh']?.replace('Bearer', '');

    if (!refreshToken) {
      throw new Error('No refresh token returned');
    }

    //this.biometricService.validateBiometricByLoginWithCredentials();
    await AccessTokenProvider.setAccessToken(new AccessToken(token, refreshToken));
  }

  /* async initiateResetPassword(data: ForgotPasswordData): Promise<string> {
    await this.ensureInitialized();
    const result = await AUTH.initiateResetPassword({ username: data.username, birthDate: data.birthDate });
    const token = result.headers.authorization?.replace('Bearer ', '');
    return token;
  } */

  async verifyResetPassword(code: string, token: string): Promise<string> {
    await this.ensureInitialized();
    const result = await AUTH.verifyResetPassword(code, token);
    const tokenResult = result.headers.authorization?.replace('Bearer ', '');
    return tokenResult;
  }

  /* async resetPassword(data: ForgotPasswordData, token: string): Promise<void> {
    await this.ensureInitialized();
    await AUTH.resetPassword({ password: data.password }, token);
  } */

  async logout(): Promise<void> {
    /* if (await GoogleSignin.isSignedIn()) {
      GoogleSignin.signOut();
    }
    this.plaidService.resetDependencies(new NonAdvicedPlaidStore(), new NonAdvicedRealEstateStore()); */
    await this.clearAccessTokens();
    /* await this.asyncStorage.deleteItem(APPLICATION_EVENTS_STORE_DATA_KEY);
    await this.asyncStorage.deleteItem(LOGGING_APPLICATION_STORE_DATA_KEY); */
  }

  private async setAuthAccessToken(token: string | null): Promise<void> {
    await AUTH.setAccessTokenAsync(token);
  }

  private async clearAccessTokens(): Promise<void> {
    await this.setAuthAccessToken(null);
    await AccessTokenProvider.setAccessToken(null);
  }
}
