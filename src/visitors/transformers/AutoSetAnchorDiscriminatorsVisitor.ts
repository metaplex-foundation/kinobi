import { sha256 } from '@noble/hashes/sha256';
import { snakeCase } from '../../utils';
import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export class AutoSetAnchorDiscriminatorsVisitor extends BaseNodeVisitor {
  protected program: nodes.ProgramNode | null = null;

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    this.program = program;
    const visitedProgram = nodes.programNode(
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
    if (nodes.isLinkTypeNode(account.type)) return account;

    const idlName = snakeCase(account.metadata.idlName);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminatorField = nodes.structFieldTypeNode(
      {
        name: 'discriminator',
        docs: [],
        defaultsTo: {
          strategy: 'omitted',
          value: getValueNodeFromBytes(hash),
        },
      },
      nodes.arrayTypeNode(nodes.numberTypeNode('u8'), {
        size: { kind: 'fixed', size: 8 },
      })
    );

    return nodes.accountNode(
      {
        ...account.metadata,
        discriminator: { kind: 'field', name: 'discriminator', value: null },
      },
      nodes.structTypeNode(account.type.name, [
        discriminatorField,
        ...account.type.fields,
      ])
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const shouldAddDiscriminator = this.program?.metadata.origin === 'anchor';
    if (!shouldAddDiscriminator) return instruction;
    if (nodes.isLinkTypeNode(instruction.args)) return instruction;

    const idlName = snakeCase(instruction.metadata.idlName);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminatorField = nodes.structFieldTypeNode(
      {
        name: 'discriminator',
        docs: [],
        defaultsTo: {
          strategy: 'omitted',
          value: getValueNodeFromBytes(hash),
        },
      },
      nodes.arrayTypeNode(nodes.numberTypeNode('u8'), {
        size: { kind: 'fixed', size: 8 },
      })
    );

    return nodes.instructionNode(
      instruction.metadata,
      instruction.accounts,
      nodes.structTypeNode(instruction.args.name, [
        discriminatorField,
        ...instruction.args.fields,
      ]),
      instruction.extraArgs,
      instruction.subInstructions
    );
  }
}

function getValueNodeFromBytes(bytes: Uint8Array): nodes.ListValueNode {
  return nodes.vList([...bytes].map((byte) => nodes.vScalar(byte)));
}
