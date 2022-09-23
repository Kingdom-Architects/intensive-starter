import createAccount from './commands/createAccount';
import runScenario from './runScenario';

// https://github.com/axios/axios/issues/771

test('Example System State', async () => {
  // await runScenario(async (state) => {
  //   await state.execute(createAccount, 1, {
  //     firstName: '',
  //     lastName: '',
  //     emailAddress: '',
  //     password: '',
  //     birthdate: '',
  //   });
  // })
});
