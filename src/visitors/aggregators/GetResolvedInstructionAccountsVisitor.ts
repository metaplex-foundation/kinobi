import type * as nodes from '../../nodes';
import { BaseThrowVisitor } from '../BaseThrowVisitor';

export type ResolvedInstructionAccount = nodes.InstructionNodeAccount & {
  position: number;
  dependencyPosition: number;
  dependsOn: string[];
};

export class GetResolvedInstructionAccountsVisitor extends BaseThrowVisitor<
  ResolvedInstructionAccount[]
> {
  protected stack: string[] = [];

  protected visited = new Map<string, ResolvedInstructionAccount>();

  protected raw = new Map<string, [nodes.InstructionNodeAccount, number]>();

  visitInstruction(
    instruction: nodes.InstructionNode
  ): ResolvedInstructionAccount[] {
    // Ensure we always start with a clean slate.
    this.stack = [];
    this.visited = new Map();
    this.raw = instruction.accounts.reduce(
      (map, account, index) => map.set(account.name, [account, index]),
      new Map<string, [nodes.InstructionNodeAccount, number]>()
    );

    // Visit all instruction accounts.
    this.raw.forEach(([account, index]) => {
      this.visitInstructionAccount(instruction, account, index);
    });

    return [...this.visited.values()].sort((a, b) => a.position - b.position);
  }

  visitInstructionAccount(
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
      throw new Error(
        `Circular dependency detected in instruction ${instruction.name}. ` +
          `Got the following account dependency cycle: ${cycle}.`
      );
    }

    this.stack.push(account.name);

    // Get account dependencies.
    const dependsOn: string[] = [];
    if (account.defaultsTo.kind === 'account') {
      dependsOn.push(account.defaultsTo.name);
    }

    // Visit account dependencies first.
    dependsOn.forEach((name) => {
      const [dependency, dependencyIndex] = this.raw.get(name)!;
      this.visitInstructionAccount(instruction, dependency, dependencyIndex);
    });

    let { isSigner, isOptionalSigner, isOptional } = account;

    switch (account.defaultsTo.kind) {
      case 'account':
        const defaultAccount = this.visited.get(account.defaultsTo.name)!;
        const newIsSigner = isSigner && defaultAccount.isSigner;
        const newIsPublicKey = !isSigner && !defaultAccount.isSigner;
        isSigner = newIsSigner;
        isOptionalSigner = !newIsSigner || !newIsPublicKey;
        isOptional = defaultAccount.isOptional;
        break;
      case 'address':
      case 'program':
      case 'programId':
        isOptionalSigner = isSigner;
        isSigner = false;
        isOptional = false;
        break;
      case 'identity':
      case 'payer':
        isOptionalSigner = isOptionalSigner || !isSigner;
        isOptional = false;
        break;
      default:
        break;
    }

    const resolved: ResolvedInstructionAccount = {
      ...account,
      position: index,
      dependencyPosition: this.visited.size,
      dependsOn,
      isSigner,
      isOptionalSigner,
      isOptional,
    };

    this.visited.set(account.name, resolved);
  }
}
