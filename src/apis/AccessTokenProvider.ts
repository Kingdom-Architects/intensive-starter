import { BehaviorSubject, Observable } from 'rxjs';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const ACCESS_TOKEN_PRE_TWO_FACTOR = 'ACCESS_TOKEN_PRE_TWO_FACTOR';

class AccessToken {
  constructor(public accessToken: string, public refreshToken: string) {}
}

class AccessTokenProvider {
  private readonly accessToken = new BehaviorSubject<AccessToken | null>(null);
  private initialized = new BehaviorSubject<boolean>(false);

  constructor() {
    const init = async () => {
      const token = await this.getAccessTokenAsync();
      this.setAccessToken(token);
      this.initialized.next(true);
    };
    init();
  }

  get initialized$(): Observable<boolean> {
    return this.initialized;
  }

  get accessToken$(): Observable<AccessToken | null> {
    return this.accessToken;
  }

  async setAccessToken(token: AccessToken | null): Promise<void> {
    try {
      if (token === null) {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        this.accessToken.next(null);
        return;
      }
      const tokenValid = await this.returnTokenIfDecodable(token);
      if (tokenValid === null) {
        console.log('invalid token');
        this.accessToken.next(null);
        return;
      }

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, JSON.stringify(tokenValid), {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });

      this.accessToken.next(tokenValid);
    } catch (e) {
      console.log(e);
      this.accessToken.next(null);
    }
  }

  async setTempAccessToken(tempToken: string | null): Promise<void> {
    if (tempToken === null) {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_PRE_TWO_FACTOR);
    } else {
      await SecureStore.setItemAsync(ACCESS_TOKEN_PRE_TWO_FACTOR, tempToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    }
  }

  async getTempAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_PRE_TWO_FACTOR);
  }

  private async getAccessTokenAsync(): Promise<AccessToken | null> {
    try {
      const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (storedToken !== null && storedToken !== '') {
        const parsedToken = JSON.parse(storedToken) as AccessToken;
        return this.returnTokenIfDecodable(parsedToken);
      }
      return null;
    } catch {
      return null;
    }
  }

  private async returnTokenIfDecodable(token: AccessToken): Promise<AccessToken | null> {
    try {
      jwtDecode<{ exp: number }>(token.accessToken);
      jwtDecode<{ exp: number }>(token.refreshToken);
      return token;
    } catch (error) {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      return null;
    }
  }
}

const tokenProvider = new AccessTokenProvider();

export { AccessToken, tokenProvider as AccessTokenProvider };
