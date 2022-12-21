import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

type Rule =
  | {
      pattern: RegExp;
      address: string;
    }
  | {
      pattern: RegExp;
      program: nodes.Program;
    };

export class IdentifyDefaultInstructionAccountsVisitor extends BaseNodeVisitor {
  constructor(readonly rules: Rule[]) {
    super();
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

      const defaultsTo: nodes.InstructionNodeAccountDefaults =
        'address' in rule
          ? { kind: 'address', address: rule.address }
          : { kind: 'program', program: rule.program };

      return { ...account, defaultsTo };
    });

    return new nodes.InstructionNode(
      instruction.name,
      instruction.program,
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
