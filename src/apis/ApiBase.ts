/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosInstance } from 'axios';
import * as AxiosLogger from 'axios-logger';
import { RequestLogConfig, ResponseLogConfig } from 'axios-logger/lib/common/types';
import axiosRetry from 'axios-retry';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { AccessTokenProvider } from './AccessTokenProvider';
import { Mutex } from 'await-semaphore';

const requestLoggerConfig: RequestLogConfig = {
  headers: true,
  data: true,
  url: true,
  method: true,
};

const responseLoggerConfig: ResponseLogConfig = {
  headers: false,
  data: false,
  status: true,
  statusText: true,
};

export interface RecordedError {
  status?: number;
  msg?: string;
  method?: string;
  url?: string;
  timestamp?: Date;
}

class RecordedErrorCollection {
  private maxErrors = 5;
  private errors: BehaviorSubject<RecordedError[]> = new BehaviorSubject<RecordedError[]>([]);

  get errors$(): Observable<RecordedError[]> {
    return this.errors.pipe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record(error: any): void {
    const errors = this.errors.value;
    if (errors.length > this.maxErrors) {
      errors.shift();
    }

    errors.push({
      status: error?.response?.status,
      msg: error?.message,
      method: error?.config?.method,
      url: error?.config?.url,
      timestamp: new Date(),
    });

    this.errors.next(errors);
  }
}

export const ErrorRegistry: RecordedErrorCollection = new RecordedErrorCollection();

export default class ApiBase {
  private readonly enableRequestLogging: boolean = true;
  private readonly enableResponseLogging: boolean = true;
  private readonly enableCurlLogging: boolean = false;

  constructor(
    protected axios: AxiosInstance,
    private requestLogConfig: RequestLogConfig = requestLoggerConfig,
    private responseLogConfig: ResponseLogConfig = responseLoggerConfig,
  ) {
    axiosRetry(axios, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition:
        axiosRetry.isRetryableError ||
        axiosRetry.isNetworkError ||
        ((error) => {
          return !error.response || error.response.status === 408; //Timeout status code
        }),
    });

    this.startRequestInterceptors();
    this.startResponseInterceptors();
  }

  /* async getApplicationLogAsync(): Promise<ApplicationLogRest[]> {
    try {
      const currentLogs = await AsyncStorage.getItem(LOGGING_APPLICATION_STORE_DATA_KEY);
      return currentLogs !== null ? JSON.parse(currentLogs) : [];
    } catch (error) {}
    return [];
  } */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /* async setApplicationLogAsync(responseError: any): Promise<void> {
    const dataRest: ApplicationLogRest = {
      level: ApplicationLogLevelEnum.ERROR,
      message: `${responseError?.message} in ${responseError?.config?.method} ${responseError?.config?.url}`,
      timestamp: new Date(),
    };
    const currentLogs = await this.getApplicationLogAsync();
    try {
      await AsyncStorage.setItem(LOGGING_APPLICATION_STORE_DATA_KEY, JSON.stringify([...currentLogs, dataRest]));
    } catch (error) {}

    ErrorRegistry.record(responseError);
  } */

  private startRequestInterceptors = (): void => {
    this.axios.interceptors.request.use(async (config) => {
      const token =
        typeof config.headers?.useTempToken !== 'undefined'
          ? await AccessTokenProvider.getTempAccessToken()
          : (await firstValueFrom(AccessTokenProvider.accessToken$))?.accessToken;

      if (token && config.headers && !config.headers.Authorization && config.url !== 'mobile/login/refresh-token') {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (this.enableRequestLogging) return AxiosLogger.requestLogger(config, this.requestLogConfig);
      return config;
    }, AxiosLogger.errorLogger);
  };

  private startResponseInterceptors = (): void => {
    this.axios.interceptors.response.use(
      (response) => {
        if (this.enableResponseLogging) return AxiosLogger.responseLogger(response, this.responseLogConfig);
        return response;
      },
      async (error) => {
        if (error.config && error.response && error.response.status !== 403) {console.log('error :>> ', error);/* await this.setApplicationLogAsync(error); */}
        return AxiosLogger.errorLogger(error);
      },
    );

    const mutex = new Mutex();

    this.axios.interceptors.response.use(undefined, async (error) => {
      if (
        error.config &&
        error.response &&
        error.response.status === 403 &&
        typeof error.config.headers.useTempToken === 'undefined'
      ) {
        const release = await mutex.acquire();
        try {
          const token = await firstValueFrom(AccessTokenProvider.accessToken$);
          if (token === null || token.accessToken === '') {
            release();
            return Promise.reject(error);
          }

          if (typeof error.config.headers.tokenIsValid !== 'undefined') {
            await AccessTokenProvider.setAccessToken(null);
            release();
            return Promise.reject(error);
          }

          const jwtDecoded = jwtDecode<{ exp: number }>(token.accessToken);
          if (jwtDecoded.exp > new Date().getTime() / 1000) {
            error.config.headers.Authorization = `Bearer ${token.accessToken}`;
            error.config.headers.tokenIsValid = true;
            error.config.headers.Accept = '*/*';
            release();
            return this.axios.request(error.config);
          }

          // const response = await AUTH.refreshToken(token.refreshToken);
          // if (response.status !== 200) {
          //   await AccessTokenProvider.setAccessToken(null);
          //   release();
          //   return Promise.reject(error);
          // }

          // const newToken = response.headers.authorization?.replace('Bearer', '');
          // AccessTokenProvider.setAccessToken({ ...token, accessToken: newToken });
          // error.config.headers.Authorization = `Bearer ${newToken}`;
          // release();
          return this.axios.request(error.config);
        } catch {
          AccessTokenProvider.setAccessToken(null);
          release();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    });
  };
}
