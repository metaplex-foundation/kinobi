import * as nodes from '../../nodes';
import { TransformNodesVisitor } from './TransformNodesVisitor';
import { unwrapStruct } from './UnwrapStructVisitor';

export class UnwrapInstructionArgsStructVisitor extends TransformNodesVisitor {
  constructor() {
    super([
      {
        selector: { type: 'instruction' },
        transformer: (instruction) => {
          nodes.assertInstructionNode(instruction);
          return new nodes.InstructionNode(
            instruction.metadata,
            instruction.accounts,
            unwrapStruct(instruction.args),
            instruction.subInstructions
          );
        },
      },
    ]);
  }
}
