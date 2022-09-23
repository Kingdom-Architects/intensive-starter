import { AccessToken, AccessTokenProvider } from '../apis/AccessTokenProvider';
import { ContextFactory, SystemState, SystemStateScenario } from './SystemState';
import { Logger } from './Logger';
import Storage from './Storage';

const logger = new Logger();
const contextFactory: ContextFactory = async (storage: Storage) => {
  const accessToken = storage.get("accessToken", 1) as AccessToken;
  if (typeof accessToken !== 'undefined') {
    await AccessTokenProvider.setAccessToken(accessToken);
  }

  return { logger };
};

export default async function runScenario(scenario: SystemStateScenario): Promise<Storage> {
  const storage = new Storage();
  const state = new SystemState(storage, contextFactory);
  const context = await contextFactory(storage);

  await scenario(state, storage, context);
  return storage;
}
