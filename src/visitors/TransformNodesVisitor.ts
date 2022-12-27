import * as nodes from '../nodes';
import { BaseNodeVisitor } from './BaseNodeVisitor';

export type NodeTransform<T extends NodeSelector = NodeSelector> = {
  selector: T;
  transformer: (node: nodes.Node, stack: nodes.Node[]) => nodes.Node;
};

export type NodeSelector =
  | { program: string }
  | { instruction: string; program?: string }
  | { account: string; program?: string }
  | { type: string; program?: string }
  | { error: string; program?: string }
  | NodeSelectorFunction;

export type NodeSelectorFunction = (
  node: nodes.Node,
  stack: nodes.Node[]
) => boolean;

export class TransformNodesVisitor extends BaseNodeVisitor {
  readonly transforms: NodeTransform<NodeSelectorFunction>[];

  readonly stack: nodes.Node[] = [];

  constructor(transforms: NodeTransform[]) {
    super();
    this.transforms = transforms.map((transform) => ({
      ...transform,
      selector: this.parseNodeSelector(transform.selector),
    }));
  }

  visitRoot(root: nodes.RootNode): nodes.Node {
    this.stack.push(root);
    const visitedRoot = super.visitRoot(root);
    this.stack.pop();
    return this.applyTransforms(visitedRoot);
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    this.stack.push(program);
    const visitedProgram = super.visitProgram(program);
    this.stack.pop();
    return this.applyTransforms(visitedProgram);
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    this.stack.push(account);
    const visitedAccount = super.visitAccount(account);
    this.stack.pop();
    return this.applyTransforms(visitedAccount);
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    this.stack.push(instruction);
    const visitedInstruction = super.visitInstruction(instruction);
    this.stack.pop();
    return this.applyTransforms(visitedInstruction);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    this.stack.push(definedType);
    const visitedDefinedType = super.visitDefinedType(definedType);
    this.stack.pop();
    return this.applyTransforms(visitedDefinedType);
  }

  visitError(error: nodes.ErrorNode): nodes.Node {
    this.stack.push(error);
    const visitedError = super.visitError(error);
    this.stack.pop();
    return this.applyTransforms(visitedError);
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node {
    this.stack.push(typeArray);
    const visitedTypeArray = super.visitTypeArray(typeArray);
    this.stack.pop();
    return this.applyTransforms(visitedTypeArray);
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): nodes.Node {
    this.stack.push(typeDefinedLink);
    const visitedTypeDefinedLink = super.visitTypeDefinedLink(typeDefinedLink);
    this.stack.pop();
    return this.applyTransforms(visitedTypeDefinedLink);
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): nodes.Node {
    this.stack.push(typeEnum);
    const visitedTypeEnum = super.visitTypeEnum(typeEnum);
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnum);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): nodes.Node {
    this.stack.push(typeLeaf);
    const visitedTypeLeaf = super.visitTypeLeaf(typeLeaf);
    this.stack.pop();
    return this.applyTransforms(visitedTypeLeaf);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): nodes.Node {
    this.stack.push(typeMap);
    const visitedTypeMap = super.visitTypeMap(typeMap);
    this.stack.pop();
    return this.applyTransforms(visitedTypeMap);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): nodes.Node {
    this.stack.push(typeOption);
    const visitedTypeOption = super.visitTypeOption(typeOption);
    this.stack.pop();
    return this.applyTransforms(visitedTypeOption);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): nodes.Node {
    this.stack.push(typeSet);
    const visitedTypeSet = super.visitTypeSet(typeSet);
    this.stack.pop();
    return this.applyTransforms(visitedTypeSet);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): nodes.Node {
    this.stack.push(typeStruct);
    const visitedTypeStruct = super.visitTypeStruct(typeStruct);
    this.stack.pop();
    return this.applyTransforms(visitedTypeStruct);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): nodes.Node {
    this.stack.push(typeTuple);
    const visitedTypeTuple = super.visitTypeTuple(typeTuple);
    this.stack.pop();
    return this.applyTransforms(visitedTypeTuple);
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): nodes.Node {
    this.stack.push(typeVec);
    const visitedTypeVec = super.visitTypeVec(typeVec);
    this.stack.pop();
    return this.applyTransforms(visitedTypeVec);
  }

  protected parseNodeSelector(selector: NodeSelector): NodeSelectorFunction {
    if (typeof selector === 'function') return selector;

    const checkParentProgram: NodeSelectorFunction = (node, stack) => {
      if ('program' in selector) {
        const program = stack.find(
          (parent): parent is nodes.ProgramNode =>
            parent.nodeClass === 'ProgramNode'
        );
        return !!(program && selector.program === program.metadata.name);
      }
      return true;
    };

    if ('instruction' in selector) {
      return (node, stack) =>
        nodes.isInstructionNode(node) &&
        node.name === selector.instruction &&
        checkParentProgram(node, stack);
    }

    if ('account' in selector) {
      return (node, stack) =>
        nodes.isAccountNode(node) &&
        node.name === selector.account &&
        checkParentProgram(node, stack);
    }

    if ('type' in selector) {
      return (node, stack) =>
        nodes.isDefinedTypeNode(node) &&
        node.name === selector.type &&
        checkParentProgram(node, stack);
    }

    if ('error' in selector) {
      return (node, stack) =>
        nodes.isErrorNode(node) &&
        node.name === selector.error &&
        checkParentProgram(node, stack);
    }

    return (node) =>
      nodes.isProgramNode(node) && node.metadata.name === selector.program;
  }

  protected applyTransforms(node: nodes.Node): nodes.Node {
    const stack = [...this.stack];
    return this.transforms
      .filter(({ selector }) => selector(node, stack))
      .reduce((acc, { transformer }) => transformer(acc, stack), node);
  }
}
