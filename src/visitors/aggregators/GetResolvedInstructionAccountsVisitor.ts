import type * as nodes from '../../nodes';
import { InstructionNodeAccountDefaultsSeed } from '../../nodes';
import { BaseThrowVisitor } from '../BaseThrowVisitor';

export type ResolvedInstructionAccount = nodes.InstructionNodeAccount & {
  position: number;
  dependencyPosition: number;
  dependsOn: string[];
  resolvedIsSigner: boolean | 'either';
  resolvedIsOptional: boolean;
};

export class GetResolvedInstructionAccountsVisitor extends BaseThrowVisitor<
  ResolvedInstructionAccount[]
> {
  protected stack: string[] = [];

  protected visited = new Map<string, ResolvedInstructionAccount>();

  protected raw = new Map<string, [nodes.InstructionNodeAccount, number]>();

  protected error: string | null = null;

  getError(): string | null {
    return this.error;
  }

  visitInstruction(
    instruction: nodes.InstructionNode
  ): ResolvedInstructionAccount[] {
    // Ensure we always start with a clean slate.
    this.error = null;
    this.stack = [];
    this.visited = new Map();
    this.raw = instruction.accounts.reduce(
      (map, account, index) => map.set(account.name, [account, index]),
      new Map<string, [nodes.InstructionNodeAccount, number]>()
    );

    // Visit all instruction accounts.
    this.raw.forEach(([account, index]) => {
      this.handleInstructionAccount(instruction, account, index);
    });

    return [...this.visited.values()].sort((a, b) => a.position - b.position);
  }

  handleInstructionAccount(
    instruction: nodes.InstructionNode,
    account: nodes.InstructionNodeAccount,
    index: number
  ): void {
    // Ensure we don't visit the same account twice.
    if (this.visited.has(account.name)) {
      return;
    }

    // Ensure we don't have a circular dependency.
    if (this.stack.includes(account.name)) {
      const cycle = [...this.stack, account.name].join(' -> ');
      this.error =
        `Circular dependency detected in the accounts of ` +
        `the "${instruction.name}" instruction. ` +
        `Got the following account dependency cycle: ${cycle}.`;
      throw new Error(this.error);
    }

    // Get account dependencies.
    const dependsOn: string[] = [];
    if (account.defaultsTo?.kind === 'account') {
      dependsOn.push(account.defaultsTo.name);
    } else if (account.defaultsTo?.kind === 'pda') {
      type AccountSeed = Extract<
        InstructionNodeAccountDefaultsSeed,
        { kind: 'account' }
      >;
      const accounts = Object.values(account.defaultsTo.seeds)
        .filter((seed): seed is AccountSeed => seed.kind === 'account')
        .map((seed) => seed.name);
      dependsOn.push(...new Set(accounts));
    }

    // Visit account dependencies first.
    this.stack.push(account.name);
    dependsOn.forEach((name) => {
      const rawDependency = this.raw.get(name);
      if (!rawDependency) {
        this.error =
          `Account "${name}" is not a valid dependency of account ` +
          `"${account.name}" in the "${instruction.name}" instruction.`;
        throw new Error(this.error);
      }
      const [dependency, dependencyIndex] = rawDependency;
      this.handleInstructionAccount(instruction, dependency, dependencyIndex);
    });
    this.stack.pop();

    const resolved: ResolvedInstructionAccount = {
      ...account,
      position: index,
      dependencyPosition: this.visited.size,
      dependsOn,
      resolvedIsSigner: account.isSigner,
      resolvedIsOptional: account.isOptional,
    };

    switch (resolved.defaultsTo?.kind) {
      case 'account':
        const defaultAccount = this.visited.get(resolved.defaultsTo.name)!;
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
          const dependency = this.visited.get(seed.name)!;
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
      default:
        break;
    }

    this.visited.set(account.name, resolved);
  }
}
