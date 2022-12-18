import * as nodes from '../nodes';
import { Visitor } from './Visitor';

export type DefinedTypeHistogram = {
  [key: string]: number;
};

export class GetDefinedTypeHistogramVisitor
  implements Visitor<DefinedTypeHistogram>
{
  visitRoot(root: nodes.RootNode): DefinedTypeHistogram {
    return this.mergeHistograms([
      ...root.accounts.map((account) => account.accept(this)),
      ...root.instructions.map((instruction) => instruction.accept(this)),
      ...root.definedTypes.map((type) => type.accept(this)),
    ]);
  }

  visitAccount(account: nodes.AccountNode): DefinedTypeHistogram {
    return account.type.accept(this);
  }

  visitInstruction(instruction: nodes.InstructionNode): DefinedTypeHistogram {
    return this.mergeHistograms([
      ...instruction.args.map((arg) => arg.type.accept(this)),
      ...(instruction.discriminator
        ? [instruction.discriminator.type.accept(this)]
        : []),
    ]);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): DefinedTypeHistogram {
    return definedType.type.accept(this);
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): DefinedTypeHistogram {
    return typeArray.itemType.accept(this);
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode,
  ): DefinedTypeHistogram {
    return { [typeDefinedLink.definedType]: 1 };
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): DefinedTypeHistogram {
    return this.mergeHistograms(
      typeEnum.variants.map((variant) => {
        if (variant.kind === 'struct') {
          return variant.type.accept(this);
        }
        if (variant.kind === 'tuple') {
          return this.mergeHistograms(
            variant.fields.map((field) => field.accept(this)),
          );
        }
        return {};
      }),
    );
  }

  visitTypeLeaf(): DefinedTypeHistogram {
    return {};
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): DefinedTypeHistogram {
    return this.mergeHistograms([
      typeMap.keyType.accept(this),
      typeMap.valueType.accept(this),
    ]);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): DefinedTypeHistogram {
    return typeOption.type.accept(this);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): DefinedTypeHistogram {
    return typeSet.type.accept(this);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): DefinedTypeHistogram {
    return this.mergeHistograms(
      typeStruct.fields.map((field) => field.type.accept(this)),
    );
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): DefinedTypeHistogram {
    return this.mergeHistograms(
      typeTuple.itemTypes.map((type) => type.accept(this)),
    );
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): DefinedTypeHistogram {
    return typeVec.itemType.accept(this);
  }

  protected mergeHistograms(
    histograms: DefinedTypeHistogram[],
  ): DefinedTypeHistogram {
    const result: DefinedTypeHistogram = {};

    histograms.forEach((histogram) => {
      Object.keys(histogram).forEach((key) => {
        if (result[key] === undefined) {
          result[key] = histogram[key];
        } else {
          result[key] += histogram[key];
        }
      });
    });

    return result;
  }
}
