import Storage from './Storage';

export interface IInstruction {
  id: string | number;
  config: Record<string, any>;
}

export interface CommandInstruction<T extends Record<string, any>> extends IInstruction {
  config: T;
}

export type SystemStateCommand = (instruction: IInstruction, storage: Storage, context: Record<string, any>) => Promise<void>;

export type Command<T extends Record<string, any>> = (instruction: CommandInstruction<T>, storage: Storage, context: Record<string, any>) => Promise<void>;
