import * as nodes from '../../nodes';
import { GetDefinedTypeHistogramVisitor } from '../aggregators';
import { BaseRootVisitor } from '../BaseRootVisitor';

export class SetMissingDefinedTypesVisitor extends BaseRootVisitor {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    const histogram = root.accept(new GetDefinedTypeHistogramVisitor());
    const availableTypes = root.allDefinedTypes.map((type) => type.name);
    const missingTypes = Object.keys(histogram).filter((name) => {
      const { total } = histogram[name];
      return total > 0 && !availableTypes.includes(name);
    });

    console.log(missingTypes);

    return root;
  }
}
