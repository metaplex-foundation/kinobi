import { sha256 } from '@noble/hashes/sha256';
import { snakeCase } from '../utils';
import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export class FillAnchorDiscriminatorVisitor extends BaseNodeVisitor {
  protected program: nodes.ProgramNode | null = null;

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    this.program = program;
    const visitedProgram = new nodes.ProgramNode(
      program.idl,
      program.metadata,
      program.accounts.map((account) => {
        const child = account.accept(this);
        nodes.assertAccountNode(child);
        return child;
      }),
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

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const shouldAddDiscriminator = this.program?.metadata.origin === 'anchor';
    if (!shouldAddDiscriminator) return account;

    // TODO: Lock IDL name like instruction nodes.
    // const idlName = snakeCase(account.metadata.idlName);
    const idlName = snakeCase(account.name);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminatorField = {
      name: 'discriminator',
      type: new nodes.TypeArrayNode(new nodes.TypeLeafNode('u8'), 8),
      docs: [],
      defaultsTo: {
        value: Array.from(hash),
        strategy: 'omitted' as const,
      },
    };

    return new nodes.AccountNode(
      account.name,
      new nodes.TypeStructNode(account.type.name, [
        discriminatorField,
        ...account.type.fields,
      ]),
      account.docs
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const shouldAddDiscriminator = this.program?.metadata.origin === 'anchor';
    if (!shouldAddDiscriminator) return instruction;

    const idlName = snakeCase(instruction.metadata.idlName);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminatorField = {
      name: 'discriminator',
      type: new nodes.TypeArrayNode(new nodes.TypeLeafNode('u8'), 8),
      docs: [],
      defaultsTo: {
        value: Array.from(hash),
        strategy: 'omitted' as const,
      },
    };

    return new nodes.InstructionNode(
      instruction.name,
      instruction.accounts,
      new nodes.TypeStructNode(instruction.args.name, [
        discriminatorField,
        ...instruction.args.fields,
      ]),
      instruction.metadata
    );
  }
}
