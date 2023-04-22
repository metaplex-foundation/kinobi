import * as nodes from '../../nodes';
import { GetByteSizeVisitor } from '../aggregators';
import { Visitor } from '../Visitor';
import { TransformNodesVisitor } from './TransformNodesVisitor';

// TODO: Use in JS visitor instead.
export class AutoSetAccountGpaFieldsVisitor extends TransformNodesVisitor {
  readonly override: boolean;

  readonly sizeVisitor: Visitor<number | null> & {
    registerDefinedTypes?: (definedTypes: nodes.DefinedTypeNode[]) => void;
  };

  constructor(
    options: {
      override?: boolean;
      sizeVisitor?: AutoSetAccountGpaFieldsVisitor['sizeVisitor'];
    } = {}
  ) {
    super([
      {
        selector: { kind: 'accountNode' },
        transformer: (node) => {
          nodes.assertAccountNode(node);
          if (!this.override && node.gpaFields.length > 0) return node;
          if (nodes.isLinkTypeNode(node.type)) return node;

          let offset: number | null = 0;
          const gpaFields = node.type.fields.map(
            (field): nodes.AccountNodeGpaField => {
              const fieldOffset = offset;
              if (offset !== null) {
                const newOffset = visit(field.type, this.sizeVisitor);
                offset = newOffset !== null ? offset + newOffset : null;
              }
              return {
                name: field.name,
                offset: fieldOffset,
                type: field.type,
              };
            }
          );

          return nodes.accountNode({ ...node.metadata, gpaFields }, node.type);
        },
      },
    ]);
    this.override = options.override ?? false;
    this.sizeVisitor = options.sizeVisitor ?? new GetByteSizeVisitor();
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    if (this.sizeVisitor.registerDefinedTypes) {
      this.sizeVisitor.registerDefinedTypes(root.allDefinedTypes);
    }

    return super.visitRoot(root);
  }
}
