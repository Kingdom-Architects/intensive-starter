import { resolveValue } from '@aesop-engine/aesop-babl';
import { Command } from './SystemStateTypes';
import Storage from './Storage';

export type ContextFactory = (storage: Storage) => Promise<Record<string, any>>;
export type SystemStateScenario = (state: SystemState, storage: Storage, context: Record<string, any>) => Promise<void>;
const DefaultContextFactory: ContextFactory = async () => ({} as Record<string, any>);

export class SystemState {
  constructor(private storage: Storage, private contextFactory: ContextFactory = DefaultContextFactory) {}

  async execute<T extends Record<string, any>>(command: Command<T>, id: string | number, config: T) {
    if (config) {
      Object.entries(config).forEach(([key, val]) => {
        if (typeof val === 'function') {
          (config as Record<string, any>)[key] = val();
        } else if (typeof val === 'string') {
          (config as Record<string, any>)[key] = resolveValue(val, { storage: this.storage });
        }
      });
    }

    const context = await this.contextFactory(this.storage);
    const result = await command({ id, config }, this.storage, context);
    return result;
  }

  async importScenario(scenario: SystemStateScenario) {
    const context = await this.contextFactory(this.storage);
    await scenario(this, this.storage, context);
  }
}
