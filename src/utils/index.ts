/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
//import { AppData } from '../AppData';
import { createDataCache, DataCache, DataCategory, DataCompartmentOptions } from '../DataCache';
export interface ResponseA {
  name: string;
}

export interface ResponseB {
  email: string;
}

export interface TestStoreCompartments {
  a: DataCompartmentOptions<ResponseA[]>;
  b: DataCompartmentOptions<ResponseB[]>;
}

export interface SubscriptionProxy<Compartments> {
  <T>(name: keyof Compartments): Promise<T>;
}

export interface DataCacheScenario<Compartments> {
  cache: DataCache<Compartments>;
  createProxy: SubscriptionProxy<Compartments>;
  waitForAllCompartments: () => Promise<void>;
}

export function createDataCacheScenario<Compartments>(policy: Compartments): DataCacheScenario<Compartments> {
  const cache = createDataCache<Compartments>(policy);
  function createProxy<T>(name: keyof Compartments): Promise<T> {
    return new Promise((resolve, reject) => {
      cache.observe$<T>(name).subscribe({
        next: (val) => resolve(val),
        error: (err) => reject(err),
      });
    });
  }

  async function waitForAllCompartments(): Promise<void> {
    const waits = Object.keys(policy as { [s: string]: unknown; }).map((key) => {
      return new Promise<void>((resolve) => {
        const compartment = cache.findCompartment(key as keyof Compartments);
        if (compartment.category === DataCategory.NonCritical) {
          resolve();
        }

        // eslint-disable-next-line prefer-const
        let initializedSub: Subscription | undefined;

        function clearSub(): void {
          if (!initializedSub) {
            return;
          }

          initializedSub.unsubscribe();
        }
        initializedSub = compartment
          .initialized$()
          .pipe(filter((x) => x === true))
          .subscribe({
            next: () => {
              clearSub();
              resolve();
            },
            error: () => {
              clearSub();
              resolve();
            },
          });
      });
    });

    await Promise.all(waits);
  }

  return {
    cache,
    createProxy,
    waitForAllCompartments,
  };
}
export async function waitUntil(predicate: () => Promise<boolean>, nrRetries = 3): Promise<void> {
  const interval = 250;
  let count = 0;
  function innerWait(resolve: () => void, reject: (reason?: any) => void) {
    setTimeout(async () => {
      if (await predicate()) {
        resolve();
        return;
      }

      ++count;
      if (count > nrRetries) {
        reject(new Error('Exceeded retry count'));
        return;
      }

      setTimeout(() => innerWait(resolve, reject), interval);
    }, interval);
  }

  return new Promise((resolve, reject) => {
    innerWait(resolve, reject);
  });
}

export async function wait(time: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
