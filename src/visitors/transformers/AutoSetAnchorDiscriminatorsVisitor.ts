import { sha256 } from '@noble/hashes/sha256';
import { snakeCase } from '../../utils';
import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class AutoSetAnchorDiscriminatorsVisitor extends BaseNodeVisitor {
  protected program: nodes.ProgramNode | null = null;

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    this.program = program;
    const visitedProgram = new nodes.ProgramNode(
      program.metadata,
      program.accounts
        .map((account) => account.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      program.instructions
        .map((instruction) => instruction.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
      program.definedTypes,
      program.errors
    );
    this.program = null;
    return visitedProgram;
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const shouldAddDiscriminator = this.program?.metadata.origin === 'anchor';
    if (!shouldAddDiscriminator) return account;

    const idlName = snakeCase(account.metadata.idlName);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminatorField = new nodes.TypeStructFieldNode(
      {
        name: 'discriminator',
        docs: [],
        defaultsTo: {
          strategy: 'omitted',
          value: getValueNodeFromBytes(hash),
        },
      },
      new nodes.TypeArrayNode(new nodes.TypeLeafNode('u8'), 8)
    );

    return new nodes.AccountNode(
      account.metadata,
      new nodes.TypeStructNode(account.type.name, [
        discriminatorField,
        ...account.type.fields,
      ])
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const shouldAddDiscriminator = this.program?.metadata.origin === 'anchor';
    if (!shouldAddDiscriminator) return instruction;

    const idlName = snakeCase(instruction.metadata.idlName);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminatorField = new nodes.TypeStructFieldNode(
      {
        name: 'discriminator',
        docs: [],
        defaultsTo: {
          strategy: 'omitted',
          value: getValueNodeFromBytes(hash),
        },
      },
      new nodes.TypeArrayNode(new nodes.TypeLeafNode('u8'), 8)
    );

    return new nodes.InstructionNode(
      instruction.metadata,
      instruction.accounts,
      new nodes.TypeStructNode(instruction.args.name, [
        discriminatorField,
        ...instruction.args.fields,
      ]),
      instruction.subInstructions
    );
  }
}

function getValueNodeFromBytes(bytes: Uint8Array): nodes.ListValueNode {
  return nodes.vList([...bytes].map((byte) => nodes.vScalar(byte)));
}
