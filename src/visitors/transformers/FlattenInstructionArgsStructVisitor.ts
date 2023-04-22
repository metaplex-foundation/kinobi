import * as nodes from '../../nodes';
import { TransformNodesVisitor } from './TransformNodesVisitor';
import { flattenStruct } from './FlattenStructVisitor';

export class FlattenInstructionArgsStructVisitor extends TransformNodesVisitor {
  constructor() {
    super([
      {
        selector: { kind: 'instructionNode' },
        transformer: (instruction) => {
          nodes.assertInstructionNode(instruction);
          return nodes.instructionNode(
            instruction.metadata,
            instruction.accounts,
            flattenStruct(instruction.args),
            instruction.extraArgs,
            instruction.subInstructions
          );
        },
      },
    ]);
  }
}
