import { sha256 } from '@noble/hashes/sha256';
import * as nodes from '../../nodes';
import { fieldAccountDiscriminator, fixedSize, snakeCase } from '../../shared';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { visit } from '../Visitor';

export class AutoSetAnchorDiscriminatorsVisitor extends BaseNodeVisitor {
  protected program: nodes.ProgramNode | null = null;

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    this.program = program;
    const visitedProgram = nodes.programNode({
      ...program,
      accounts: program.accounts
        .map((account) => visit(account, this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      instructions: program.instructions
        .map((instruction) => visit(instruction, this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
    });
    this.program = null;
    return visitedProgram;
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const shouldAddDiscriminator = this.program?.origin === 'anchor';
    if (!shouldAddDiscriminator) return account;

    const idlName = snakeCase(account.idlName);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminatorField = nodes.structFieldTypeNode({
      name: 'discriminator',
      child: nodes.arrayTypeNode(nodes.numberTypeNode('u8'), {
        size: fixedSize(8),
      }),
      defaultsTo: {
        strategy: 'omitted',
        value: getValueNodeFromBytes(hash),
      },
    });

    return nodes.accountNode({
      ...account,
      discriminator: fieldAccountDiscriminator('discriminator'),
      data: nodes.accountDataNode({
        ...account.data,
        struct: nodes.structTypeNode([
          discriminatorField,
          ...account.data.struct.fields,
        ]),
      }),
    });
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const shouldAddDiscriminator = this.program?.origin === 'anchor';
    if (!shouldAddDiscriminator) return instruction;

    const idlName = snakeCase(instruction.idlName);
    const hash = sha256(`global:${idlName}`).slice(0, 8);

    const discriminatorField = nodes.structFieldTypeNode({
      name: 'discriminator',
      child: nodes.arrayTypeNode(nodes.numberTypeNode('u8'), {
        size: fixedSize(8),
      }),
      defaultsTo: {
        strategy: 'omitted',
        value: getValueNodeFromBytes(hash),
      },
    });

    return nodes.instructionNode({
      ...instruction,
      dataArgs: nodes.instructionDataArgsNode({
        ...instruction.dataArgs,
        struct: nodes.structTypeNode([
          discriminatorField,
          ...instruction.dataArgs.struct.fields,
        ]),
      }),
    });
  }
}

function getValueNodeFromBytes(bytes: Uint8Array): nodes.ListValueNode {
  return nodes.vList([...bytes].map((byte) => nodes.vScalar(byte)));
}
