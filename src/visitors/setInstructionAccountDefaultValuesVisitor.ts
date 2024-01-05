import {
  InstructionAccountNode,
  InstructionNode,
  instructionNode,
} from '../nodes';
import {
  InstructionInputValueNode,
  identityValueNode,
  payerValueNode,
  programIdValueNode,
} from '../nodes/contextualValueNodes';
import { publicKeyValueNode } from '../nodes/valueNodes';
import { LinkableDictionary, mainCase, pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { fillDefaultPdaSeedValuesVisitor } from './fillDefaultPdaSeedValuesVisitor';
import { identityVisitor } from './identityVisitor';
import { recordLinkablesVisitor } from './recordLinkablesVisitor';
import { visit } from './visitor';

export type InstructionAccountDefaultRule = {
  /** The name of the instruction account or a pattern to match on it. */
  account: string | RegExp;
  /** The default value to assign to it. */
  defaultValue: InstructionInputValueNode;
  /** @defaultValue Defaults to searching accounts on all instructions. */
  instruction?: string;
  /** @defaultValue `false`. */
  ignoreIfOptional?: boolean;
};

export const DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES: InstructionAccountDefaultRule[] =
  [
    {
      account: /^payer|feePayer$/,
      defaultValue: payerValueNode(),
      ignoreIfOptional: true,
    },
    {
      account: /^authority$/,
      defaultValue: identityValueNode(),
      ignoreIfOptional: true,
    },
    {
      account: /^programId$/,
      defaultValue: programIdValueNode(),
      ignoreIfOptional: true,
    },
    {
      account: /^systemProgram|splSystemProgram$/,
      defaultValue: publicKeyValueNode('11111111111111111111111111111111'),
      ignoreIfOptional: true,
    },
    {
      account: /^tokenProgram|splTokenProgram$/,
      defaultValue: publicKeyValueNode(
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^ataProgram|splAtaProgram$/,
      defaultValue: publicKeyValueNode(
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^tokenMetadataProgram|mplTokenMetadataProgram$/,
      defaultValue: publicKeyValueNode(
        'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
      ),
      ignoreIfOptional: true,
    },
    {
      account:
        /^(tokenAuth|mplTokenAuth|authorization|mplAuthorization|auth|mplAuth)RulesProgram$/,
      defaultValue: publicKeyValueNode(
        'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^candyMachineProgram|mplCandyMachineProgram$/,
      defaultValue: publicKeyValueNode(
        'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^candyGuardProgram|mplCandyGuardProgram$/,
      defaultValue: publicKeyValueNode(
        'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^clockSysvar|sysvarClock$/,
      defaultValue: publicKeyValueNode(
        'SysvarC1ock11111111111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^epochScheduleSysvar|sysvarEpochSchedule$/,
      defaultValue: publicKeyValueNode(
        'SysvarEpochSchedu1e111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^(instructions?Sysvar|sysvarInstructions?)(Account)?$/,
      defaultValue: publicKeyValueNode(
        'Sysvar1nstructions1111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^recentBlockhashesSysvar|sysvarRecentBlockhashes$/,
      defaultValue: publicKeyValueNode(
        'SysvarRecentB1ockHashes11111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^rent|rentSysvar|sysvarRent$/,
      defaultValue: publicKeyValueNode(
        'SysvarRent111111111111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^rewardsSysvar|sysvarRewards$/,
      defaultValue: publicKeyValueNode(
        'SysvarRewards111111111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^slotHashesSysvar|sysvarSlotHashes$/,
      defaultValue: publicKeyValueNode(
        'SysvarS1otHashes111111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^slotHistorySysvar|sysvarSlotHistory$/,
      defaultValue: publicKeyValueNode(
        'SysvarS1otHistory11111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^stakeHistorySysvar|sysvarStakeHistory$/,
      defaultValue: publicKeyValueNode(
        'SysvarStakeHistory1111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
  ];

export function setInstructionAccountDefaultValuesVisitor(
  rules: InstructionAccountDefaultRule[]
) {
  const linkables = new LinkableDictionary();

  // Place the rules with instructions first.
  const sortedRules = rules.sort((a, b) => {
    const ia = 'instruction' in a;
    const ib = 'instruction' in b;
    if ((ia && ib) || (!a && !ib)) return 0;
    return ia ? -1 : 1;
  });

  function matchRule(
    instruction: InstructionNode,
    account: InstructionAccountNode
  ): InstructionAccountDefaultRule | undefined {
    return sortedRules.find((rule) => {
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

  return pipe(
    identityVisitor(['rootNode', 'programNode', 'instructionNode']),
    (v) => recordLinkablesVisitor(v, linkables),
    (v) =>
      extendVisitor(v, {
        visitInstruction(node) {
          const instructionAccounts = node.accounts.map(
            (account): InstructionAccountNode => {
              const rule = matchRule(node, account);
              if (!rule) return account;

              if (
                (rule.ignoreIfOptional ?? false) &&
                (account.isOptional || !!account.defaultValue)
              ) {
                return account;
              }

              return {
                ...account,
                defaultValue: visit(
                  rule.defaultValue,
                  fillDefaultPdaSeedValuesVisitor(node, linkables)
                ),
              };
            }
          );

          return instructionNode({
            ...node,
            accounts: instructionAccounts,
          });
        },
      })
  );
}
