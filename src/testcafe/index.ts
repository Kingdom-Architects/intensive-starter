import { ClientFunction, Selector } from "testcafe";
import { API } from "../apis";
import createAccount from "../system-state/commands/createAccount";
import runScenario from "../system-state/runScenario";
import { test } from "testcafe";

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

// fixture`Getting Started`.page`http://127.0.0.1:3000`;

fixture`Getting Started`;

test("Impersonate", async (t) => {
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
  const [, account] = storage.get("account", 1);
  const { participantId, accountId } = account;
  await API.investments.post({
    id: accountId,
    participantId,
    name: "invest1",
    planType: 0,
    adviced: true,
    type: "string",
    planSponsorName: "string",
    posttaxContribAllowed: true,
    employerContrib: true,
    employerMatch: true,
    contributionEligibility: true,
    employeeContrib: true,
    profitSharing: true,
    contribMethod: "D",
    pretaxSavingsRate: 0,
    posttaxSavingsRate: 0,
    rothSavingsRate: 0,
    companyMatchRate: 0,
    companyMatchRateMax: 0,
    companyMatchDlrMax: 0,
    companyMatchRate1: 0,
    companyMatchRate2: 0,
    employerSsbw: 0,
    employeeContribPctAboveSsbw: 0,
    expEmpContribPctEndValue: 0,
    expectedProfitSharePctInc: 0,
    profitSharingRate: 0,
    balance: 1000006,
    preTaxSavingsAmt: 0,
    postTaxSavingsAmt: 0,
    rothSavingsAmt: 0,
    featuresFlags: 0,
    matchRate1EndingPct: 0,
    matchRate2EndingPct: 0,
    matchingStock: "string",
    matchingStockPct: 0,
    planCatchUpDlrAmount: 0,
    planContribDlrLimitNoCap: 0,
    planContribLimitDlr: 0,
    planContribLimitDlrAt: 0,
    planContribLimitPct: 0,
    planContribLimitPctAt: 0,
    planContribPctMinPretax: 0,
    plancontribPctlimitBtcatchup: 0,
    planId: 0,
    rkPlanId: "string",
    trustFamily: 0,
    yearNeeded: 0,
    rothContribAllowed: true,
  });
  await API.investments.post({
    id: accountId,
    participantId,
    name: "invest2",
    planType: 0,
    adviced: true,
    type: "string",
    planSponsorName: "string",
    posttaxContribAllowed: true,
    employerContrib: true,
    employerMatch: true,
    contributionEligibility: true,
    employeeContrib: true,
    profitSharing: true,
    contribMethod: "D",
    pretaxSavingsRate: 0,
    posttaxSavingsRate: 0,
    rothSavingsRate: 0,
    companyMatchRate: 0,
    companyMatchRateMax: 0,
    companyMatchDlrMax: 0,
    companyMatchRate1: 0,
    companyMatchRate2: 0,
    employerSsbw: 0,
    employeeContribPctAboveSsbw: 0,
    expEmpContribPctEndValue: 0,
    expectedProfitSharePctInc: 0,
    profitSharingRate: 0,
    balance: 69420,
    preTaxSavingsAmt: 0,
    postTaxSavingsAmt: 0,
    rothSavingsAmt: 0,
    featuresFlags: 0,
    matchRate1EndingPct: 0,
    matchRate2EndingPct: 0,
    matchingStock: "string",
    matchingStockPct: 0,
    planCatchUpDlrAmount: 0,
    planContribDlrLimitNoCap: 0,
    planContribLimitDlr: 0,
    planContribLimitDlrAt: 0,
    planContribLimitPct: 0,
    planContribLimitPctAt: 0,
    planContribPctMinPretax: 0,
    plancontribPctlimitBtcatchup: 0,
    planId: 0,
    rkPlanId: "string",
    trustFamily: 0,
    yearNeeded: 0,
    rothContribAllowed: true,
  });
  const response = await API.investments.getAll();
  console.log("accout balance: " + response.data.length);

  await t.navigateTo(`http://127.0.0.1:3000`);
  await impersonate(token);
  await t.navigateTo(`http://127.0.0.1:3000/investments`);
  await t.expect(Selector("div")).ok();
});
