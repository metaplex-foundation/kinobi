import chalk from 'chalk';
import { RegisteredNodes } from '../nodes';
import { Visitor } from './visitor';
import { mapVisitor } from './mapVisitor';
import { LogLevel, ValidatorBag, getLevelIndex } from '../shared';

export function throwValidatorItemsVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  visitor: Visitor<ValidatorBag, TNodeKeys>,
  throwLevel: LogLevel = 'error'
): Visitor<void, TNodeKeys> {
  // eslint-disable-next-line no-console
  return mapVisitor(visitor, (validatorBag) => {
    const bag = validatorBag.orderByLevel();
    bag.log();

    const levelHistogram = bag.items.reduce((acc, item) => {
      acc[item.level] = (acc[item.level] ?? 0) + 1;
      return acc;
    }, {} as Record<LogLevel, number>);
    const maxLevel = Object.keys(levelHistogram)
      .map((level) => getLevelIndex(level as LogLevel))
      .sort((a, b) => b - a)[0];

    if (maxLevel >= getLevelIndex(throwLevel)) {
      const histogramString = Object.keys(levelHistogram)
        .map((level) => `${level}s: ${levelHistogram[level as LogLevel]}`)
        .join(', ');
      // eslint-disable-next-line no-console
      console.log(
        `${chalk.red(`Failed to validate the nodes.`)} ` +
          `${chalk.red.bold(`Found ${histogramString}.`)}\n`
      );
      process.exit(1);
    }
  });
}
