import { InstructionAccountNode, InstructionNode } from '../nodes';
import {
  InstructionAccountDefault,
  InstructionArgDefault,
  InstructionDefault,
  InstructionDependency,
  MainCaseString,
} from '../shared';
import { Visitor } from './visitor2';
import { singleNodeVisitor } from './singleNodeVisitor';

type InstructionInput = InstructionArg | InstructionAccount;
type InstructionArg = {
  kind: 'arg';
  name: string;
  defaultsTo: InstructionArgDefault;
};
type InstructionAccount = { kind: 'account' } & Omit<
  InstructionAccountNode,
  'kind'
>;

export type ResolvedInstructionInput =
  | ResolvedInstructionAccount
  | ResolvedInstructionArg;
export type ResolvedInstructionAccount = InstructionAccount & {
  isPda: boolean;
  dependsOn: InstructionDependency[];
  resolvedIsSigner: boolean | 'either';
  resolvedIsOptional: boolean;
};
export type ResolvedInstructionArg = InstructionArg & {
  dependsOn: InstructionDependency[];
};

export function getResolvedInstructionInputsVisitor(): Visitor<
  ResolvedInstructionInput[],
  'instructionNode'
> {
  let stack: InstructionInput[] = [];
  let resolved: ResolvedInstructionInput[] = [];
  let visitedAccounts = new Map<string, ResolvedInstructionAccount>();
  let visitedArgs = new Map<string, ResolvedInstructionArg>();

  function resolveInstructionInput(
    instruction: InstructionNode,
    input: InstructionInput
  ): void {
    // Ensure we don't visit the same input twice.
    if (
      (input.kind === 'account' && visitedAccounts.has(input.name)) ||
      (input.kind === 'arg' && visitedArgs.has(input.name))
    ) {
      return;
    }

    // Ensure we don't have a circular dependency.
    const isCircular = stack.some(
      ({ kind, name }) => kind === input.kind && name === input.name
    );
    if (isCircular) {
      const cycle = [...stack.map(({ name }) => name), input.name].join(' -> ');
      const error =
        `Circular dependency detected in the accounts and args of ` +
        `the "${instruction.name}" instruction. ` +
        `Got the following dependency cycle: ${cycle}.`;
      throw new Error(error);
    }

    // Resolve whilst keeping track of the stack.
    stack.push(input);
    const localResolved =
      input.kind === 'account'
        ? resolveInstructionAccount(instruction, input)
        : resolveInstructionArg(instruction, input);
    stack.pop();

    // Store the resolved input.
    resolved.push(localResolved);
    if (localResolved.kind === 'account') {
      visitedAccounts.set(input.name, localResolved);
    } else {
      visitedArgs.set(input.name, localResolved);
    }
  }

  function resolveInstructionAccount(
    instruction: InstructionNode,
    account: InstructionAccount
  ): ResolvedInstructionAccount {
    // Find and visit dependencies first.
    const dependsOn = getInstructionDependencies(account);
    resolveInstructionDependencies(instruction, account, dependsOn);

    const localResolved: ResolvedInstructionAccount = {
      ...account,
      isPda: Object.values(instruction.argDefaults).some(
        (argDefault) =>
          argDefault.kind === 'accountBump' && argDefault.name === account.name
      ),
      dependsOn,
      resolvedIsSigner: account.isSigner,
      resolvedIsOptional: account.isOptional,
    };

    switch (localResolved.defaultsTo?.kind) {
      case 'account':
        const defaultAccount = visitedAccounts.get(
          localResolved.defaultsTo.name
        )!;
        const resolvedIsPublicKey =
          account.isSigner === false && defaultAccount.isSigner === false;
        const resolvedIsSigner =
          account.isSigner === true && defaultAccount.isSigner === true;
        const resolvedIsOptionalSigner =
          !resolvedIsPublicKey && !resolvedIsSigner;
        localResolved.resolvedIsSigner = resolvedIsOptionalSigner
          ? 'either'
          : resolvedIsSigner;
        localResolved.resolvedIsOptional = defaultAccount.isOptional;
        break;
      case 'publicKey':
      case 'program':
      case 'programId':
        localResolved.resolvedIsSigner =
          account.isSigner === false ? false : 'either';
        localResolved.resolvedIsOptional = false;
        break;
      case 'pda':
        localResolved.resolvedIsSigner =
          account.isSigner === false ? false : 'either';
        localResolved.resolvedIsOptional = false;
        const { seeds } = localResolved.defaultsTo;
        Object.keys(seeds).forEach((seedKey) => {
          const seed = seeds[seedKey as MainCaseString];
          if (seed.kind !== 'account') return;
          const dependency = visitedAccounts.get(seed.name)!;
          if (dependency.resolvedIsOptional) {
            const error =
              `Cannot use optional account "${seed.name}" as the "${seedKey}" PDA seed ` +
              `for the "${account.name}" account of the "${instruction.name}" instruction.`;
            throw new Error(error);
          }
        });
        break;
      case 'identity':
      case 'payer':
        localResolved.resolvedIsOptional = false;
        break;
      case 'resolver':
        localResolved.resolvedIsOptional =
          localResolved.defaultsTo.resolvedIsOptional ?? false;
        localResolved.resolvedIsSigner =
          localResolved.defaultsTo.resolvedIsSigner ??
          localResolved.resolvedIsSigner;
        break;
      default:
        break;
    }

    return localResolved;
  }

  function resolveInstructionArg(
    instruction: InstructionNode,
    arg: InstructionArg & { kind: 'arg' }
  ): ResolvedInstructionArg {
    // Find and visit dependencies first.
    const dependsOn = getInstructionDependencies(arg);
    resolveInstructionDependencies(instruction, arg, dependsOn);

    return { ...arg, dependsOn };
  }

  function resolveInstructionDependencies(
    instruction: InstructionNode,
    parent: InstructionInput,
    dependencies: InstructionDependency[]
  ): void {
    dependencies.forEach((dependency) => {
      let input: InstructionInput | null = null;
      if (dependency.kind === 'account') {
        const dependencyAccount = instruction.accounts.find(
          ({ name }) => name === dependency.name
        );
        if (!dependencyAccount) {
          const error =
            `Account "${dependency.name}" is not a valid dependency of ${parent.kind} ` +
            `"${parent.name}" in the "${instruction.name}" instruction.`;
          throw new Error(error);
        }
        input = { ...dependencyAccount, kind: 'account' };
      } else if (dependency.kind === 'arg') {
        const dependencyArg = instruction.argDefaults[dependency.name] ?? null;
        if (dependencyArg) {
          input = {
            kind: 'arg',
            name: dependency.name,
            defaultsTo: dependencyArg,
          };
        }
      }
      if (input) {
        resolveInstructionInput(instruction, input);
      }
    });
  }

  function getInstructionDependencies(
    input: InstructionInput
  ): InstructionDependency[] {
    if (!input.defaultsTo) return [];

    const getNestedDependencies = (
      defaultsTo: InstructionDefault | undefined
    ): InstructionDependency[] => {
      if (!defaultsTo) return [];

      if (input.kind === 'account') {
        return getInstructionDependencies({
          ...input,
          defaultsTo: defaultsTo as InstructionAccountDefault,
        });
      }

      return getInstructionDependencies({
        ...input,
        defaultsTo: defaultsTo as InstructionArgDefault,
      });
    };

    if (
      input.defaultsTo.kind === 'account' ||
      input.defaultsTo.kind === 'accountBump'
    ) {
      return [{ kind: 'account', name: input.defaultsTo.name }];
    }

    if (input.defaultsTo.kind === 'pda') {
      const accounts = new Set<MainCaseString>();
      const args = new Set<MainCaseString>();
      Object.values(input.defaultsTo.seeds).forEach((seed) => {
        if (seed.kind === 'account') {
          accounts.add(seed.name);
        } else if (seed.kind === 'arg') {
          args.add(seed.name);
        }
      });
      return [
        ...[...accounts].map((name) => ({ kind: 'account' as const, name })),
        ...[...args].map((name) => ({ kind: 'arg' as const, name })),
      ];
    }

    if (input.defaultsTo.kind === 'resolver') {
      return input.defaultsTo.dependsOn;
    }

    if (
      input.defaultsTo.kind === 'conditional' ||
      input.defaultsTo.kind === 'conditionalResolver'
    ) {
      const dependencies: InstructionDependency[] =
        input.defaultsTo.kind === 'conditional'
          ? [input.defaultsTo.input]
          : input.defaultsTo.resolver.dependsOn ?? [];

      dependencies.push(...getNestedDependencies(input.defaultsTo.ifTrue));
      dependencies.push(...getNestedDependencies(input.defaultsTo.ifFalse));
      return dependencies;
    }

    return [];
  }

  return singleNodeVisitor(
    'instructionNode',
    (node): ResolvedInstructionInput[] => {
      // Ensure we always start with a clean slate.
      stack = [];
      resolved = [];
      visitedAccounts = new Map();
      visitedArgs = new Map();

      const inputs: InstructionInput[] = [
        ...node.accounts.map((account) => ({
          ...account,
          kind: 'account' as const,
        })),
        ...Object.entries(node.argDefaults).map(([argName, argDefault]) => ({
          kind: 'arg' as const,
          name: argName,
          defaultsTo: argDefault,
        })),
      ];

      // Visit all instruction accounts.
      inputs.forEach((input) => {
        resolveInstructionInput(node, input);
      });

      return resolved;
    }
  );
}
