export type RemainderSizeNode = {
  readonly kind: 'remainderSizeNode';
};

export function remainderSizeNode(): RemainderSizeNode {
  return { kind: 'remainderSizeNode' };
}
