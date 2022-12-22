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
    pattern: /^systemProgram$/,
    program: {
      name: 'solana.system',
      address: '11111111111111111111111111111111',
    },
  },
  {
    pattern: /^tokenProgram$/,
    program: {
      name: 'solana.token',
      address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    },
  },
  {
    pattern: /^ataProgram$/,
    program: {
      name: 'solana.associatedToken',
      address: 'TokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    },
  },
  {
    pattern: /^clockSysvar$/,
    address: 'SysvarC1ock11111111111111111111111111111111',
  },
  {
    pattern: /^epochScheduleSysvar$/,
    address: 'SysvarEpochSchedu1e111111111111111111111111',
  },
  {
    pattern: /^instructionsSysvar$/,
    address: 'Sysvar1nstructions1111111111111111111111111',
  },
  {
    pattern: /^recentBlockhashesSysvar$/,
    address: 'SysvarRecentB1ockHashes11111111111111111111',
  },
  {
    pattern: /^rent|rentSysvar$/,
    address: 'SysvarRent111111111111111111111111111111111',
  },
  {
    pattern: /^rewardsSysvar$/,
    address: 'SysvarRewards111111111111111111111111111111',
  },
  {
    pattern: /^slotHashesSysvar$/,
    address: 'SysvarS1otHashes111111111111111111111111111',
  },
  {
    pattern: /^slotHistorySysvar$/,
    address: 'SysvarS1otHistory11111111111111111111111111',
  },
  {
    pattern: /^stakeHistorySysvar$/,
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
          kind: 'program',
          program: instruction.program,
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
      instruction.name,
      accounts,
      instruction.args,
      instruction.discriminator,
      instruction.defaultOptionalAccounts,
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
