import * as nodes from '../../nodes';
import { BaseNodeVisitor } from '../BaseNodeVisitor';

export type InstructionAccountDefaultRule =
  nodes.InstructionNodeAccountDefaults & {
    account: string | RegExp;
    instruction?: string;
  };

export const DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES: InstructionAccountDefaultRule[] =
  [
    {
      kind: 'program',
      account: /^systemProgram|splSystemProgram$/,
      program: {
        name: 'splSystem',
        address: '11111111111111111111111111111111',
      },
    },
    {
      kind: 'program',
      account: /^tokenProgram|splTokenProgram$/,
      program: {
        name: 'splToken',
        address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      },
    },
    {
      kind: 'program',
      account: /^ataProgram|splAtaProgram$/,
      program: {
        name: 'splAssociatedToken',
        address: 'TokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
      },
    },
    {
      kind: 'address',
      account: /^clockSysvar|sysvarClockSysvar$/,
      address: 'SysvarC1ock11111111111111111111111111111111',
    },
    {
      kind: 'address',
      account: /^epochScheduleSysvar|sysvarEpochSchedule$/,
      address: 'SysvarEpochSchedu1e111111111111111111111111',
    },
    {
      kind: 'address',
      account: /^instructionsSysvar|sysvarInstructions$/,
      address: 'Sysvar1nstructions1111111111111111111111111',
    },
    {
      kind: 'address',
      account: /^recentBlockhashesSysvar|sysvarRecentBlockhashes$/,
      address: 'SysvarRecentB1ockHashes11111111111111111111',
    },
    {
      kind: 'address',
      account: /^rent|rentSysvar|sysvarRent$/,
      address: 'SysvarRent111111111111111111111111111111111',
    },
    {
      kind: 'address',
      account: /^rewardsSysvar|sysvarRewards$/,
      address: 'SysvarRewards111111111111111111111111111111',
    },
    {
      kind: 'address',
      account: /^slotHashesSysvar|sysvarSlotHashes$/,
      address: 'SysvarS1otHashes111111111111111111111111111',
    },
    {
      kind: 'address',
      account: /^slotHistorySysvar|sysvarSlotHistory$/,
      address: 'SysvarS1otHistory11111111111111111111111111',
    },
    {
      kind: 'address',
      account: /^stakeHistorySysvar|sysvarStakeHistory$/,
      address: 'SysvarStakeHistory1111111111111111111111111',
    },
    {
      kind: 'programId',
      account: /^programId$/,
    },
  ];

export class SetInstructionAccountDefaultValuesVisitor extends BaseNodeVisitor {
  protected readonly rules: InstructionAccountDefaultRule[];

  constructor(rules: InstructionAccountDefaultRule[]) {
    super();

    // Place the rules with instructions first.
    this.rules = rules.sort((a, b) => {
      const ia = 'instruction' in a;
      const ib = 'instruction' in b;
      if ((ia && ib) || (!a && !ib)) return 0;
      return ia ? -1 : 1;
    });
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const accounts = instruction.accounts.map((account) => {
      // Skip if the account is already recognised.
      if (account.defaultsTo) {
        return account;
      }

      // Skip if the account doesn't match any rules.
      const rule = this.matchRule(instruction, account);
      if (!rule) {
        return account;
      }

      return { ...account, defaultsTo: rule };
    });

    return new nodes.InstructionNode(
      instruction.metadata,
      accounts,
      instruction.args
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    // No need to visit account trees.
    return account;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    // No need to visit defined type trees.
    return definedType;
  }

  visitError(error: nodes.ErrorNode): nodes.Node {
    // No need to visit error trees.
    return error;
  }

  protected matchRule(
    instruction: nodes.InstructionNode,
    account: nodes.InstructionNodeAccount
  ): InstructionAccountDefaultRule | undefined {
    return this.rules.find((rule) => {
      if ('instruction' in rule && rule.instruction !== instruction.name) {
        return false;
      }
      return typeof rule.account === 'string'
        ? rule.account === account.name
        : rule.account.test(account.name);
    });
  }
}
