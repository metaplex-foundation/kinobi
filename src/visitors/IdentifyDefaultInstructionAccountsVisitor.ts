import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

type Rule =
  | {
      pattern: RegExp;
      address: string;
    }
  | {
      pattern: RegExp;
      program: { name: string; address: string };
    }
  | {
      pattern: RegExp;
      programId: true;
    };

const DEFAULT_RULES: Rule[] = [
  {
    pattern: /^systemProgram|splSystemProgram$/,
    program: {
      name: 'splSystem',
      address: '11111111111111111111111111111111',
    },
  },
  {
    pattern: /^tokenProgram|splTokenProgram$/,
    program: {
      name: 'splToken',
      address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    },
  },
  {
    pattern: /^ataProgram|splAtaProgram$/,
    program: {
      name: 'splAssociatedToken',
      address: 'TokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    },
  },
  {
    pattern: /^clockSysvar|sysvarClockSysvar$/,
    address: 'SysvarC1ock11111111111111111111111111111111',
  },
  {
    pattern: /^epochScheduleSysvar|sysvarEpochSchedule$/,
    address: 'SysvarEpochSchedu1e111111111111111111111111',
  },
  {
    pattern: /^instructionsSysvar|sysvarInstructions$/,
    address: 'Sysvar1nstructions1111111111111111111111111',
  },
  {
    pattern: /^recentBlockhashesSysvar|sysvarRecentBlockhashes$/,
    address: 'SysvarRecentB1ockHashes11111111111111111111',
  },
  {
    pattern: /^rent|rentSysvar|sysvarRent$/,
    address: 'SysvarRent111111111111111111111111111111111',
  },
  {
    pattern: /^rewardsSysvar|sysvarRewards$/,
    address: 'SysvarRewards111111111111111111111111111111',
  },
  {
    pattern: /^slotHashesSysvar|sysvarSlotHashes$/,
    address: 'SysvarS1otHashes111111111111111111111111111',
  },
  {
    pattern: /^slotHistorySysvar|sysvarSlotHistory$/,
    address: 'SysvarS1otHistory11111111111111111111111111',
  },
  {
    pattern: /^stakeHistorySysvar|sysvarStakeHistory$/,
    address: 'SysvarStakeHistory1111111111111111111111111',
  },
  {
    pattern: /^programId$/,
    programId: true,
  },
];

export class IdentifyDefaultInstructionAccountsVisitor extends BaseNodeVisitor {
  protected readonly rules: Rule[];

  constructor(rules: Rule[] = [], includeDefaultRules = true) {
    super();
    this.rules = includeDefaultRules ? [...DEFAULT_RULES, ...rules] : rules;
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const accounts = instruction.accounts.map((account) => {
      // Skip if the account is already recognised.
      if (account.defaultsTo) {
        return account;
      }

      // Skip if the account doesn't match any rules.
      const rule = this.matchRule(account);
      if (!rule) {
        return account;
      }

      // Use the instruction's program if the matched rule is "programId".
      if ('programId' in rule) {
        const defaultsTo: nodes.InstructionNodeAccountDefaults = {
          kind: 'programId',
        };
        return { ...account, defaultsTo };
      }

      // Set the account's new default value.
      const defaultsTo: nodes.InstructionNodeAccountDefaults =
        'address' in rule
          ? { kind: 'address', address: rule.address }
          : { kind: 'program', program: rule.program };

      return { ...account, defaultsTo };
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

  protected matchRule(account: nodes.InstructionNodeAccount): Rule | undefined {
    return this.rules.find((rule) => rule.pattern.test(account.name));
  }
}
