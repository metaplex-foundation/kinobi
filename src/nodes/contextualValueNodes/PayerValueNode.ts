export interface PayerValueNode {
  readonly kind: 'payerValueNode';
}

export function payerValueNode(): PayerValueNode {
  return { kind: 'payerValueNode' };
}
