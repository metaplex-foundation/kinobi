import { MainCaseString, pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { interceptVisitor } from './interceptVisitor';
import { mergeVisitor } from './mergeVisitor';
import { Visitor, visit } from './visitor';

export type DefinedTypeHistogram = {
  [key: MainCaseString]: {
    total: number;
    inAccounts: number;
    inDefinedTypes: number;
    inInstructionArgs: number;
    directlyAsInstructionArgs: number;
  };
};

function mergeHistograms(
  histograms: DefinedTypeHistogram[]
): DefinedTypeHistogram {
  const result: DefinedTypeHistogram = {};

  histograms.forEach((histogram) => {
    Object.keys(histogram).forEach((key) => {
      const mainCaseKey = key as MainCaseString;
      if (result[mainCaseKey] === undefined) {
        result[mainCaseKey] = histogram[mainCaseKey];
      } else {
        result[mainCaseKey].total += histogram[mainCaseKey].total;
        result[mainCaseKey].inAccounts += histogram[mainCaseKey].inAccounts;
        result[mainCaseKey].inDefinedTypes +=
          histogram[mainCaseKey].inDefinedTypes;
        result[mainCaseKey].inInstructionArgs +=
          histogram[mainCaseKey].inInstructionArgs;
        result[mainCaseKey].directlyAsInstructionArgs +=
          histogram[mainCaseKey].directlyAsInstructionArgs;
      }
    });
  });

  return result;
}

export function getDefinedTypeHistogramVisitor(): Visitor<DefinedTypeHistogram> {
  let mode: 'account' | 'instruction' | 'definedType' | null = null;
  let stackLevel = 0;

  return pipe(
    mergeVisitor(
      () => ({} as DefinedTypeHistogram),
      (_, histograms) => mergeHistograms(histograms)
    ),
    (v) =>
      interceptVisitor(v, (node, next) => {
        stackLevel += 1;
        const newNode = next(node);
        stackLevel -= 1;
        return newNode;
      }),
    (v) =>
      extendVisitor(v, {
        visitAccount(node, { self }) {
          mode = 'account';
          stackLevel = 0;
          const histogram = visit(node.data, self);
          mode = null;
          return histogram;
        },

        visitInstruction(node, { self }) {
          mode = 'instruction';
          stackLevel = 0;
          const dataHistogram = visit(node.dataArgs, self);
          const extraHistogram = visit(node.extraArgs, self);
          mode = null;
          const subHistograms = node.subInstructions.map((ix) =>
            visit(ix, self)
          );
          return mergeHistograms([
            dataHistogram,
            extraHistogram,
            ...subHistograms,
          ]);
        },

        visitDefinedType(node, { self }) {
          mode = 'definedType';
          stackLevel = 0;
          const histogram = visit(node.type, self);
          mode = null;
          return histogram;
        },

        visitDefinedTypeLink(node) {
          if (node.importFrom) {
            return {};
          }

          return {
            [node.name]: {
              total: 1,
              inAccounts: Number(mode === 'account'),
              inDefinedTypes: Number(mode === 'definedType'),
              inInstructionArgs: Number(mode === 'instruction'),
              directlyAsInstructionArgs: Number(
                mode === 'instruction' && stackLevel <= 3
              ),
            },
          };
        },
      })
  );
}
