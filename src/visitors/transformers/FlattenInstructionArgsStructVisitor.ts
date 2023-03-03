import * as nodes from '../../nodes';
import { TransformNodesVisitor } from './TransformNodesVisitor';
import { flattenStruct } from './FlattenStructVisitor';

export class FlattenInstructionArgsStructVisitor extends TransformNodesVisitor {
  constructor() {
    super([
      {
        selector: { type: 'InstructionNode' },
        transformer: (instruction) => {
          nodes.assertInstructionNode(instruction);
          return new nodes.InstructionNode(
            instruction.metadata,
            instruction.accounts,
            flattenStruct(instruction.args),
            instruction.subInstructions
          );
        },
      },
    ]);
  }
}
