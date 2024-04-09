import { IdlPda } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import {
  PdaSeedNode,
  constantPdaSeedNode,
  programIdPdaSeedNode,
  variablePdaSeedNode,
} from './pdaSeedNodes';
import {
  bytesTypeNode,
  createTypeNodeFromIdl,
  stringTypeNode,
} from './typeNodes';
import {
  booleanValueNode,
  numberValueNode,
  stringValueNode,
} from './valueNodes';

export interface PdaNode<TSeeds extends PdaSeedNode[] = PdaSeedNode[]> {
  readonly kind: 'pdaNode';

  // Children.
  readonly seeds: TSeeds;

  // Data.
  readonly name: MainCaseString;
}

export function pdaNode<const TSeeds extends PdaSeedNode[]>(
  name: string,
  seeds: TSeeds
): PdaNode<TSeeds> {
  if (!name) {
    throw new InvalidKinobiTreeError('PdaNode must have a name.');
  }
  return { kind: 'pdaNode', name: mainCase(name), seeds };
}

export function pdaNodeFromIdl(idl: Partial<IdlPda>): PdaNode {
  const name = mainCase(idl.name ?? '');
  const seeds = (idl.seeds ?? []).map((seed): PdaSeedNode => {
    if (seed.kind === 'constant') {
      const type = (() => {
        if (seed.type === 'string') return stringTypeNode();
        if (seed.type === 'bytes') return bytesTypeNode();
        return createTypeNodeFromIdl(seed.type);
      })();
      const value = (() => {
        if (typeof seed.value === 'string') return stringValueNode(seed.value);
        if (typeof seed.value === 'number') return numberValueNode(seed.value);
        return booleanValueNode(seed.value);
      })();
      return constantPdaSeedNode(type, value);
    }
    if (seed.kind === 'variable') {
      return variablePdaSeedNode(
        seed.name,
        createTypeNodeFromIdl(seed.type),
        seed.description ? [seed.description] : []
      );
    }
    return programIdPdaSeedNode();
  });
  return pdaNode(name, seeds);
}
