import { firstValueFrom } from 'rxjs';
import { AppData } from './AppData';
import { DataCategory } from './DataCache';
import { createDataCacheScenario, ResponseB, TestStoreCompartments } from './utils';

  test('AppData > something?????', async () => {
    const appData = new AppData();
    const b: ResponseB[] = [];

    const { cache,  waitForAllCompartments } = createDataCacheScenario<TestStoreCompartments>({
        a: {
            load: async () => {throw new Error('error in a!')},
            defaultValue: [],
            category: DataCategory.NonCritical,
          },
          b: {
            load: async () => b,
            defaultValue: [],
            category: DataCategory.NonCritical,
          },
    });
    cache.observeWith(appData);
    await waitForAllCompartments();
    const hasError = await firstValueFrom<boolean>(appData.hasError$());
    expect(hasError).toBeTruthy();
  });