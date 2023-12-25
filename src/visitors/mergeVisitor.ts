import * as nodes from '../nodes';
import { Visitor, visit as baseVisit } from './Visitor';
import { staticVisitor } from './staticVisitor';

export type MergeVisitorInterceptor<TReturn> = <TNode extends nodes.Node>(
  fn: (node: TNode) => TReturn
) => (node: TNode) => TReturn;

export function mergeVisitor<
  TReturn,
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  leafValue: (node: nodes.Node) => TReturn,
  merge: (node: nodes.Node, values: TReturn[]) => TReturn,
  options: {
    intercept?: MergeVisitorInterceptor<TReturn>;
    nextVisitor?: Visitor<TReturn, TNodeKeys>;
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<TReturn, TNodeKeys> {
  const intercept = options.intercept ?? ((fn) => fn);
  const nodesKeys: (keyof nodes.RegisteredNodes)[] =
    options.nodeKeys ?? nodes.REGISTERED_NODES_KEYS;
  const visitor = staticVisitor(
    intercept((node) => leafValue(node)),
    nodesKeys
  ) as Visitor<TReturn>;
  const nextVisitor = (options.nextVisitor ?? visitor) as Visitor<TReturn>;
  const visit = (node: nodes.Node): TReturn[] =>
    nodesKeys.includes(node.kind) ? [baseVisit(node, nextVisitor)] : [];

  if (nodesKeys.includes('rootNode')) {
    visitor.visitRoot = intercept((node) =>
      merge(node, node.programs.flatMap(visit))
    );
  }

  if (nodesKeys.includes('programNode')) {
    visitor.visitProgram = intercept((node) =>
      merge(node, [
        ...node.accounts.flatMap(visit),
        ...node.instructions.flatMap(visit),
        ...node.definedTypes.flatMap(visit),
        ...node.errors.flatMap(visit),
      ])
    );
  }

  if (nodesKeys.includes('accountNode')) {
    visitor.visitAccount = intercept((node) =>
      merge(node, [
        ...visit(node.data),
        ...node.seeds.flatMap((seed) => {
          if (seed.kind !== 'variable') return [];
          return visit(seed.type);
        }),
      ])
    );
  }

  if (nodesKeys.includes('accountDataNode')) {
    visitor.visitAccountData = intercept((node) =>
      merge(node, [
        ...visit(node.struct),
        ...(node.link ? visit(node.link) : []),
      ])
    );
  }

  if (nodesKeys.includes('instructionNode')) {
    visitor.visitInstruction = intercept((node) =>
      merge(node, [
        ...node.accounts.flatMap(visit),
        ...visit(node.dataArgs),
        ...visit(node.extraArgs),
        ...node.subInstructions.flatMap(visit),
      ])
    );
  }

  if (nodesKeys.includes('instructionDataArgsNode')) {
    visitor.visitInstructionDataArgs = intercept((node) =>
      merge(node, [
        ...visit(node.struct),
        ...(node.link ? visit(node.link) : []),
      ])
    );
  }

  if (nodesKeys.includes('instructionExtraArgsNode')) {
    visitor.visitInstructionExtraArgs = intercept((node) =>
      merge(node, [
        ...visit(node.struct),
        ...(node.link ? visit(node.link) : []),
      ])
    );
  }

  if (nodesKeys.includes('definedTypeNode')) {
    visitor.visitDefinedType = intercept((node) =>
      merge(node, visit(node.data))
    );
  }

  if (nodesKeys.includes('arrayTypeNode')) {
    visitor.visitArrayType = intercept((node) =>
      merge(node, visit(node.child))
    );
  }

  if (nodesKeys.includes('enumTypeNode')) {
    visitor.visitEnumType = intercept((node) =>
      merge(node, node.variants.flatMap(visit))
    );
  }

  if (nodesKeys.includes('enumStructVariantTypeNode')) {
    visitor.visitEnumStructVariantType = intercept((node) =>
      merge(node, visit(node.struct))
    );
  }

  if (nodesKeys.includes('enumTupleVariantTypeNode')) {
    visitor.visitEnumTupleVariantType = intercept((node) =>
      merge(node, visit(node.tuple))
    );
  }

  if (nodesKeys.includes('mapTypeNode')) {
    visitor.visitMapType = intercept((node) =>
      merge(node, [...visit(node.key), ...visit(node.value)])
    );
  }

  if (nodesKeys.includes('optionTypeNode')) {
    visitor.visitOptionType = intercept((node) =>
      merge(node, visit(node.child))
    );
  }

  if (nodesKeys.includes('setTypeNode')) {
    visitor.visitSetType = intercept((node) => merge(node, visit(node.child)));
  }

  if (nodesKeys.includes('structTypeNode')) {
    visitor.visitStructType = intercept((node) =>
      merge(node, node.fields.flatMap(visit))
    );
  }

  if (nodesKeys.includes('structFieldTypeNode')) {
    visitor.visitStructFieldType = intercept((node) =>
      merge(node, visit(node.child))
    );
  }

  if (nodesKeys.includes('tupleTypeNode')) {
    visitor.visitTupleType = intercept((node) =>
      merge(node, node.children.flatMap(visit))
    );
  }

  if (nodesKeys.includes('amountTypeNode')) {
    visitor.visitAmountType = intercept((node) =>
      merge(node, visit(node.number))
    );
  }

  if (nodesKeys.includes('dateTimeTypeNode')) {
    visitor.visitAmountType = intercept((node) =>
      merge(node, visit(node.number))
    );
  }

  if (nodesKeys.includes('solAmountTypeNode')) {
    visitor.visitAmountType = intercept((node) =>
      merge(node, visit(node.number))
    );
  }

  return visitor as Visitor<TReturn, TNodeKeys>;
}
