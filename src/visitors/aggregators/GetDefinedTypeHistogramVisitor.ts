import { MainCaseString } from 'src/shared';
import * as nodes from '../../nodes';
import { Visitor, visit } from '../Visitor';

export type DefinedTypeHistogram = {
  [key: MainCaseString]: {
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
      root.programs.map((program) =>
        visit(program, this as Visitor<DefinedTypeHistogram>)
      )
    );
  }

  visitProgram(program: nodes.ProgramNode): DefinedTypeHistogram {
    return this.mergeHistograms([
      ...program.accounts.map((account) =>
        visit(account, this as Visitor<DefinedTypeHistogram>)
      ),
      ...program.instructions.map((instruction) =>
        visit(instruction, this as Visitor<DefinedTypeHistogram>)
      ),
      ...program.definedTypes.map((type) =>
        visit(type, this as Visitor<DefinedTypeHistogram>)
      ),
    ]);
  }

  visitAccount(account: nodes.AccountNode): DefinedTypeHistogram {
    this.mode = 'account';
    this.stackLevel = 0;
    const histogram = visit(
      account.data,
      this as Visitor<DefinedTypeHistogram>
    );
    this.mode = null;
    return histogram;
  }

  visitAccountData(accountData: nodes.AccountDataNode): DefinedTypeHistogram {
    return visit(accountData.struct, this as Visitor<DefinedTypeHistogram>);
  }

  visitInstruction(instruction: nodes.InstructionNode): DefinedTypeHistogram {
    this.mode = 'instruction';
    this.stackLevel = 0;
    const dataHistogram = visit(
      instruction.dataArgs,
      this as Visitor<DefinedTypeHistogram>
    );
    const extraHistogram = visit(
      instruction.extraArgs,
      this as Visitor<DefinedTypeHistogram>
    );
    this.mode = null;
    const subHistograms = instruction.subInstructions.map((ix) =>
      visit(ix, this as Visitor<DefinedTypeHistogram>)
    );
    return this.mergeHistograms([
      dataHistogram,
      extraHistogram,
      ...subHistograms,
    ]);
  }

  visitInstructionAccount(): DefinedTypeHistogram {
    return {};
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): DefinedTypeHistogram {
    return visit(
      instructionDataArgs.struct,
      this as Visitor<DefinedTypeHistogram>
    );
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): DefinedTypeHistogram {
    return visit(
      instructionExtraArgs.struct,
      this as Visitor<DefinedTypeHistogram>
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): DefinedTypeHistogram {
    this.mode = 'definedType';
    this.stackLevel = 0;
    const histogram = visit(
      definedType.data,
      this as Visitor<DefinedTypeHistogram>
    );
    this.mode = null;
    return histogram;
  }

  visitError(): DefinedTypeHistogram {
    return {};
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      arrayType.child,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitLinkType(linkType: nodes.LinkTypeNode): DefinedTypeHistogram {
    if (linkType.importFrom !== 'generated') {
      return {};
    }

    return {
      [linkType.name]: {
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

  visitEnumType(enumType: nodes.EnumTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      enumType.variants.map((variant) =>
        visit(variant, this as Visitor<DefinedTypeHistogram>)
      )
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitEnumEmptyVariantType(): DefinedTypeHistogram {
    return {};
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      enumStructVariantType.struct,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      enumTupleVariantType.tuple,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitMapType(mapType: nodes.MapTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms([
      visit(mapType.key, this as Visitor<DefinedTypeHistogram>),
      visit(mapType.value, this as Visitor<DefinedTypeHistogram>),
    ]);
    this.stackLevel -= 1;
    return histogram;
  }

  visitOptionType(optionType: nodes.OptionTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      optionType.child,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitSetType(setType: nodes.SetTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      setType.child,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitStructType(structType: nodes.StructTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      structType.fields.map((field) =>
        visit(field, this as Visitor<DefinedTypeHistogram>)
      )
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      structFieldType.child,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = this.mergeHistograms(
      tupleType.children.map((child) =>
        visit(child, this as Visitor<DefinedTypeHistogram>)
      )
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitBoolType(): DefinedTypeHistogram {
    return {};
  }

  visitBytesType(): DefinedTypeHistogram {
    return {};
  }

  visitNumberType(): DefinedTypeHistogram {
    return {};
  }

  visitAmountType(amountType: nodes.AmountTypeNode): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      amountType.number,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitDateTimeType(
    dateTimeType: nodes.DateTimeTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      dateTimeType.number,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitSolAmountType(
    solAmountType: nodes.SolAmountTypeNode
  ): DefinedTypeHistogram {
    this.stackLevel += 1;
    const histogram = visit(
      solAmountType.number,
      this as Visitor<DefinedTypeHistogram>
    );
    this.stackLevel -= 1;
    return histogram;
  }

  visitPublicKeyType(): DefinedTypeHistogram {
    return {};
  }

  visitStringType(): DefinedTypeHistogram {
    return {};
  }

  protected mergeHistograms(
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
}
