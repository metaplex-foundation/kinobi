/* eslint-disable no-console */
import chalk from 'chalk';
import {
  getLevelIndex,
  logDebug,
  logError,
  logInfo,
  LogLevel,
  logTrace,
  logWarn,
} from '../../logs';
import { ValidatorItem } from '../aggregators';
import { BaseDelegateVisitor } from '../BaseDelegateVisitor';
import { Visitor } from '../Visitor';

export class ThrowValidatorItemsVisitor extends BaseDelegateVisitor<
  ValidatorItem[],
  void
> {
  constructor(
    validator: Visitor<ValidatorItem[]>,
    readonly throwLevel: LogLevel = 'error'
  ) {
    super(validator);
  }

  map(items: ValidatorItem[]): void {
    const validatorItems = items.sort(
      (a, b) => getLevelIndex(b.level) - getLevelIndex(a.level)
    );

    validatorItems.forEach((item) => this.logItem(item));

    const levelHistogram = validatorItems.reduce((acc, item) => {
      acc[item.level] = (acc[item.level] ?? 0) + 1;
      return acc;
    }, {} as Record<LogLevel, number>);
    const maxLevel = Object.keys(levelHistogram)
      .map((level) => getLevelIndex(level as LogLevel))
      .sort((a, b) => b - a)[0];

    if (maxLevel >= getLevelIndex(this.throwLevel)) {
      const histogramString = Object.keys(levelHistogram)
        .map((level) => `${level}s: ${levelHistogram[level as LogLevel]}`)
        .join(', ');
      console.log(
        `${chalk.red(`Failed to validate the nodes.`)} ` +
          `${chalk.red.bold(`Found ${histogramString}.`)}\n`
      );
      process.exit(1);
    }
  }

  protected logItem(item: ValidatorItem) {
    const hint = `Stack: ${item.stack.join(' > ')}.`;

    switch (item.level) {
      case 'error':
        logError(item.message, hint);
        break;
      case 'warn':
        logWarn(item.message, hint);
        break;
      case 'info':
        logInfo(item.message, hint);
        break;
      case 'trace':
        logTrace(item.message, hint);
        break;
      case 'debug':
      default:
        logDebug(item.message, undefined, hint);
        break;
    }
  }
}
