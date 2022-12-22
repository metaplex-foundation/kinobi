import type { Visitor } from './Visitor';
import * as nodes from '../nodes';

export class BaseRootVisitor implements Visitor<nodes.RootNode> {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    return root;
  }

  visitProgram(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitAccount(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitInstruction(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitDefinedType(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitError(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeArray(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeDefinedLink(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeEnum(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeLeaf(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeMap(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeOption(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeSet(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeStruct(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeTuple(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }

  visitTypeVec(): nodes.RootNode {
    throw new Error('This visitor is meant to be used from the RootNode only.');
  }
}
