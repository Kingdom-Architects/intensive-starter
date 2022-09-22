import { AxiosInstance } from 'axios';
import ApiBase from './ApiBase';
//import { AccountApi } from './AccountApi';
//import { AccountControlApi } from './AccountControlApi';

//import { LoggingApi } from './LoggingApi';
//import { UserConfigApi } from './UserConfigApi';

export default class Api extends ApiBase {
  constructor(axios: AxiosInstance) {
    super(axios);

    /* this.account = new AccountApi(this.axios);
    this.person = new PersonApi(this.axios);
    this.spouse = new SpouseApi(this.axios);
    this.logging = new LoggingApi(this.axios);
    this.userConfig = new UserConfigApi(this.axios); */
  }

/*   account: AccountApi;
  person: PersonApi;
  spouse: SpouseApi;
  accountControl: AccountControlApi;
  readonly logging: LoggingApi;
  readonly userConfig: UserConfigApi; */
}
