import { MainCaseString, mainCase } from '../../shared/utils';

export interface PublicKeyValueNode {
  readonly kind: 'publicKeyValueNode';

  // Data.
  readonly publicKey: string;
  readonly identifier?: MainCaseString;
}

export function publicKeyValueNode(
  publicKey: string,
  identifier?: string
): PublicKeyValueNode {
  return {
    kind: 'publicKeyValueNode',
    publicKey,
    identifier: identifier ? mainCase(identifier) : undefined,
  };
}
