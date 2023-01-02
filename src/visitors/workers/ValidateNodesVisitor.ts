/* eslint-disable no-console */
import chalk from 'chalk';
import * as nodes from '../../nodes';
import { GetValidatorItemsVisitor, ValidatorItem } from '../aggregators';
import { BaseThrowVisitor } from '../BaseThrowVisitor';

type Level = ValidatorItem['level'];

const LEVEL_PRIORITY: Record<Level, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

export class ValidateNodesVisitor extends BaseThrowVisitor<nodes.RootNode> {
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
      console.log(
        `${chalk.red(`Failed to validate the nodes.`)} ` +
          `${chalk.red.bold(`Found ${histogramString}.`)}\n`
      );
      process.exit(1);
    }

    return root;
  }

  protected logItem(item: ValidatorItem) {
    const stack = chalk.dim(`\n|> Stack: ${item.stack.join(' > ')}.`);

    switch (item.level) {
      case 'error':
        console.log(
          `${
            chalk.bgRed.black(' Error ') +
            chalk.red(` ${item.message}.`) +
            stack
          }\n`
        );
        break;
      case 'warning':
        console.log(
          `${
            chalk.bgYellow.black(' Warning ') +
            chalk.yellow(` ${item.message}.`) +
            stack
          }\n`
        );
        break;
      case 'info':
      default:
        console.log(
          `${
            chalk.bgBlue.black(' Info ') +
            chalk.blue(` ${item.message}.`) +
            stack
          }\n`
        );
        break;
    }
  }
}
