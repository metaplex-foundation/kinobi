import * as nodes from '../nodes';
import { Visitor } from './Visitor';

type ValidatorItem = {
  message: string;
  level: 'error' | 'warning' | 'info';
  node: nodes.Node;
  stack: string[];
};

export class ValidateTreeVisitor implements Visitor<ValidatorItem[]> {
  private stack: string[] = [];

  private exportedNames: Map<string, string[]> = new Map();

  visitRoot(root: nodes.RootNode): ValidatorItem[] {
    this.stack.push('Root');
    const items = root.programs.flatMap((program) => program.accept(this));
    this.stack.pop();
    return items;
  }

  visitProgram(program: nodes.ProgramNode): ValidatorItem[] {
    this.stack.push(
      program.metadata.name
        ? `Program: ${program.metadata.name}`
        : 'Unnamed Program'
    );

    const items: ValidatorItem[] = [];
    if (!program.metadata.name) {
      items.push(this.error(program, 'Program has no name'));
    }
    if (!program.metadata.address) {
      items.push(this.error(program, 'Program has no address'));
    }
    if (!program.metadata.version) {
      items.push(this.warning(program, 'Program has no version'));
    }
    if (!program.metadata.origin) {
      items.push(this.info(program, 'Program has no origin'));
    }

    items.push(...program.accounts.flatMap((node) => node.accept(this)));
    items.push(...program.instructions.flatMap((node) => node.accept(this)));
    items.push(...program.definedTypes.flatMap((node) => node.accept(this)));
    items.push(...program.errors.flatMap((node) => node.accept(this)));
    this.stack.pop();
    return items;
  }

  visitAccount(account: nodes.AccountNode): ValidatorItem[] {
    this.stack.push(
      account.name ? `Account: ${account.name}` : 'Unnamed Program'
    );

    const items: ValidatorItem[] = [];
    if (!account.name) {
      items.push(this.error(account, 'Account has no name'));
    }
    items.push(...this.checkNameConflict(account, account.name));

    items.push(...account.type.accept(this));
    this.stack.pop();
    return items;
  }

  visitInstruction(instruction: nodes.InstructionNode): ValidatorItem[] {
    return [];
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorItem[] {
    return [];
  }

  visitError(error: nodes.ErrorNode): ValidatorItem[] {
    return [];
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): ValidatorItem[] {
    return [];
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): ValidatorItem[] {
    return [];
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): ValidatorItem[] {
    return [];
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): ValidatorItem[] {
    return [];
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): ValidatorItem[] {
    return [];
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): ValidatorItem[] {
    return [];
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): ValidatorItem[] {
    return [];
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): ValidatorItem[] {
    return [];
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): ValidatorItem[] {
    return [];
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): ValidatorItem[] {
    return [];
  }

  protected checkNameConflict(
    node: nodes.Node,
    name: string,
    record = true
  ): ValidatorItem[] {
    if (!name) return [];
    const conflict = this.nameConflict(node, name);
    if (conflict) return [conflict];
    if (record) this.exportedNames.set(name, [...this.stack]);
    return [];
  }

  protected nameConflict(node: nodes.Node, name: string): ValidatorItem | null {
    if (!this.exportedNames.has(name)) return null;
    const conflictingStack = this.exportedNames.get(name) as string[];
    const conflictingStackString = conflictingStack.join(' -> ');
    const message = `Exported name "${name}" conflicts with the following node "${conflictingStackString}"`;
    return this.item('error', node, message);
  }

  protected error(node: nodes.Node, message: string): ValidatorItem {
    return this.item('error', node, message);
  }

  protected warning(node: nodes.Node, message: string): ValidatorItem {
    return this.item('warning', node, message);
  }

  protected info(node: nodes.Node, message: string): ValidatorItem {
    return this.item('info', node, message);
  }

  protected item(
    level: ValidatorItem['level'],
    node: nodes.Node,
    message: string
  ): ValidatorItem {
    return { message, level, node, stack: [...this.stack] };
  }
}
