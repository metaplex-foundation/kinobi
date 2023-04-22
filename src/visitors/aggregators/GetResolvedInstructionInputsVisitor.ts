import type * as nodes from '../../nodes';
import { BaseThrowVisitor } from '../BaseThrowVisitor';

type InstructionNodeInput =
  | ({ kind: 'arg' } & InstructionNodeArg)
  | ({ kind: 'account' } & nodes.InstructionNodeAccount);

type InstructionNodeArg = {
  name: string;
  defaultsTo: nodes.InstructionNodeArgDefaults;
};

export type ResolvedInstructionAccount = nodes.InstructionNodeAccount & {
  kind: 'account';
  isPda: boolean;
  dependsOn: nodes.InstructionNodeInputDependency[];
  resolvedIsSigner: boolean | 'either';
  resolvedIsOptional: boolean;
};

export type ResolvedInstructionArg = InstructionNodeArg & {
  kind: 'arg';
  dependsOn: nodes.InstructionNodeInputDependency[];
};

export type ResolvedInstructionInput =
  | ResolvedInstructionAccount
  | ResolvedInstructionArg;

export class GetResolvedInstructionInputsVisitor extends BaseThrowVisitor<
  ResolvedInstructionInput[]
> {
  protected stack: InstructionNodeInput[] = [];

  protected resolved: ResolvedInstructionInput[] = [];

  protected visitedAccounts = new Map<string, ResolvedInstructionAccount>();

  protected visitedArgs = new Map<string, ResolvedInstructionArg>();

  protected error: string | null = null;

  getError(): string | null {
    return this.error;
  }

  visitInstruction(
    instruction: nodes.InstructionNode
  ): ResolvedInstructionInput[] {
    // Ensure we always start with a clean slate.
    this.error = null;
    this.stack = [];
    this.resolved = [];
    this.visitedAccounts = new Map();
    this.visitedArgs = new Map();

    const inputs: InstructionNodeInput[] = [
      ...instruction.accounts.map((account) => ({
        kind: 'account' as const,
        ...account,
      })),
      ...Object.entries(instruction.metadata.argDefaults).map(
        ([argName, argDefault]) => ({
          kind: 'arg' as const,
          name: argName,
          defaultsTo: argDefault,
        })
      ),
    ];

    // Visit all instruction accounts.
    inputs.forEach((input) => {
      this.resolveInstructionInput(instruction, input);
    });

    return this.resolved;
  }

  resolveInstructionInput(
    instruction: nodes.InstructionNode,
    input: InstructionNodeInput
  ): void {
    // Ensure we don't visit the same input twice.
    if (
      (input.kind === 'account' && this.visitedAccounts.has(input.name)) ||
      (input.kind === 'arg' && this.visitedArgs.has(input.name))
    ) {
      return;
    }

    // Ensure we don't have a circular dependency.
    const isCircular = this.stack.some(
      ({ kind, name }) => kind === input.kind && name === input.name
    );
    if (isCircular) {
      const cycle = [...this.stack.map(({ name }) => name), input.name].join(
        ' -> '
      );
      this.error =
        `Circular dependency detected in the accounts and args of ` +
        `the "${instruction.name}" instruction. ` +
        `Got the following dependency cycle: ${cycle}.`;
      throw new Error(this.error);
    }

    // Resolve whilst keeping track of the stack.
    this.stack.push(input);
    const resolved =
      input.kind === 'account'
        ? this.resolveInstructionAccount(instruction, input)
        : this.resolveInstructionArg(instruction, input);
    this.stack.pop();

    // Store the resolved input.
    this.resolved.push(resolved);
    if (resolved.kind === 'account') {
      this.visitedAccounts.set(input.name, resolved);
    } else {
      this.visitedArgs.set(input.name, resolved);
    }
  }

  resolveInstructionAccount(
    instruction: nodes.InstructionNode,
    account: nodes.InstructionNodeAccount & { kind: 'account' }
  ): ResolvedInstructionAccount {
    // Get account dependencies.
    const dependsOn: nodes.InstructionNodeInputDependency[] = [];
    if (account.defaultsTo?.kind === 'account') {
      dependsOn.push({ kind: 'account', name: account.defaultsTo.name });
    } else if (account.defaultsTo?.kind === 'pda') {
      const accounts = new Set<string>();
      const args = new Set<string>();
      Object.values(account.defaultsTo.seeds).forEach((seed) => {
        if (seed.kind === 'account') {
          accounts.add(seed.name);
        } else if (seed.kind === 'arg') {
          args.add(seed.name);
        }
      });
      dependsOn.push(
        ...[...accounts].map((name) => ({ kind: 'account' as const, name })),
        ...[...accounts].map((name) => ({ kind: 'arg' as const, name }))
      );
    } else if (account.defaultsTo?.kind === 'resolver') {
      dependsOn.push(...account.defaultsTo.dependsOn);
    }

    // Visit account dependencies first.
    this.resolveInstructionDependencies(instruction, account, dependsOn);

    const resolved: ResolvedInstructionAccount = {
      ...account,
      isPda: Object.values(instruction.metadata.argDefaults).some(
        (argDefault) =>
          argDefault.kind === 'accountBump' && argDefault.name === account.name
      ),
      dependsOn,
      resolvedIsSigner: account.isSigner,
      resolvedIsOptional: account.isOptional,
    };

    switch (resolved.defaultsTo?.kind) {
      case 'account':
        const defaultAccount = this.visitedAccounts.get(
          resolved.defaultsTo.name
        )!;
        const resolvedIsPublicKey =
          account.isSigner === false && defaultAccount.isSigner === false;
        const resolvedIsSigner =
          account.isSigner === true && defaultAccount.isSigner === true;
        const resolvedIsOptionalSigner =
          !resolvedIsPublicKey && !resolvedIsSigner;
        resolved.resolvedIsSigner = resolvedIsOptionalSigner
          ? 'either'
          : resolvedIsSigner;
        resolved.resolvedIsOptional = defaultAccount.isOptional;
        break;
      case 'publicKey':
      case 'program':
      case 'programId':
        resolved.resolvedIsSigner =
          account.isSigner === false ? false : 'either';
        resolved.resolvedIsOptional = false;
        break;
      case 'pda':
        resolved.resolvedIsSigner =
          account.isSigner === false ? false : 'either';
        resolved.resolvedIsOptional = false;
        const { seeds } = resolved.defaultsTo;
        Object.keys(seeds).forEach((seedKey) => {
          const seed = seeds[seedKey];
          if (seed.kind !== 'account') return;
          const dependency = this.visitedAccounts.get(seed.name)!;
          if (dependency.resolvedIsOptional) {
            this.error =
              `Cannot use optional account "${seed.name}" as the "${seedKey}" PDA seed ` +
              `for the "${account.name}" account of the "${instruction.name}" instruction.`;
            throw new Error(this.error);
          }
        });
        break;
      case 'identity':
      case 'payer':
        resolved.resolvedIsOptional = false;
        break;
      case 'resolver':
        resolved.resolvedIsOptional =
          resolved.defaultsTo.resolvedIsOptional ?? resolved.resolvedIsOptional;
        resolved.resolvedIsSigner =
          resolved.defaultsTo.resolvedIsSigner ?? resolved.resolvedIsSigner;
        break;
      default:
        break;
    }

    return resolved;
  }

  resolveInstructionArg(
    instruction: nodes.InstructionNode,
    arg: InstructionNodeArg & { kind: 'arg' }
  ): ResolvedInstructionArg {
    // Get account dependencies.
    const dependsOn: nodes.InstructionNodeInputDependency[] = [];
    if (
      arg.defaultsTo.kind === 'account' ||
      arg.defaultsTo.kind === 'accountBump'
    ) {
      dependsOn.push({ kind: 'account', name: arg.defaultsTo.name });
    } else if (arg.defaultsTo.kind === 'arg') {
      dependsOn.push({ kind: 'arg', name: arg.defaultsTo.name });
    } else if (arg.defaultsTo.kind === 'resolver') {
      dependsOn.push(...arg.defaultsTo.dependsOn);
    }

    // Visit account dependencies first.
    this.resolveInstructionDependencies(instruction, arg, dependsOn);

    return { ...arg, dependsOn };
  }

  resolveInstructionDependencies(
    instruction: nodes.InstructionNode,
    parent: InstructionNodeInput,
    dependencies: nodes.InstructionNodeInputDependency[]
  ): void {
    dependencies.forEach((dependency) => {
      let input: InstructionNodeInput | null = null;
      if (dependency.kind === 'account') {
        const dependencyAccount = instruction.accounts.find(
          ({ name }) => name === dependency.name
        );
        if (!dependencyAccount) {
          this.error =
            `Account "${dependency.name}" is not a valid dependency of ${parent.kind} ` +
            `"${parent.name}" in the "${instruction.name}" instruction.`;
          throw new Error(this.error);
        }
        input = { kind: 'account', ...dependencyAccount };
      } else if (dependency.kind === 'arg') {
        const dependencyArg =
          instruction.metadata.argDefaults[dependency.name] ?? null;
        if (dependencyArg) {
          input = {
            kind: 'arg',
            name: dependency.name,
            defaultsTo: dependencyArg,
          };
        }
      }
      if (input) {
        this.resolveInstructionInput(instruction, input);
      }
    });
  }
}
