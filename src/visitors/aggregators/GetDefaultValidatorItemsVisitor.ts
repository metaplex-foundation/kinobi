import { LogLevel } from '../../logs';
import { pascalCase } from '../../utils';
import * as nodes from '../../nodes';
import { Visitor } from '../Visitor';
import { NodeStack } from '../NodeStack';

export type ValidatorItem = {
  message: string;
  level: LogLevel;
  node: nodes.Node;
  stack: NodeStack;
};

export class GetDefaultValidatorItemsVisitor
  implements Visitor<ValidatorItem[]>
{
  protected stack: NodeStack = new NodeStack();

  protected program: nodes.ProgramNode | null = null;

  protected exportedNames: Map<string, NodeStack> = new Map();

  protected definedTypes = new Set<string>();

  visitRoot(root: nodes.RootNode): ValidatorItem[] {
    this.pushNode(root);

    // Register defined types to make sure links are valid.
    root.allDefinedTypes.forEach((type) => this.definedTypes.add(type.name));

    const items = root.programs.flatMap((program) => program.accept(this));
    this.popNode();
    return items;
  }

  visitProgram(program: nodes.ProgramNode): ValidatorItem[] {
    this.pushNode(program);
    const items: ValidatorItem[] = [];
    if (!program.metadata.name) {
      items.push(this.error(program, 'Program has no name'));
    }
    if (!program.metadata.address) {
      items.push(this.error(program, 'Program has no address'));
    }
    if (!program.metadata.version) {
      items.push(this.warn(program, 'Program has no version'));
    }
    if (!program.metadata.origin) {
      items.push(this.info(program, 'Program has no origin'));
    }

    items.push(...program.accounts.flatMap((node) => node.accept(this)));
    items.push(...program.instructions.flatMap((node) => node.accept(this)));
    items.push(...program.definedTypes.flatMap((node) => node.accept(this)));
    items.push(...program.errors.flatMap((node) => node.accept(this)));
    this.popNode();
    return items;
  }

  visitAccount(account: nodes.AccountNode): ValidatorItem[] {
    this.pushNode(account);
    const items: ValidatorItem[] = [];
    if (!account.name) {
      items.push(this.error(account, 'Account has no name'));
    }
    items.push(...this.checkNameConflict(account, account.name));

    items.push(...account.type.accept(this));
    this.popNode();
    return items;
  }

  visitInstruction(instruction: nodes.InstructionNode): ValidatorItem[] {
    this.pushNode(instruction);
    const items: ValidatorItem[] = [];
    if (!instruction.name) {
      items.push(this.error(instruction, 'Instruction has no name'));
    }
    items.push(...this.checkNameConflict(instruction, instruction.name));

    items.push(...instruction.args.accept(this));
    this.popNode();
    return items;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorItem[] {
    this.pushNode(definedType);
    const items: ValidatorItem[] = [];
    if (!definedType.name) {
      items.push(this.error(definedType, 'Defined type has no name'));
    }
    items.push(...this.checkNameConflict(definedType, definedType.name));

    items.push(...definedType.type.accept(this));
    this.popNode();
    return items;
  }

  visitError(error: nodes.ErrorNode): ValidatorItem[] {
    this.pushNode(error);
    const items: ValidatorItem[] = [];
    if (!error.name) {
      items.push(this.error(error, 'Error has no name'));
    }
    if (typeof error.code !== 'number') {
      items.push(this.error(error, 'Error has no code'));
    }
    if (!error.message) {
      items.push(this.warn(error, 'Error has no message'));
    }

    const programPrefix = pascalCase(this.program?.metadata.prefix ?? '');
    const prefixedErrorName = `${programPrefix + pascalCase(error.name)}Error`;
    items.push(...this.checkNameConflict(error, prefixedErrorName));

    this.popNode();
    return items;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): ValidatorItem[] {
    this.pushNode(typeArray);
    const items = typeArray.itemType.accept(this);
    this.popNode();
    return items;
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): ValidatorItem[] {
    this.pushNode(typeDefinedLink);
    const items: ValidatorItem[] = [];
    if (!typeDefinedLink.definedType) {
      items.push(
        this.error(typeDefinedLink, 'Pointing to a defined type with no name')
      );
    } else if (!this.definedTypes.has(typeDefinedLink.definedType)) {
      items.push(
        this.error(
          typeDefinedLink,
          `Pointing to a missing defined type named "${typeDefinedLink.definedType}"`
        )
      );
    }
    this.popNode();
    return items;
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): ValidatorItem[] {
    this.pushNode(typeEnum);

    const items: ValidatorItem[] = [];
    if (!typeEnum.name) {
      items.push(this.info(typeEnum, 'Enum has no name'));
    }
    if (typeEnum.variants.length === 0) {
      items.push(this.warn(typeEnum, 'Enum has no variants'));
    }
    typeEnum.variants.forEach((variant) => {
      if (!variant.name) {
        items.push(this.error(typeEnum, 'Enum variant has no name'));
      }
    });

    items.push(
      ...typeEnum.variants.flatMap((variant) => {
        if (variant.kind === 'empty') return [];
        return variant.type.accept(this);
      })
    );
    this.popNode();
    return items;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): ValidatorItem[] {
    return [];
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): ValidatorItem[] {
    this.pushNode(typeMap);
    const items = [
      ...typeMap.keyType.accept(this),
      ...typeMap.valueType.accept(this),
    ];
    this.popNode();
    return items;
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): ValidatorItem[] {
    this.pushNode(typeOption);
    const items = typeOption.type.accept(this);
    this.popNode();
    return items;
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): ValidatorItem[] {
    this.pushNode(typeSet);
    const items = typeSet.type.accept(this);
    this.popNode();
    return items;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): ValidatorItem[] {
    this.pushNode(typeStruct);
    const items: ValidatorItem[] = [];
    if (!typeStruct.name) {
      items.push(this.info(typeStruct, 'Struct has no name'));
    }
    typeStruct.fields.forEach((field) => {
      if (!field.name) {
        items.push(this.error(typeStruct, 'Struct field has no name'));
      }
    });

    items.push(
      ...typeStruct.fields.flatMap((field) => field.type.accept(this))
    );
    this.popNode();
    return items;
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): ValidatorItem[] {
    this.pushNode(typeTuple);
    const items: ValidatorItem[] = [];
    if (typeTuple.itemTypes.length === 0) {
      items.push(this.warn(typeTuple, 'Tuple has no items'));
    }
    items.push(...typeTuple.itemTypes.flatMap((node) => node.accept(this)));
    this.popNode();
    return items;
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): ValidatorItem[] {
    this.pushNode(typeVec);
    const items = typeVec.itemType.accept(this);
    this.popNode();
    return items;
  }

  protected checkNameConflict(node: nodes.Node, name: string): ValidatorItem[] {
    if (!name) return [];
    const conflict = this.nameConflict(node, name);
    if (conflict) return [conflict];
    this.exportedNames.set(name, this.stack.clone());
    return [];
  }

  protected nameConflict(node: nodes.Node, name: string): ValidatorItem | null {
    if (!this.exportedNames.has(name)) return null;
    const conflictingStack = this.exportedNames.get(name) as NodeStack;
    const message = `Exported name "${name}" conflicts with the following node "${conflictingStack.toString()}"`;
    return this.item('error', node, message);
  }

  protected error(node: nodes.Node, message: string): ValidatorItem {
    return this.item('error', node, message);
  }

  protected warn(node: nodes.Node, message: string): ValidatorItem {
    return this.item('warn', node, message);
  }

  protected info(node: nodes.Node, message: string): ValidatorItem {
    return this.item('info', node, message);
  }

  protected trace(node: nodes.Node, message: string): ValidatorItem {
    return this.item('trace', node, message);
  }

  protected debug(node: nodes.Node, message: string): ValidatorItem {
    return this.item('debug', node, message);
  }

  protected item(
    level: LogLevel,
    node: nodes.Node,
    message: string
  ): ValidatorItem {
    return { message, level, node, stack: this.stack.clone() };
  }

  protected pushNode(node: nodes.Node): void {
    this.stack.push(node);
    if (nodes.isProgramNode(node)) {
      this.program = node;
    }
  }

  protected popNode(): nodes.Node | undefined {
    const node = this.stack.pop();
    if (node && nodes.isProgramNode(node)) {
      this.program = null;
    }
    return node;
  }
}
