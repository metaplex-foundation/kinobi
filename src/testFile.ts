/* eslint-disable no-console */
import type { Idl } from './idl';
import idl from './idl.json';
import { Solita } from './Solita';
import { PrintVisitor, TransformU8ArraysToBytesVisitor } from './visitors';

const solita = new Solita(idl as Partial<Idl>);
solita.accept(new PrintVisitor());

const solitaWithBytes = solita.accept(new TransformU8ArraysToBytesVisitor());
solitaWithBytes.accept(new PrintVisitor());
