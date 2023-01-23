import * as nodes from '../../nodes';
import { BaseNodeOrNullVisitor } from '../BaseNodeOrNullVisitor';
import {
  NodeSelector,
  NodeSelectorFunction,
  toNodeSelectorFunction,
} from '../NodeSelector';
import { NodeStack } from '../NodeStack';

export type NodeTransformer<T extends nodes.Node = nodes.Node> = (
  node: T,
  stack: NodeStack,
  program: nodes.ProgramNode | null
) => T | null;

export type NodeTransform<T extends NodeSelector = NodeSelector> = {
  selector: T;
  transformer: NodeTransformer;
};

export class TransformNodesVisitor extends BaseNodeOrNullVisitor {
  readonly transforms: NodeTransform<NodeSelectorFunction>[];

  readonly stack: NodeStack = new NodeStack();

  protected program: nodes.ProgramNode | null = null;

  constructor(transforms: NodeTransform[]) {
    super();
    this.transforms = transforms.map((transform) => ({
      ...transform,
      selector: toNodeSelectorFunction(transform.selector),
    }));
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    this.stack.push(root);
    const visitedRoot = super.visitRoot(root);
    this.stack.pop();
    return this.applyTransforms(visitedRoot);
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node | null {
    this.stack.push(program);
    this.program = program;
    const visitedProgram = super.visitProgram(program);
    this.program = null;
    this.stack.pop();
    return this.applyTransforms(visitedProgram);
  }

  visitAccount(account: nodes.AccountNode): nodes.Node | null {
    this.stack.push(account);
    const visitedAccount = super.visitAccount(account);
    this.stack.pop();
    return this.applyTransforms(visitedAccount);
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node | null {
    this.stack.push(instruction);
    const visitedInstruction = super.visitInstruction(instruction);
    this.stack.pop();
    return this.applyTransforms(visitedInstruction);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node | null {
    this.stack.push(definedType);
    const visitedDefinedType = super.visitDefinedType(definedType);
    this.stack.pop();
    return this.applyTransforms(visitedDefinedType);
  }

  visitError(error: nodes.ErrorNode): nodes.Node | null {
    this.stack.push(error);
    const visitedError = super.visitError(error);
    this.stack.pop();
    return this.applyTransforms(visitedError);
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node | null {
    this.stack.push(typeArray);
    const visitedTypeArray = super.visitTypeArray(typeArray);
    this.stack.pop();
    return this.applyTransforms(visitedTypeArray);
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): nodes.Node | null {
    this.stack.push(typeDefinedLink);
    const visitedTypeDefinedLink = super.visitTypeDefinedLink(typeDefinedLink);
    this.stack.pop();
    return this.applyTransforms(visitedTypeDefinedLink);
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): nodes.Node | null {
    this.stack.push(typeEnum);
    const visitedTypeEnum = super.visitTypeEnum(typeEnum);
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnum);
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): nodes.Node | null {
    this.stack.push(typeEnumEmptyVariant);
    const visitedTypeEnumEmptyVariant = super.visitTypeEnumEmptyVariant(
      typeEnumEmptyVariant
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumEmptyVariant);
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): nodes.Node | null {
    this.stack.push(typeEnumStructVariant);
    const visitedTypeEnumStructVariant = super.visitTypeEnumStructVariant(
      typeEnumStructVariant
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumStructVariant);
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): nodes.Node | null {
    this.stack.push(typeEnumTupleVariant);
    const visitedTypeEnumTupleVariant = super.visitTypeEnumTupleVariant(
      typeEnumTupleVariant
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumTupleVariant);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): nodes.Node | null {
    this.stack.push(typeLeaf);
    const visitedTypeLeaf = super.visitTypeLeaf(typeLeaf);
    this.stack.pop();
    return this.applyTransforms(visitedTypeLeaf);
  }

  visitTypeLeafWrapper(
    typeLeafWrapper: nodes.TypeLeafWrapperNode
  ): nodes.Node | null {
    this.stack.push(typeLeafWrapper);
    const visitedTypeLeafWrapper = super.visitTypeLeafWrapper(typeLeafWrapper);
    this.stack.pop();
    return this.applyTransforms(visitedTypeLeafWrapper);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): nodes.Node | null {
    this.stack.push(typeMap);
    const visitedTypeMap = super.visitTypeMap(typeMap);
    this.stack.pop();
    return this.applyTransforms(visitedTypeMap);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): nodes.Node | null {
    this.stack.push(typeOption);
    const visitedTypeOption = super.visitTypeOption(typeOption);
    this.stack.pop();
    return this.applyTransforms(visitedTypeOption);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): nodes.Node | null {
    this.stack.push(typeSet);
    const visitedTypeSet = super.visitTypeSet(typeSet);
    this.stack.pop();
    return this.applyTransforms(visitedTypeSet);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): nodes.Node | null {
    this.stack.push(typeStruct);
    const visitedTypeStruct = super.visitTypeStruct(typeStruct);
    this.stack.pop();
    return this.applyTransforms(visitedTypeStruct);
  }

  visitTypeStructField(
    typeStructField: nodes.TypeStructFieldNode
  ): nodes.Node | null {
    this.stack.push(typeStructField);
    const visitedTypeStructField = super.visitTypeStructField(typeStructField);
    this.stack.pop();
    return this.applyTransforms(visitedTypeStructField);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): nodes.Node | null {
    this.stack.push(typeTuple);
    const visitedTypeTuple = super.visitTypeTuple(typeTuple);
    this.stack.pop();
    return this.applyTransforms(visitedTypeTuple);
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): nodes.Node | null {
    this.stack.push(typeVec);
    const visitedTypeVec = super.visitTypeVec(typeVec);
    this.stack.pop();
    return this.applyTransforms(visitedTypeVec);
  }

  protected applyTransforms(node: nodes.Node | null): nodes.Node | null {
    if (node === null) return null;
    const stack = this.stack.clone();
    const { program } = this;
    return this.transforms
      .filter(({ selector }) => selector(node, stack, program))
      .reduce(
        (acc, { transformer }) =>
          acc === null ? null : transformer(acc, stack, program),
        node as nodes.Node | null
      );
  }
}
