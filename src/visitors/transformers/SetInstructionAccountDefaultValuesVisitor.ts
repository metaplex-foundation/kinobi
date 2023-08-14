import * as nodes from '../../nodes';
import {
  InstructionAccountDefault,
  getDefaultSeedsFromAccount,
  mainCase,
} from '../../shared';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { visit } from '../Visitor';

export type InstructionAccountDefaultRule = InstructionAccountDefault & {
  /** The name of the instruction account or a pattern to match on it. */
  account: string | RegExp;
  /** @defaultValue Defaults to searching accounts on all instructions. */
  instruction?: string;
  /** @defaultValue `false`. */
  ignoreIfOptional?: boolean;
};

export const DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES: InstructionAccountDefaultRule[] =
  [
    {
      kind: 'payer',
      account: /^payer|feePayer$/,
      ignoreIfOptional: true,
    },
    {
      kind: 'identity',
      account: /^authority$/,
      ignoreIfOptional: true,
    },
    {
      kind: 'programId',
      account: /^programId$/,
      ignoreIfOptional: true,
    },
    {
      kind: 'program',
      account: /^systemProgram|splSystemProgram$/,
      program: {
        name: 'splSystem',
        publicKey: '11111111111111111111111111111111',
      },
      ignoreIfOptional: true,
    },
    {
      kind: 'program',
      account: /^tokenProgram|splTokenProgram$/,
      program: {
        name: 'splToken',
        publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      },
      ignoreIfOptional: true,
    },
    {
      kind: 'program',
      account: /^ataProgram|splAtaProgram$/,
      program: {
        name: 'splAssociatedToken',
        publicKey: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
      },
      ignoreIfOptional: true,
    },
    {
      kind: 'program',
      account: /^tokenMetadataProgram|mplTokenMetadataProgram$/,
      program: {
        name: 'mplTokenMetadata',
        publicKey: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
      },
      ignoreIfOptional: true,
    },
    {
      kind: 'program',
      account:
        /^(tokenAuth|mplTokenAuth|authorization|mplAuthorization|auth|mplAuth)RulesProgram$/,
      program: {
        name: 'mplTokenAuthRules',
        publicKey: 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
      },
      ignoreIfOptional: true,
    },
    {
      kind: 'program',
      account: /^candyMachineProgram|mplCandyMachineProgram$/,
      program: {
        name: 'mplCandyMachine',
        publicKey: 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
      },
      ignoreIfOptional: true,
    },
    {
      kind: 'program',
      account: /^candyGuardProgram|mplCandyGuardProgram$/,
      program: {
        name: 'mplCandyGuard',
        publicKey: 'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g',
      },
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^clockSysvar|sysvarClockSysvar$/,
      publicKey: 'SysvarC1ock11111111111111111111111111111111',
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^epochScheduleSysvar|sysvarEpochSchedule$/,
      publicKey: 'SysvarEpochSchedu1e111111111111111111111111',
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^(instructions?Sysvar|sysvarInstructions?)(Account)?$/,
      publicKey: 'Sysvar1nstructions1111111111111111111111111',
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^recentBlockhashesSysvar|sysvarRecentBlockhashes$/,
      publicKey: 'SysvarRecentB1ockHashes11111111111111111111',
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^rent|rentSysvar|sysvarRent$/,
      publicKey: 'SysvarRent111111111111111111111111111111111',
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^rewardsSysvar|sysvarRewards$/,
      publicKey: 'SysvarRewards111111111111111111111111111111',
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^slotHashesSysvar|sysvarSlotHashes$/,
      publicKey: 'SysvarS1otHashes111111111111111111111111111',
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^slotHistorySysvar|sysvarSlotHistory$/,
      publicKey: 'SysvarS1otHistory11111111111111111111111111',
      ignoreIfOptional: true,
    },
    {
      kind: 'publicKey',
      account: /^stakeHistorySysvar|sysvarStakeHistory$/,
      publicKey: 'SysvarStakeHistory1111111111111111111111111',
      ignoreIfOptional: true,
    },
  ];

export class SetInstructionAccountDefaultValuesVisitor extends BaseNodeVisitor {
  protected readonly rules: InstructionAccountDefaultRule[];

  protected allAccounts = new Map<string, nodes.AccountNode>();

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

  visitRoot(root: nodes.RootNode): nodes.Node {
    nodes.getAllAccounts(root).forEach((account) => {
      this.allAccounts.set(account.name, account);
    });
    return super.visitRoot(root);
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    return nodes.programNode({
      ...program,
      instructions: program.instructions
        .map((instruction) => visit(instruction, this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
    });
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const instructionAccounts = instruction.accounts.map(
      (account): nodes.InstructionAccountNode => {
        const rule = this.matchRule(instruction, account);
        if (!rule) {
          return account;
        }
        if (
          (rule.ignoreIfOptional ?? false) &&
          (account.isOptional || !!account.defaultsTo)
        ) {
          return account;
        }
        if (rule.kind === 'pda') {
          const foundAccount = this.allAccounts.get(mainCase(rule.pdaAccount));
          const defaultsTo = {
            ...rule,
            seeds: {
              ...(foundAccount ? getDefaultSeedsFromAccount(foundAccount) : {}),
              ...rule.seeds,
            },
          };

          if (rule.instruction) {
            return { ...account, defaultsTo };
          }

          const allSeedsAreValid = Object.entries(defaultsTo.seeds).every(
            ([, seed]) => {
              if (seed.kind === 'value') return true;
              if (seed.kind === 'account') {
                return instruction.accounts.some(
                  (a) => a.name === mainCase(seed.name)
                );
              }
              if (instruction.dataArgs.link) return true;
              return instruction.dataArgs.struct.fields.some(
                (f) => f.name === mainCase(seed.name)
              );
            }
          );

          if (allSeedsAreValid) {
            return { ...account, defaultsTo };
          }

          return account;
        }
        return { ...account, defaultsTo: rule };
      }
    );

    return nodes.instructionNode({
      ...instruction,
      accounts: instructionAccounts,
    });
  }

  protected matchRule(
    instruction: nodes.InstructionNode,
    account: nodes.InstructionAccountNode
  ): InstructionAccountDefaultRule | undefined {
    return this.rules.find((rule) => {
      if (
        'instruction' in rule &&
        rule.instruction &&
        mainCase(rule.instruction) !== instruction.name
      ) {
        return false;
      }
      return typeof rule.account === 'string'
        ? mainCase(rule.account) === account.name
        : rule.account.test(account.name);
    });
  }
}
