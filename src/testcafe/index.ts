import { ClientFunction, Selector } from "testcafe";
import createAccount from "../system-state/commands/createAccount";
import runScenario from "../system-state/runScenario";

const storedValues: Record<string, any> = {};
const stubbedWindow = {
  localStorage: {
    getItem: (key: string) => {
      return storedValues[key];
    },
    setItem: (key: string, value: any) => {
      storedValues[key] = value;
    },
    removeItem: (key: string) => {
      delete storedValues[key];
    },
  },
};

// @ts-ignore
globalThis.window = stubbedWindow;

const impersonate = ClientFunction((token: string) =>
  // @ts-ignore
  window.impersonate(token)
);

const getToken = ClientFunction(() =>
  window.localStorage.getItem("ACCESS_TOKEN")
);

// fixture`Getting Started`.page`http://localhost:3000`.beforeEach(
//   async () => await setToken()
// );

fixture`Getting Started`.page`http://127.0.0.1:3000`;

test("Impersonate", async () => {
  const storage = await runScenario(async (state) => {
    await state.execute(createAccount, 1, {
      firstName: "Test",
      lastName: "User",
      emailAddress: '=RANDOM_EMAIL("test.guidedchoice.com")',
      password: "P@ssw0rd!!",
      birthdate: "1997-04-04T00:00:00Z",
      product: "advice",
      gender: "M",
      maritalStatus: true,
      includeSpouse: true,
      preferredName: "McTester",
      finances: {
        annualIncome: 100000,
        taxState: "TX",
        investmentPreference: "LOW_COST",
        taxFilingStatus: 2,
        creditScore: 800,
        eligibleForHsa: false,
        selfEmployed: false,
      },
      contactInfo: {
        address1: "1234 Test Lane",
        address2: undefined,
        city: "Austin",
        state: "TX",
        zipCode: "77801",
        mobilePhone: "555-234-2344",
        phoneNumber: "555-234-2344",
      },
      spouse: {
        firstName: "Chloe",
        lastName: "LastName",
        birthdate: "1999-04-12",
        preferredName: "McSpouse",
        creditScore: 800,
        annualIncome: 100000,
        otherIncome: 0,
        gender: "F",
      },
      onboarding: {
        personalDetails: true,
        accounts: true,
        budgetDetails: true,
        adviceAcknowledged: false,
        termsAndConditions: false,
      },
    });
  });
  const { token } = storage.get("accessToken", 1);
  console.log(token);
});
