import * as nodes from '../nodes';
import { AccountSeed } from '../shared';
import { Visitor, visit as baseVisit } from './Visitor';
import { staticVisitor } from './staticVisitor';

export type IdentityVisitorInterceptor = <TNode extends nodes.Node>(
  fn: (node: TNode) => nodes.Node | null
) => (node: TNode) => nodes.Node | null;

export function identityVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  options: {
    intercept?: IdentityVisitorInterceptor;
    nextVisitor?: Visitor<nodes.Node | null, TNodeKeys>;
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<nodes.Node | null, TNodeKeys> {
  const intercept = options.intercept ?? ((fn) => fn);
  const nodesKeys: (keyof nodes.RegisteredNodes)[] =
    options.nodeKeys ?? nodes.REGISTERED_NODES_KEYS;
  const visitor = staticVisitor(
    intercept((node) => node),
    nodesKeys
  ) as Visitor<nodes.Node | null>;
  const nextVisitor = (options.nextVisitor ??
    visitor) as Visitor<nodes.Node | null>;
  const visit = (node: nodes.Node): nodes.Node | null =>
    nodesKeys.includes(node.kind) ? baseVisit(node, nextVisitor) : node;

  if (nodesKeys.includes('rootNode')) {
    visitor.visitRoot = intercept((node) =>
      nodes.rootNode(
        node.programs
          .map((program) => visit(program))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertProgramNode))
      )
    );
  }

  if (nodesKeys.includes('programNode')) {
    visitor.visitProgram = intercept((node) =>
      nodes.programNode({
        ...node,
        accounts: node.accounts
          .map((account) => visit(account))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertAccountNode)),
        instructions: node.instructions
          .map((instruction) => visit(instruction))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
          ),
        definedTypes: node.definedTypes
          .map((type) => visit(type))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertDefinedTypeNode)
          ),
        errors: node.errors
          .map((error) => visit(error))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertErrorNode)),
      })
    );
  }

  if (nodesKeys.includes('accountNode')) {
    visitor.visitAccount = intercept((node) => {
      const data = visit(node.data);
      if (data === null) return null;
      nodes.assertAccountDataNode(data);
      const seeds = node.seeds
        .map((seed) => {
          if (seed.kind !== 'variable') return seed;
          const newType = visit(seed.type);
          if (newType === null) return null;
          nodes.assertTypeNode(newType);
          return { ...seed, type: newType };
        })
        .filter((s): s is AccountSeed => s !== null);
      return nodes.accountNode({ ...node, data, seeds });
    });
  }

  if (nodesKeys.includes('accountDataNode')) {
    visitor.visitAccountData = intercept((node) => {
      const struct = visit(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? visit(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.accountDataNode({ ...node, struct, link });
    });
  }

  if (nodesKeys.includes('instructionNode')) {
    visitor.visitInstruction = intercept((node) => {
      const dataArgs = visit(node.dataArgs);
      nodes.assertInstructionDataArgsNode(dataArgs);
      const extraArgs = visit(node.extraArgs);
      nodes.assertInstructionExtraArgsNode(extraArgs);
      return nodes.instructionNode({
        ...node,
        dataArgs,
        extraArgs,
        accounts: node.accounts
          .map((account) => visit(account))
          .filter(
            nodes.removeNullAndAssertNodeFilter(
              nodes.assertInstructionAccountNode
            )
          ),
        subInstructions: node.subInstructions
          .map((ix) => visit(ix))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
          ),
      });
    });
  }

  if (nodesKeys.includes('instructionDataArgsNode')) {
    visitor.visitInstructionDataArgs = intercept((node) => {
      const struct = visit(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? visit(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.instructionDataArgsNode({ ...node, struct, link });
    });
  }

  if (nodesKeys.includes('instructionExtraArgsNode')) {
    visitor.visitInstructionExtraArgs = intercept((node) => {
      const struct = visit(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? visit(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.instructionExtraArgsNode({ ...node, struct, link });
    });
  }

  if (nodesKeys.includes('definedTypeNode')) {
    visitor.visitDefinedType = intercept((node) => {
      const data = visit(node.data);
      if (data === null) return null;
      nodes.assertTypeNode(data);
      return nodes.definedTypeNode({ ...node, data });
    });
  }

  if (nodesKeys.includes('arrayTypeNode')) {
    visitor.visitArrayType = intercept((node) => {
      const child = visit(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.arrayTypeNode(child, { ...node });
    });
  }

  if (nodesKeys.includes('enumTypeNode')) {
    visitor.visitEnumType = intercept((node) =>
      nodes.enumTypeNode(
        node.variants
          .map((variant) => visit(variant))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertEnumVariantTypeNode)
          ),
        { ...node }
      )
    );
  }

  if (nodesKeys.includes('enumStructVariantTypeNode')) {
    visitor.visitEnumStructVariantType = intercept((node) => {
      const newStruct = visit(node.struct);
      if (!newStruct) return null;
      nodes.assertStructTypeNode(newStruct);
      return nodes.enumStructVariantTypeNode(node.name, newStruct);
    });
  }

  if (nodesKeys.includes('enumTupleVariantTypeNode')) {
    visitor.visitEnumTupleVariantType = intercept((node) => {
      const newTuple = visit(node.tuple);
      if (!newTuple) return null;
      nodes.assertTupleTypeNode(newTuple);
      return nodes.enumTupleVariantTypeNode(node.name, newTuple);
    });
  }

  if (nodesKeys.includes('mapTypeNode')) {
    visitor.visitMapType = intercept((node) => {
      const key = visit(node.key);
      const value = visit(node.value);
      if (key === null || value === null) return null;
      nodes.assertTypeNode(key);
      nodes.assertTypeNode(value);
      return nodes.mapTypeNode(key, value, { ...node });
    });
  }

  if (nodesKeys.includes('optionTypeNode')) {
    visitor.visitOptionType = intercept((node) => {
      const child = visit(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.optionTypeNode(child, { ...node });
    });
  }

  if (nodesKeys.includes('setTypeNode')) {
    visitor.visitSetType = intercept((node) => {
      const child = visit(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.setTypeNode(child, { ...node });
    });
  }

  if (nodesKeys.includes('structTypeNode')) {
    visitor.visitStructType = intercept((node) =>
      nodes.structTypeNode(
        node.fields
          .map((field) => visit(field))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertStructFieldTypeNode)
          )
      )
    );
  }

  if (nodesKeys.includes('structFieldTypeNode')) {
    visitor.visitStructFieldType = intercept((node) => {
      const child = visit(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.structFieldTypeNode({ ...node, child });
    });
  }

  if (nodesKeys.includes('tupleTypeNode')) {
    visitor.visitTupleType = intercept((node) =>
      nodes.tupleTypeNode(
        node.children
          .map((child) => visit(child))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertTypeNode))
      )
    );
  }

  if (nodesKeys.includes('amountTypeNode')) {
    visitor.visitAmountType = intercept((node) => {
      const number = visit(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.amountTypeNode(number, node.identifier, node.decimals);
    });
  }

  if (nodesKeys.includes('dateTimeTypeNode')) {
    visitor.visitDateTimeType = intercept((node) => {
      const number = visit(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.dateTimeTypeNode(number);
    });
  }

  if (nodesKeys.includes('solAmountTypeNode')) {
    visitor.visitSolAmountType = intercept((node) => {
      const number = visit(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.solAmountTypeNode(number);
    });
  }

  return visitor as Visitor<nodes.Node, TNodeKeys>;
}
