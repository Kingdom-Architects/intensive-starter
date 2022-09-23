import { IInstruction, SystemStateCommand } from "../SystemStateTypes";
import Storage from '../Storage';

class Composer {
  constructor(private actions: SystemStateCommand[]) { }

  compose() {
    return async (instruction: IInstruction, storage: Storage, context: Record<string, any>) => {
      let result = null;
      for (let i = 0; i < this.actions.length; i++) {
        const action = this.actions[i];
        result = await action(instruction, storage, context);
      }

      return result;
    };
  }
}

export function composeCommands(...args: SystemStateCommand[]) {
  const composer = new Composer(Array.from(args));
  return composer.compose();
};
