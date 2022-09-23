import { AccountApi } from './AccountApi';
import { AxiosInstance } from 'axios';
import ApiBase from './ApiBase';
import { PersonApi } from './PersonApi';
import { SpouseApi } from './SpouseApi';
import { ContactInfoApi } from './ContactInfoApi';
import { DependentApi } from './DependentApi';
import { UserConfigApi } from './UserConfigApi';
import { TermsAndConditionsApi } from './TermsAndConditionsApi';

export default class Api extends ApiBase {

  constructor(axios: AxiosInstance) {
    super(axios);

    this.account = new AccountApi(this.axios);
    this.person = new PersonApi(this.axios);
    this.spouse = new SpouseApi(this.axios);
    this.contactInfo = new ContactInfoApi(this.axios);
    this.dependents = new DependentApi(this.axios);
    this.userConfig = new UserConfigApi(this.axios);
    this.termsAndConditions = new TermsAndConditionsApi(this.axios);
  }

  account: AccountApi;
  person: PersonApi;
  spouse: SpouseApi;
  contactInfo: ContactInfoApi;
  dependents: DependentApi;
  readonly userConfig: UserConfigApi;
  readonly termsAndConditions: TermsAndConditionsApi;
/*   account: AccountApi;
  person: PersonApi;
  spouse: SpouseApi;
  accountControl: AccountControlApi;
  readonly logging: LoggingApi;
  readonly userConfig: UserConfigApi; */
}
