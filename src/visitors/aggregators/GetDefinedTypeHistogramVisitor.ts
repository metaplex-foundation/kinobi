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
      root.programs.map((program) => visit(program, this))
    );
  }

  visitProgram(program: nodes.ProgramNode): DefinedTypeHistogram {
    return this.mergeHistograms([
      ...program.accounts.map((account) => visit(account, this)),
      ...program.instructions.map((instruction) => visit(instruction, this)),
      ...program.definedTypes.map((type) => visit(type, this)),
    ]);
  }

  visitAccount(account: nodes.AccountNode): DefinedTypeHistogram {
    this.mode = 'account';
    this.stackLevel = 0;
    const histogram = visit(account.type, this);
    this.mode = null;
    return histogram;
  }

  visitInstruction(instruction: nodes.InstructionNode): DefinedTypeHistogram {
    this.mode = 'instruction';
    this.stackLevel = 0;
    const histogram = visit(instruction.args, this);
    this.mode = null;
    const subHistograms = instruction.subInstructions.map((ix) =>
      visit(ix, this)
    );
    return this.mergeHistograms([histogram, ...subHistograms]);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): DefinedTypeHistogram {
    this.mode = 'definedType';
    this.stackLevel = 0;
    const histogram = visit(definedType.type, this);
    this.mode = null;
    return histogram;
  }

  visitError(): DefinedTypeHistogram {
    return {};
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(typeArray.item, this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.LinkTypeNode
  ): DefinedTypeHistogram {
    if (typeDefinedLink.importFrom !== 'generated') {
      return {};
    }

    return {
      [typeDefinedLink.name]: {
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

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      typeEnum.variants.map((variant) => visit(variant, this))
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeEnumEmptyVariant(): DefinedTypeHistogram {
    return {};
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(typeEnumStructVariant.struct, this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(typeEnumTupleVariant.tuple, this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms([
      visit(typeMap.key, this),
      visit(typeMap.value, this),
    ]);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(typeOption.item, this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(typeSet.item, this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      typeStruct.fields.map((field) => visit(field, this))
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeStructField(
    typeStructField: nodes.StructFieldTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(typeStructField.type, this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      typeTuple.items.map((item) => visit(item, this))
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypeBool(): DefinedTypeHistogram {
    return {};
  }

  visitTypeBytes(): DefinedTypeHistogram {
    return {};
  }

  visitTypeNumber(): DefinedTypeHistogram {
    return {};
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.NumberWrapperTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(typeNumberWrapper.item, this);
    this.stackLevel -= 1;
    return histogram;
  }

  visitTypePublicKey(): DefinedTypeHistogram {
    return {};
  }

  visitTypeString(): DefinedTypeHistogram {
    return {};
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
