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

    const discriminator: InstructionNodeDiscriminator = {
      value: 'todo',
      type: new nodes.TypeArrayNode(new nodes.TypeLeafNode('u8'), 8),
    };

    return new nodes.InstructionNode(
      instruction.name,
      instruction.accounts,
      instruction.args,
      discriminator,
      instruction.defaultOptionalAccounts
    );
  }
}

// renderValue() {
//     return isShankIdlInstruction(this.ix)
//       ? JSON.stringify(this.ix.discriminant.value)
//       : JSON.stringify(Array.from(instructionDiscriminator(this.ix.name)))
//   }

// export function instructionDiscriminator(name: string): Buffer {
//   return sighash(SIGHASH_GLOBAL_NAMESPACE, name);
// }

// function sighash(nameSpace: string, ixName: string): Buffer {
//   const name = snakeCase(ixName);
//   const preimage = `${nameSpace}:${name}`;
//   return Buffer.from(sha256.digest(preimage)).slice(0, 8);
// }

// export function anchorDiscriminatorField(name: string) {
//   const ty: IdlTypeArray = { array: ['u8', 8] };
//   return { name, type: ty };
// }
