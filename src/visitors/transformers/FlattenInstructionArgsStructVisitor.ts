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
          return nodes.instructionNode({
            ...instruction,
            dataArgs: nodes.instructionDataArgsNode(
              flattenStruct(instruction.dataArgs),
              instruction.dataArgs.link
            ),
          });
        },
      },
    ]);
  }
}
