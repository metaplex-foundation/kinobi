import { MainCaseString } from '../shared';
import { Visitor, visit } from './visitor';
import { MergeVisitorInterceptor, mergeVisitor } from './mergeVisitor';

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
  const intercept: MergeVisitorInterceptor<DefinedTypeHistogram> =
    (fn) => (node) => {
      stackLevel += 1;
      const newNode = fn(node);
      stackLevel -= 1;
      return newNode;
    };
  const visitor = mergeVisitor(
    () => ({} as DefinedTypeHistogram),
    (_, histograms) => mergeHistograms(histograms),
    { intercept }
  );

  visitor.visitAccount = (node) => {
    mode = 'account';
    stackLevel = 0;
    const histogram = visit(node.data, visitor);
    mode = null;
    return histogram;
  };

  visitor.visitInstruction = (node) => {
    mode = 'instruction';
    stackLevel = 0;
    const dataHistogram = visit(node.dataArgs, visitor);
    const extraHistogram = visit(node.extraArgs, visitor);
    mode = null;
    const subHistograms = node.subInstructions.map((ix) => visit(ix, visitor));
    return mergeHistograms([dataHistogram, extraHistogram, ...subHistograms]);
  };

  visitor.visitDefinedType = (node) => {
    mode = 'definedType';
    stackLevel = 0;
    const histogram = visit(node.data, visitor);
    mode = null;
    return histogram;
  };

  visitor.visitLinkType = (node) => {
    if (node.importFrom !== 'generated') {
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
  };

  return visitor;
}
