import {
  InstructionAccountNode,
  InstructionNode,
  VALUE_NODES,
  getDefaultSeedValuesFromPda,
  instructionNode,
  isNode,
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
import { identityVisitor } from './identityVisitor';
import { recordLinkablesVisitor } from './recordLinkablesVisitor';

export type InstructionAccountDefaultRule = {
  /** The name of the instruction account or a pattern to match on it. */
  account: string | RegExp;
  /** The default value to assign to it. */
  defaultsTo: InstructionInputValueNode;
  /** @defaultValue Defaults to searching accounts on all instructions. */
  instruction?: string;
  /** @defaultValue `false`. */
  ignoreIfOptional?: boolean;
};

export const DEFAULT_INSTRUCTION_ACCOUNT_DEFAULT_RULES: InstructionAccountDefaultRule[] =
  [
    {
      account: /^payer|feePayer$/,
      defaultsTo: payerValueNode(),
      ignoreIfOptional: true,
    },
    {
      account: /^authority$/,
      defaultsTo: identityValueNode(),
      ignoreIfOptional: true,
    },
    {
      account: /^programId$/,
      defaultsTo: programIdValueNode(),
      ignoreIfOptional: true,
    },
    {
      account: /^systemProgram|splSystemProgram$/,
      defaultsTo: publicKeyValueNode('11111111111111111111111111111111'),
      ignoreIfOptional: true,
    },
    {
      account: /^tokenProgram|splTokenProgram$/,
      defaultsTo: publicKeyValueNode(
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^ataProgram|splAtaProgram$/,
      defaultsTo: publicKeyValueNode(
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^tokenMetadataProgram|mplTokenMetadataProgram$/,
      defaultsTo: publicKeyValueNode(
        'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
      ),
      ignoreIfOptional: true,
    },
    {
      account:
        /^(tokenAuth|mplTokenAuth|authorization|mplAuthorization|auth|mplAuth)RulesProgram$/,
      defaultsTo: publicKeyValueNode(
        'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^candyMachineProgram|mplCandyMachineProgram$/,
      defaultsTo: publicKeyValueNode(
        'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^candyGuardProgram|mplCandyGuardProgram$/,
      defaultsTo: publicKeyValueNode(
        'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^clockSysvar|sysvarClock$/,
      defaultsTo: publicKeyValueNode(
        'SysvarC1ock11111111111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^epochScheduleSysvar|sysvarEpochSchedule$/,
      defaultsTo: publicKeyValueNode(
        'SysvarEpochSchedu1e111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^(instructions?Sysvar|sysvarInstructions?)(Account)?$/,
      defaultsTo: publicKeyValueNode(
        'Sysvar1nstructions1111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^recentBlockhashesSysvar|sysvarRecentBlockhashes$/,
      defaultsTo: publicKeyValueNode(
        'SysvarRecentB1ockHashes11111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^rent|rentSysvar|sysvarRent$/,
      defaultsTo: publicKeyValueNode(
        'SysvarRent111111111111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^rewardsSysvar|sysvarRewards$/,
      defaultsTo: publicKeyValueNode(
        'SysvarRewards111111111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^slotHashesSysvar|sysvarSlotHashes$/,
      defaultsTo: publicKeyValueNode(
        'SysvarS1otHashes111111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^slotHistorySysvar|sysvarSlotHistory$/,
      defaultsTo: publicKeyValueNode(
        'SysvarS1otHistory11111111111111111111111111'
      ),
      ignoreIfOptional: true,
    },
    {
      account: /^stakeHistorySysvar|sysvarStakeHistory$/,
      defaultsTo: publicKeyValueNode(
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
              if (!rule) {
                return account;
              }
              if (
                (rule.ignoreIfOptional ?? false) &&
                (account.isOptional || !!account.defaultsTo)
              ) {
                return account;
              }
              if (isNode(rule.defaultsTo, 'pdaValueNode')) {
                const foundAccount = linkables.get(rule.defaultsTo.pda);
                const defaultsTo = {
                  ...rule.defaultsTo,
                  seeds: {
                    ...(foundAccount
                      ? getDefaultSeedValuesFromPda(foundAccount)
                      : {}),
                    ...rule.defaultsTo.seeds,
                  },
                };

                if (rule.instruction) {
                  return { ...account, defaultsTo };
                }

                const allSeedsAreValid = Object.entries(defaultsTo.seeds).every(
                  ([, seed]) => {
                    if (isNode(seed, VALUE_NODES)) return true;
                    if (isNode(seed, 'accountValueNode')) {
                      return node.accounts.some(
                        (a) => a.name === mainCase(seed.name)
                      );
                    }
                    if (node.dataArgs.link) return true;
                    return node.dataArgs.struct.fields.some(
                      (f) => f.name === mainCase(seed.name)
                    );
                  }
                );

                if (allSeedsAreValid) {
                  return { ...account, defaultsTo };
                }

                return account;
              }
              return { ...account, defaultsTo: rule.defaultsTo };
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
