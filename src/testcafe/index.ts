import { ClientFunction, Selector } from "testcafe";

const impersonate = ClientFunction(() =>
  // @ts-ignore
  window.impersonate(
    "eyJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJNT0JJTEVfVVNFUiIsImFjY291bnRJZCI6MjQyODQ5NCwic2NvcGUiOiIiLCJkYlVzZXIiOjAsInN1YiI6IjAiLCJleHAiOjE2NjQ3MjkzMjcsImVudiI6InVhdCIsImlhdCI6MTY2Mzg2NTMyN30.bOef_vBxVWSiCTd9vezDDEvkp6ecjlgvyINjSqrhLfPj0QVGaKTse05KwDCN0F1BAxZ0b-EtbR1c-7nYfJsvWg"
  )
);

const getToken = ClientFunction(() =>
  window.localStorage.getItem("ACCESS_TOKEN")
);

// fixture`Getting Started`.page`http://localhost:3000`.beforeEach(
//   async () => await setToken()
// );

fixture`Getting Started`.page`http://127.0.0.1:3000`;

test("Impersonate", async () => {
  await impersonate();
  const token = await getToken();
  console.log(token);
});
