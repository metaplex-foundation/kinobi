import * as nodes from '../nodes';
import { BaseRootVisitor } from './BaseRootVisitor';
import {
  GetValidatorItemsVisitor,
  ValidatorItem,
} from './GetValidatorItemsVisitor';

type Level = ValidatorItem['level'];

const LEVEL_PRIORITY: Record<Level, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

export class ValidateNodesVisitor extends BaseRootVisitor {
  constructor(readonly throwLevel: Level = 'error') {
    super();
  }

  visitRoot(root: nodes.RootNode): nodes.RootNode {
    const validatorItems = root
      .accept(new GetValidatorItemsVisitor())
      .sort((a, b) => LEVEL_PRIORITY[a.level] - LEVEL_PRIORITY[b.level]);

    validatorItems.forEach((item) => this.logItem(item));

    const levelHistogram = validatorItems.reduce((acc, item) => {
      acc[item.level] = (acc[item.level] ?? 0) + 1;
      return acc;
    }, {} as Record<Level, number>);
    const maxLevel = Object.keys(levelHistogram)
      .map((level) => LEVEL_PRIORITY[level as Level])
      .sort((a, b) => b - a)[0];

    if (maxLevel >= LEVEL_PRIORITY[this.throwLevel]) {
      const histogramString = Object.keys(levelHistogram)
        .map((level) => `${level}s: ${levelHistogram[level as Level]}`)
        .join(', ');
      throw new Error(
        `Failed to validate the nodes. Found ${histogramString}.`
      );
    }

    return root;
  }

  protected logItem(item: ValidatorItem) {
    const stack = `${item.stack.join(' > ')}`;

    const message = `${item.message}.\n|> Stack: ${stack}.`;

    switch (item.level) {
      case 'error':
        console.error(message);
        break;
      case 'warning':
        console.warn(message);
        break;
      case 'info':
      default:
        console.log(message);
        break;
    }
  }
}
