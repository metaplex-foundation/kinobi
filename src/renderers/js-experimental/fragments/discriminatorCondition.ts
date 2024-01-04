import {
  isNode,
  type ByteDiscriminatorNode,
  type DiscriminatorNode,
  type FieldDiscriminatorNode,
  type ProgramNode,
  type SizeDiscriminatorNode,
  type StructTypeNode,
} from '../../../nodes';
import { InvalidKinobiTreeError } from '../../../shared';
import { visit } from '../../../visitors';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, mergeFragments } from './common';

/**
 * ```
 * if (data.length === 72) {
 *   return splTokenAccounts.TOKEN;
 * }
 *
 * if (memcmp(data, getU32Encoder().encode(42), offset)) {
 *   return splTokenAccounts.TOKEN;
 * }
 *
 * if (memcmp(data, new Uint8Array([1, 2, 3]), offset)) {
 *   return splTokenAccounts.TOKEN;
 * }
 * ```
 */
export function getDiscriminatorConditionFragment(
  scope: Pick<
    GlobalFragmentScope,
    'nameApi' | 'typeManifestVisitor' | 'valueNodeVisitor'
  > & {
    programNode: ProgramNode;
    discriminators: DiscriminatorNode[];
    struct: StructTypeNode;
    dataName: string;
    ifTrue: string;
  }
): Fragment {
  return mergeFragments(
    scope.discriminators.flatMap((discriminator) => {
      if (isNode(discriminator, 'sizeDiscriminatorNode')) {
        return [getSizeConditionFragment(discriminator, scope.dataName)];
      }
      if (isNode(discriminator, 'byteDiscriminatorNode')) {
        return [getByteConditionFragment(discriminator, scope.dataName)];
      }
      if (isNode(discriminator, 'fieldDiscriminatorNode')) {
        return [getFieldConditionFragment(discriminator, scope)];
      }
      return [];
    }),
    (r) => r.join(' && ')
  ).mapRender((r) => `if (${r}) { ${scope.ifTrue}; }`);
}

function getSizeConditionFragment(
  discriminator: SizeDiscriminatorNode,
  dataName: string
): Fragment {
  return fragment(`${dataName}.length === ${discriminator.size}`);
}

function getByteConditionFragment(
  discriminator: ByteDiscriminatorNode,
  dataName: string
): Fragment {
  const bytes = discriminator.bytes.join(', ');
  return fragment(
    `memcmp(${dataName}, new Uint8Array(${bytes}), ${discriminator.offset})`
  ).addImports('shared', 'memcmp');
}

function getFieldConditionFragment(
  discriminator: FieldDiscriminatorNode,
  scope: Pick<
    GlobalFragmentScope,
    'typeManifestVisitor' | 'valueNodeVisitor'
  > & { dataName: string; struct: StructTypeNode }
): Fragment {
  const field = scope.struct.fields.find((f) => f.name === discriminator.name);
  if (!field || !field.defaultValue) {
    throw new InvalidKinobiTreeError(
      `Field discriminator "${discriminator.name}" does not have a matching argument with default value.`
    );
  }
  return mergeFragments(
    [
      visit(field.type, scope.typeManifestVisitor).encoder,
      visit(field.defaultValue, scope.valueNodeVisitor),
    ],
    ([encoderFunction, value]) => `${encoderFunction}.encode(${value})`
  )
    .mapRender(
      (r) => `memcmp(${scope.dataName}, ${r}, ${discriminator.offset})`
    )
    .addImports('shared', 'memcmp');
}
