import {
  AccountValueNode,
  ArgumentValueNode,
  InstructionAccountNode,
  InstructionInputValueNode,
  InstructionNode,
  accountValueNode,
  isNode,
} from '../nodes';
import { MainCaseString } from '../shared';
import { singleNodeVisitor } from './singleNodeVisitor';
import { Visitor } from './visitor';

type InstructionInput = InstructionArgument | InstructionAccountNode;
type InstructionArgument = {
  kind: 'argument';
  name: string;
  defaultValue: InstructionInputValueNode;
};
type InstructionDependency = ArgumentValueNode | AccountValueNode;

export type ResolvedInstructionInput =
  | ResolvedInstructionAccount
  | ResolvedInstructionArgument;
export type ResolvedInstructionAccount = InstructionAccountNode & {
  isPda: boolean;
  dependsOn: InstructionDependency[];
  resolvedIsSigner: boolean | 'either';
  resolvedIsOptional: boolean;
};
export type ResolvedInstructionArgument = InstructionArgument & {
  dependsOn: InstructionDependency[];
};

export function getResolvedInstructionInputsVisitor(): Visitor<
  ResolvedInstructionInput[],
  'instructionNode'
> {
  let stack: InstructionInput[] = [];
  let resolved: ResolvedInstructionInput[] = [];
  let visitedAccounts = new Map<string, ResolvedInstructionAccount>();
  let visitedArgs = new Map<string, ResolvedInstructionArgument>();

  function resolveInstructionInput(
    instruction: InstructionNode,
    input: InstructionInput
  ): void {
    // Ensure we don't visit the same input twice.
    if (
      (input.kind === 'instructionAccountNode' &&
        visitedAccounts.has(input.name)) ||
      (input.kind === 'argument' && visitedArgs.has(input.name))
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
      input.kind === 'instructionAccountNode'
        ? resolveInstructionAccount(instruction, input)
        : resolveInstructionArg(instruction, input);
    stack.pop();

    // Store the resolved input.
    resolved.push(localResolved);
    if (localResolved.kind === 'instructionAccountNode') {
      visitedAccounts.set(input.name, localResolved);
    } else {
      visitedArgs.set(input.name, localResolved);
    }
  }

  function resolveInstructionAccount(
    instruction: InstructionNode,
    account: InstructionAccountNode
  ): ResolvedInstructionAccount {
    // Find and visit dependencies first.
    const dependsOn = getInstructionDependencies(account);
    resolveInstructionDependencies(instruction, account, dependsOn);

    const localResolved: ResolvedInstructionAccount = {
      ...account,
      isPda: Object.values(instruction.argDefaults).some(
        (argDefault) =>
          isNode(argDefault, 'accountBumpValueNode') &&
          argDefault.name === account.name
      ),
      dependsOn,
      resolvedIsSigner: account.isSigner,
      resolvedIsOptional: account.isOptional,
    };

    switch (localResolved.defaultValue?.kind) {
      case 'accountValueNode':
        const defaultAccount = visitedAccounts.get(
          localResolved.defaultValue.name
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
      case 'publicKeyValueNode':
      case 'programLinkNode':
      case 'programIdValueNode':
        localResolved.resolvedIsSigner =
          account.isSigner === false ? false : 'either';
        localResolved.resolvedIsOptional = false;
        break;
      case 'pdaValueNode':
        localResolved.resolvedIsSigner =
          account.isSigner === false ? false : 'either';
        localResolved.resolvedIsOptional = false;
        const { seeds } = localResolved.defaultValue;
        seeds.forEach((seed) => {
          if (!isNode(seed.value, 'accountValueNode')) return;
          const dependency = visitedAccounts.get(seed.value.name)!;
          if (dependency.resolvedIsOptional) {
            const error =
              `Cannot use optional account "${seed.value.name}" as the "${seed.name}" PDA seed ` +
              `for the "${account.name}" account of the "${instruction.name}" instruction.`;
            throw new Error(error);
          }
        });
        break;
      case 'identityValueNode':
      case 'payerValueNode':
      case 'resolverValueNode':
        localResolved.resolvedIsOptional = false;
        break;
      default:
        break;
    }

    return localResolved;
  }

  function resolveInstructionArg(
    instruction: InstructionNode,
    arg: InstructionArgument & { kind: 'argument' }
  ): ResolvedInstructionArgument {
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
      if (isNode(dependency, 'accountValueNode')) {
        const dependencyAccount = instruction.accounts.find(
          ({ name }) => name === dependency.name
        );
        if (!dependencyAccount) {
          const error =
            `Account "${dependency.name}" is not a valid dependency of ${parent.kind} ` +
            `"${parent.name}" in the "${instruction.name}" instruction.`;
          throw new Error(error);
        }
        input = { ...dependencyAccount };
      } else if (isNode(dependency, 'argumentValueNode')) {
        const dependencyArg = instruction.argDefaults[dependency.name] ?? null;
        if (dependencyArg) {
          input = {
            kind: 'argument',
            name: dependency.name,
            defaultValue: dependencyArg,
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
    if (!input.defaultValue) return [];

    const getNestedDependencies = (
      defaultValue: InstructionInputValueNode | undefined
    ): InstructionDependency[] => {
      if (!defaultValue) return [];
      return getInstructionDependencies({ ...input, defaultValue });
    };

    if (
      isNode(input.defaultValue, ['accountValueNode', 'accountBumpValueNode'])
    ) {
      return [accountValueNode(input.defaultValue.name)];
    }

    if (isNode(input.defaultValue, 'pdaValueNode')) {
      const dependencies = new Map<MainCaseString, InstructionDependency>();
      input.defaultValue.seeds.forEach((seed) => {
        if (isNode(seed.value, ['accountValueNode', 'argumentValueNode'])) {
          dependencies.set(seed.value.name, { ...seed.value });
        }
      });
      return [...dependencies.values()];
    }

    if (isNode(input.defaultValue, 'resolverValueNode')) {
      return input.defaultValue.dependsOn ?? [];
    }

    if (isNode(input.defaultValue, 'conditionalValueNode')) {
      return [
        ...getNestedDependencies(input.defaultValue.condition),
        ...getNestedDependencies(input.defaultValue.ifTrue),
        ...getNestedDependencies(input.defaultValue.ifFalse),
      ];
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
        ...node.accounts,
        ...Object.entries(node.argDefaults).map(([argName, argDefault]) => ({
          kind: 'argument' as const,
          name: argName,
          defaultValue: argDefault,
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
