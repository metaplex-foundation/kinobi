import { sha256 } from '@noble/hashes/sha256';
import { snakeCase } from '../utils';
import * as nodes from '../nodes';
import { InstructionNodeDiscriminator } from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class FillAnchorDiscriminatorVisitor extends BaseNodeVisitor {
  protected program: nodes.ProgramNode | null = null;

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    this.program = program;
    const visitedProgram = new nodes.ProgramNode(
      program.idl,
      program.metadata,
      program.accounts,
      program.instructions.map((instruction) => {
        const child = instruction.accept(this);
        nodes.assertInstructionNode(child);
        return child;
      }),
      program.definedTypes,
      program.errors
    );
    this.program = null;
    return visitedProgram;
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const shouldUpdateDiscriminator =
      this.program?.metadata.origin === 'anchor' && !instruction.discriminator;
    if (!shouldUpdateDiscriminator) return instruction;

    const idlName = snakeCase(instruction.metadata.idlName);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminator: InstructionNodeDiscriminator = {
      value: Array.from(hash),
      type: new nodes.TypeArrayNode(new nodes.TypeLeafNode('u8'), 8),
    };

    return new nodes.InstructionNode(
      instruction.name,
      instruction.accounts,
      instruction.args,
      discriminator,
      instruction.metadata
    );
  }
}
