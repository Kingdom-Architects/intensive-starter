import { Command, CommandInstruction, IInstruction, SystemStateCommand } from "../SystemStateTypes";
import { composeCommands } from '../utils';
import Storage from '../Storage';
import { API, AUTH } from "../../apis";
import { TwoFactorTypeEnum } from "../../apis/AuthApi";
import { PersonRest } from "../../apis/PersonApi";

interface RegisterProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  birthdate: string;
  product: string | undefined;
  gender: string | undefined;
  maritalStatus: boolean;
  includeSpouse: boolean;
  preferredName: string | undefined;
}

export interface PersonalFinanceProps {
  annualIncome: number;
  taxState: string;
  investmentPreference: string;
  taxFilingStatus: number;
  creditScore: number;
  eligibleForHsa: boolean;
  selfEmployed: boolean;
  otherAnnualIncome?: number;
}

export interface ContactInfoProps {
  address1: string;
  address2: string | undefined;
  city: string;
  state: string;
  zipCode: string;
  mobilePhone: string;
  phoneNumber: string;
}

export interface SpouseInfoProps {
  firstName: string;
  lastName: string;
  birthdate: string;
  preferredName: string;
  creditScore: number;
  annualIncome: number;
  otherIncome: number;
  gender: string;
}

export interface OnboardingProps {
  personalDetails: boolean;
  accounts: boolean;
  budgetDetails: boolean;
  adviceAcknowledged: boolean;
  termsAndConditions: boolean;
}

export interface DependentProps {
  id: number | undefined;
  birthDate: string;
  gender: string;
  name: string;
  participantId: number;
}

export interface CreateAccountProps extends RegisterProps {
  finances?: PersonalFinanceProps;
  contactInfo?: ContactInfoProps;
  spouse?: SpouseInfoProps;
  onboarding?: OnboardingProps;
  dependents?: DependentProps[];
}

const register: Command<RegisterProps> = async (instruction: CommandInstruction<RegisterProps>, storage: Storage, context: Record<string, any>) => {
  const { id } = instruction;
  const { config: payload } = instruction;
  const response = await AUTH.registerUser(payload);
  if (response.status !== 200) {
    console.error('register', response.status, response.data, payload);
    return;
  }

  const { data: verificationCode } = await AUTH.retrieveVerificationCode();
  const verifiedResponse = await AUTH.validateAccount({ code: verificationCode, twoFactorType: TwoFactorTypeEnum.Email });

  if (verifiedResponse.status !== 200) {
    return;
  }

  const authHeader = verifiedResponse.headers.authorization;
  const refreshAuthHeader = verifiedResponse.headers['authorization-refresh'];

  const token = authHeader.replace("Bearer ", "");
  const refreshToken = refreshAuthHeader.replace("Bearer ", "");

  storage.set("accessToken", id, { token, refreshToken });
};

const retrieveAndStoreAccount: SystemStateCommand = async (instruction: IInstruction, storage: Storage, context: Record<string, any>) => {
  const { id, config } = instruction;
  const { data: account } = await API.account.getAccount();

  storage.set("account", id, config, account);
};

const upgradeAccount: SystemStateCommand = async (instruction: IInstruction, storage: Storage, context: Record<string, any>) => {
  const { config } = instruction;
  if (config.product !== 'advice') {
    return;
  }

  await API.account.subscribe();
};

const setupPersonalDetails: Command<CreateAccountProps> = async (instruction: CommandInstruction<CreateAccountProps>, storage: Storage, context: Record<string, any>) => {
  const { id, config } = instruction;
  const { finances, contactInfo, spouse, onboarding, dependents } = config;
  const { token } = storage.get("accessToken", id);
  const [, account] = storage.get("account", id);

  let person: PersonRest;
  if (finances) {
    await API.account.patchAccount({
      ...account,
      ...finances,
    });

    person = (await API.person.patchPerson({
      id: account.participantId,
      otherIncome: finances.otherAnnualIncome ?? 0,
      filingStatus: finances.taxFilingStatus,
      gender: config.gender,
      maritalStatus: config.maritalStatus === true,
      includeSpouse: config.includeSpouse === true,
      preferredName: config.preferredName,
      creditScore: finances.creditScore,
      eligibleForHsa: finances.eligibleForHsa === true,
      selfEmployed: finances.selfEmployed === true,
    })).data;
  } else {
    person = (await API.person.getPerson()).data;
  }

  if (spouse) {
    const spouseData = (await API.spouse.postSpouse({
      ...spouse,
    })).data;

    storage.set('spouse', id, spouseData);
  }

  if (contactInfo && person) {
    await API.contactInfo.putContactInfo({
      id: person.contactInfoId,
      mailingAddress1: contactInfo.address1,
      mailingAddress2: contactInfo.address2,
      mailingCity: contactInfo.city,
      mailingCountry: "US",
      mailingState: contactInfo.state,
      mailingZip: contactInfo.zipCode,
      mobilePhone: contactInfo.mobilePhone,
      phone: contactInfo.phoneNumber,
    });
  }

  if (person && dependents) {
    for (let i = 0; i < dependents.length; i++) {
      const dependentConfig = dependents[i];
      const newDependent = (await API.dependents.postDependent({
        ...dependentConfig,
      })).data;
      storage.set("dependent", i + 1, newDependent);
    }
  }

  if (onboarding?.personalDetails) {
    await API.userConfig.setOnboardingComplete();
  }

  if (onboarding) {
    await API.userConfig.setOnboardingFlags({
      accountDetailsComplete: onboarding.accounts === true,
      budgetDetailsReviewed: onboarding.budgetDetails === true,
      adviceAcknowledged: onboarding.adviceAcknowledged === true,
    });
  }

  if (onboarding?.termsAndConditions) {
    await API.termsAndConditions.acceptTerms();
  }

  if (
    onboarding?.personalDetails &&
    onboarding?.accounts &&
    onboarding?.budgetDetails &&
    onboarding?.adviceAcknowledged &&
    onboarding.termsAndConditions
  ) {
    await API.userConfig.setAdviceOnboardingComplete();
  }

  storage.set("account", id, config, account, person);
  storage.set("person", id, person);
  storage.set("contactInfo", id, contactInfo);
};

const compositeCommand = composeCommands(
  register as SystemStateCommand,
  retrieveAndStoreAccount,
  upgradeAccount,
  setupPersonalDetails as SystemStateCommand,
);

export default compositeCommand as Command<CreateAccountProps>;
