import test from "ava";
import {
  instructionAccountNode,
  instructionNode,
  programNode,
  visit,
} from "../../../src";
import { getRenderMapVisitor } from "../../../src/renderers/js-experimental/getRenderMapVisitor";
import { renderMapContains } from "./_setup";

test("it renders a parse function with correct default type params", (t) => {
  // Given the following program with 1 instruction, with 1 account for the instruction
  const node = programNode({
    name: "myProgram",
    publicKey: "1111",
    instructions: [
      instructionNode({
        name: "foo",
        accounts: [
          instructionAccountNode({
            name: "bar",
            isWritable: false,
            isSigner: false,
          }),
        ],
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following parse function type
  renderMapContains(t, renderMap, "instructions/foo.ts", [
    "export function parseFooInstruction<",
    "TProgram extends string = '1111'",
    "TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[]",
    ">",
  ]);
});
