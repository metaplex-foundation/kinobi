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

  private definedTypes = new Set<string>();

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

    // Register defined types to make sure links are valid.
    program.definedTypes.forEach((type) => this.definedTypes.add(type.name));

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
      account.name ? `Account: ${account.name}` : 'Unnamed Account'
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
    this.stack.push(
      instruction.name
        ? `Instruction: ${instruction.name}`
        : 'Unnamed Instruction'
    );

    const items: ValidatorItem[] = [];
    if (!instruction.name) {
      items.push(this.error(instruction, 'Instruction has no name'));
    } else {
      const checkNameConflict = (name: string) => {
        items.push(...this.checkNameConflict(instruction, name));
      };
      checkNameConflict(instruction.name);
      checkNameConflict(`${instruction.name}InstructionAccounts`);
      checkNameConflict(`${instruction.name}InstructionArgs`);
      checkNameConflict(`${instruction.name}InstructionDiscriminator`);
    }

    items.push(...instruction.args.accept(this));
    items.push(...(instruction.discriminator?.type.accept(this) ?? []));
    this.stack.pop();
    return items;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorItem[] {
    this.stack.push(
      definedType.name
        ? `Defined Type: ${definedType.name}`
        : 'Unnamed Defined Type'
    );

    const items: ValidatorItem[] = [];
    if (!definedType.name) {
      items.push(this.error(definedType, 'Defined type has no name'));
    }
    items.push(...this.checkNameConflict(definedType, definedType.name));

    items.push(...definedType.type.accept(this));
    this.stack.pop();
    return items;
  }

  visitError(error: nodes.ErrorNode): ValidatorItem[] {
    this.stack.push(error.name ? `Error: ${error.name}` : 'Unnamed Error');

    const items: ValidatorItem[] = [];
    if (!error.name) {
      items.push(this.error(error, 'Error has no name'));
    }
    if (typeof error.code !== 'number') {
      items.push(this.error(error, 'Error has no code'));
    }
    if (!error.message) {
      items.push(this.warning(error, 'Error has no message'));
    }
    items.push(...this.checkNameConflict(error, `${error.name}Error`));

    this.stack.pop();
    return items;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): ValidatorItem[] {
    this.stack.push('Array');
    const items = typeArray.itemType.accept(this);
    this.stack.pop();
    return items;
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): ValidatorItem[] {
    this.stack.push('Defined Link');
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
    this.stack.pop();
    return items;
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): ValidatorItem[] {
    this.stack.push(typeEnum.name ? `Enum: ${typeEnum.name}` : 'Enum');

    const items: ValidatorItem[] = [];
    if (!typeEnum.name) {
      items.push(this.info(typeEnum, 'Enum has no name'));
    }
    if (typeEnum.variants.length === 0) {
      items.push(this.warning(typeEnum, 'Enum has no variants'));
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
    this.stack.pop();
    return items;
  }

  visitTypeLeaf(): ValidatorItem[] {
    return [];
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): ValidatorItem[] {
    this.stack.push('Map');
    const items = [
      ...typeMap.keyType.accept(this),
      ...typeMap.valueType.accept(this),
    ];
    this.stack.pop();
    return items;
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): ValidatorItem[] {
    this.stack.push('Option');
    const items = typeOption.type.accept(this);
    this.stack.pop();
    return items;
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): ValidatorItem[] {
    this.stack.push('Set');
    const items = typeSet.type.accept(this);
    this.stack.pop();
    return items;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): ValidatorItem[] {
    this.stack.push(typeStruct.name ? `Struct: ${typeStruct.name}` : 'Struct');
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
    this.stack.pop();
    return items;
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): ValidatorItem[] {
    this.stack.push('Tuple');
    const items: ValidatorItem[] = [];
    if (typeTuple.itemTypes.length === 0) {
      items.push(this.warning(typeTuple, 'Tuple has no items'));
    }
    items.push(...typeTuple.itemTypes.flatMap((node) => node.accept(this)));
    this.stack.pop();
    return items;
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): ValidatorItem[] {
    this.stack.push('Vec');
    const items = typeVec.itemType.accept(this);
    this.stack.pop();
    return items;
  }

  protected checkNameConflict(node: nodes.Node, name: string): ValidatorItem[] {
    if (!name) return [];
    const conflict = this.nameConflict(node, name);
    if (conflict) return [conflict];
    this.exportedNames.set(name, [...this.stack]);
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
