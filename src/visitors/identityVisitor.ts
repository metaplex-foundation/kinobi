import * as nodes from '../nodes';
import { AccountSeed } from '../shared';
import { Visitor, visit } from './Visitor';
import { staticVisitor } from './staticVisitor';

export function identityVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  options: {
    wrap?: <TNode extends nodes.Node>(
      fn: (node: TNode) => nodes.Node | null
    ) => (node: TNode) => nodes.Node | null;
    nextVisitor?: Visitor<nodes.Node | null, TNodeKeys>;
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<nodes.Node | null, TNodeKeys> {
  const wrap = options.wrap ?? ((fn) => fn);
  const nodesKeys: (keyof nodes.RegisteredNodes)[] =
    options.nodeKeys ?? nodes.REGISTERED_NODES_KEYS;
  const visitor = staticVisitor(
    wrap((node) => node),
    nodesKeys
  ) as Visitor<nodes.Node | null>;
  const nextVisitor = (options.nextVisitor ??
    visitor) as Visitor<nodes.Node | null>;
  const safeVisit = (node: nodes.Node): nodes.Node | null =>
    nodesKeys.includes(node.kind) ? visit(node, nextVisitor) : node;

  if (nodesKeys.includes('rootNode')) {
    visitor.visitRoot = wrap((node) =>
      nodes.rootNode(
        node.programs
          .map((program) => safeVisit(program))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertProgramNode))
      )
    );
  }

  if (nodesKeys.includes('programNode')) {
    visitor.visitProgram = wrap((node) =>
      nodes.programNode({
        ...node,
        accounts: node.accounts
          .map((account) => safeVisit(account))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertAccountNode)),
        instructions: node.instructions
          .map((instruction) => safeVisit(instruction))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
          ),
        definedTypes: node.definedTypes
          .map((type) => safeVisit(type))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertDefinedTypeNode)
          ),
        errors: node.errors
          .map((error) => safeVisit(error))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertErrorNode)),
      })
    );
  }

  if (nodesKeys.includes('accountNode')) {
    visitor.visitAccount = wrap((node) => {
      const data = safeVisit(node.data);
      if (data === null) return null;
      nodes.assertAccountDataNode(data);
      const seeds = node.seeds
        .map((seed) => {
          if (seed.kind !== 'variable') return seed;
          const newType = safeVisit(seed.type);
          if (newType === null) return null;
          nodes.assertTypeNode(newType);
          return { ...seed, type: newType };
        })
        .filter((s): s is AccountSeed => s !== null);
      return nodes.accountNode({ ...node, data, seeds });
    });
  }

  if (nodesKeys.includes('accountDataNode')) {
    visitor.visitAccountData = wrap((node) => {
      const struct = safeVisit(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? safeVisit(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.accountDataNode({ ...node, struct, link });
    });
  }

  if (nodesKeys.includes('instructionNode')) {
    visitor.visitInstruction = wrap((node) => {
      const dataArgs = safeVisit(node.dataArgs);
      nodes.assertInstructionDataArgsNode(dataArgs);
      const extraArgs = safeVisit(node.extraArgs);
      nodes.assertInstructionExtraArgsNode(extraArgs);
      return nodes.instructionNode({
        ...node,
        dataArgs,
        extraArgs,
        accounts: node.accounts
          .map((account) => safeVisit(account))
          .filter(
            nodes.removeNullAndAssertNodeFilter(
              nodes.assertInstructionAccountNode
            )
          ),
        subInstructions: node.subInstructions
          .map((ix) => safeVisit(ix))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
          ),
      });
    });
  }

  if (nodesKeys.includes('instructionDataArgsNode')) {
    visitor.visitInstructionDataArgs = wrap((node) => {
      const struct = safeVisit(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? safeVisit(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.instructionDataArgsNode({ ...node, struct, link });
    });
  }

  if (nodesKeys.includes('instructionExtraArgsNode')) {
    visitor.visitInstructionExtraArgs = wrap((node) => {
      const struct = safeVisit(node.struct);
      if (struct === null) return null;
      nodes.assertStructTypeNode(struct);
      const link = node.link ? safeVisit(node.link) : undefined;
      if (link !== undefined) nodes.assertLinkTypeNode(link);
      return nodes.instructionExtraArgsNode({ ...node, struct, link });
    });
  }

  if (nodesKeys.includes('definedTypeNode')) {
    visitor.visitDefinedType = wrap((node) => {
      const data = safeVisit(node.data);
      if (data === null) return null;
      nodes.assertTypeNode(data);
      return nodes.definedTypeNode({ ...node, data });
    });
  }

  if (nodesKeys.includes('arrayTypeNode')) {
    visitor.visitArrayType = wrap((node) => {
      const child = safeVisit(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.arrayTypeNode(child, { ...node });
    });
  }

  if (nodesKeys.includes('enumTypeNode')) {
    visitor.visitEnumType = wrap((node) =>
      nodes.enumTypeNode(
        node.variants
          .map((variant) => safeVisit(variant))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertEnumVariantTypeNode)
          ),
        { ...node }
      )
    );
  }

  if (nodesKeys.includes('enumStructVariantTypeNode')) {
    visitor.visitEnumStructVariantType = wrap((node) => {
      const newStruct = safeVisit(node.struct);
      if (!newStruct) return null;
      nodes.assertStructTypeNode(newStruct);
      return nodes.enumStructVariantTypeNode(node.name, newStruct);
    });
  }

  if (nodesKeys.includes('enumTupleVariantTypeNode')) {
    visitor.visitEnumTupleVariantType = wrap((node) => {
      const newTuple = safeVisit(node.tuple);
      if (!newTuple) return null;
      nodes.assertTupleTypeNode(newTuple);
      return nodes.enumTupleVariantTypeNode(node.name, newTuple);
    });
  }

  if (nodesKeys.includes('mapTypeNode')) {
    visitor.visitMapType = wrap((node) => {
      const key = safeVisit(node.key);
      const value = safeVisit(node.value);
      if (key === null || value === null) return null;
      nodes.assertTypeNode(key);
      nodes.assertTypeNode(value);
      return nodes.mapTypeNode(key, value, { ...node });
    });
  }

  if (nodesKeys.includes('optionTypeNode')) {
    visitor.visitOptionType = wrap((node) => {
      const child = safeVisit(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.optionTypeNode(child, { ...node });
    });
  }

  if (nodesKeys.includes('setTypeNode')) {
    visitor.visitSetType = wrap((node) => {
      const child = safeVisit(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.setTypeNode(child, { ...node });
    });
  }

  if (nodesKeys.includes('structTypeNode')) {
    visitor.visitStructType = wrap((node) =>
      nodes.structTypeNode(
        node.fields
          .map((field) => safeVisit(field))
          .filter(
            nodes.removeNullAndAssertNodeFilter(nodes.assertStructFieldTypeNode)
          )
      )
    );
  }

  if (nodesKeys.includes('structFieldTypeNode')) {
    visitor.visitStructFieldType = wrap((node) => {
      const child = safeVisit(node.child);
      if (child === null) return null;
      nodes.assertTypeNode(child);
      return nodes.structFieldTypeNode({ ...node, child });
    });
  }

  if (nodesKeys.includes('tupleTypeNode')) {
    visitor.visitTupleType = wrap((node) =>
      nodes.tupleTypeNode(
        node.children
          .map((child) => safeVisit(child))
          .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertTypeNode))
      )
    );
  }

  if (nodesKeys.includes('amountTypeNode')) {
    visitor.visitAmountType = wrap((node) => {
      const number = safeVisit(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.amountTypeNode(number, node.identifier, node.decimals);
    });
  }

  if (nodesKeys.includes('dateTimeTypeNode')) {
    visitor.visitDateTimeType = wrap((node) => {
      const number = safeVisit(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.dateTimeTypeNode(number);
    });
  }

  if (nodesKeys.includes('solAmountTypeNode')) {
    visitor.visitSolAmountType = wrap((node) => {
      const number = safeVisit(node.number);
      if (number === null) return null;
      nodes.assertNumberTypeNode(number);
      return nodes.solAmountTypeNode(number);
    });
  }

  return visitor as Visitor<nodes.Node, TNodeKeys>;
}
