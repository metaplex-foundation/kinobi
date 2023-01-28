import * as nodes from '../../nodes';
import { Visitor } from '../Visitor';

export type DefinedTypeHistogram = {
  [key: string]: {
    total: number;
    inAccounts: number;
    inDefinedTypes: number;
    inInstructionArgs: number;
    directlyAsInstructionArgs: number;
  };
};

export class GetDefinedTypeHistogramVisitor
  implements Visitor<DefinedTypeHistogram>
{
  private mode: 'account' | 'instruction' | 'definedType' | null = null;

  private stackLevel = 0;

  visitRoot(root: nodes.RootNode): DefinedTypeHistogram {
    return this.mergeHistograms(
      root.programs.map((program) => program.accept(this))
    );
  }

  visitProgram(program: nodes.ProgramNode): DefinedTypeHistogram {
    return this.mergeHistograms([
      ...program.accounts.map((account) => account.accept(this)),
      ...program.instructions.map((instruction) => instruction.accept(this)),
      ...program.definedTypes.map((type) => type.accept(this)),
    ]);
  }

  visitAccount(account: nodes.AccountNode): DefinedTypeHistogram {
    this.mode = 'account';
    this.stackLevel = 0;
    const histogram = account.type.accept(this);
    this.mode = null;
    return histogram;
  }

  visitInstruction(instruction: nodes.InstructionNode): DefinedTypeHistogram {
    this.mode = 'instruction';
    this.stackLevel = 0;
    const histogram = instruction.args.accept(this);
    this.mode = null;
    const subHistograms = instruction.subInstructions.map((ix) =>
      ix.accept(this)
    );
    return this.mergeHistograms([histogram, ...subHistograms]);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): DefinedTypeHistogram {
    this.mode = 'definedType';
    this.stackLevel = 0;
    const histogram = definedType.type.accept(this);
    this.mode = null;
    return histogram;
  }

  visitError(): DefinedTypeHistogram {
    return {};
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = typeArray.itemType.accept(this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): DefinedTypeHistogram {
    return {
      [typeDefinedLink.definedType]: {
        total: 1,
        inAccounts: Number(this.mode === 'account'),
        inDefinedTypes: Number(this.mode === 'definedType'),
        inInstructionArgs: Number(this.mode === 'instruction'),
        directlyAsInstructionArgs: Number(
          this.mode === 'instruction' && this.stackLevel <= 2
        ),
      },
    };
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      typeEnum.variants.map((variant) => variant.accept(this))
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeEnumEmptyVariant(): DefinedTypeHistogram {
    return {};
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = typeEnumStructVariant.struct.accept(this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = typeEnumTupleVariant.tuple.accept(this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeLeaf(): DefinedTypeHistogram {
    return {};
  }

  visitTypeLeafWrapper(
    typeLeafWrapper: nodes.TypeLeafWrapperNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = typeLeafWrapper.leaf.accept(this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms([
      typeMap.keyType.accept(this),
      typeMap.valueType.accept(this),
    ]);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = typeOption.type.accept(this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = typeSet.type.accept(this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      typeStruct.fields.map((field) => field.accept(this))
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeStructField(
    typeStructField: nodes.TypeStructFieldNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = typeStructField.type.accept(this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      typeTuple.itemTypes.map((type) => type.accept(this))
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = typeVec.itemType.accept(this);
    this.stackLevel -= 1;
    return histogram;
  }

  protected mergeHistograms(
    histograms: DefinedTypeHistogram[]
  ): DefinedTypeHistogram {
    const result: DefinedTypeHistogram = {};

    histograms.forEach((histogram) => {
      Object.keys(histogram).forEach((key) => {
        if (result[key] === undefined) {
          result[key] = histogram[key];
        } else {
          result[key].total += histogram[key].total;
          result[key].inAccounts += histogram[key].inAccounts;
          result[key].inDefinedTypes += histogram[key].inDefinedTypes;
          result[key].inInstructionArgs += histogram[key].inInstructionArgs;
          result[key].directlyAsInstructionArgs +=
            histogram[key].directlyAsInstructionArgs;
        }
      });
    });

    return result;
  }
}
