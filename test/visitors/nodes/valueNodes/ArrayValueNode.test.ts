import test from 'ava';
import { arrayValueNode, publicKeyValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = arrayValueNode([
  publicKeyValueNode('8jeCDm1zPb68kfzv5MaUo9BK7beGzFrGHA9hhMGL1ay1'),
  publicKeyValueNode('8PEBfDem8yb5aUkrhKgNKMraB9gR8WtJDprEW3QwLFz'),
  publicKeyValueNode('97hChLjFswwqBrE82Q4wqctpFfB2jZ91svxCv68iCrqG'),
]);

test(mergeVisitorMacro, node, 4);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[arrayValueNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyValueNode]', {
  ...node,
  items: [],
});
test(
  getDebugStringVisitorMacro,
  node,
  `
arrayValueNode
|   publicKeyValueNode [8jeCDm1zPb68kfzv5MaUo9BK7beGzFrGHA9hhMGL1ay1]
|   publicKeyValueNode [8PEBfDem8yb5aUkrhKgNKMraB9gR8WtJDprEW3QwLFz]
|   publicKeyValueNode [97hChLjFswwqBrE82Q4wqctpFfB2jZ91svxCv68iCrqG]`
);
