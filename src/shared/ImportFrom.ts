/**
 * Tells Kinobi where a dependency is located.
 * This could be a recognized dependency, or any other string
 * as long as renderers know how to map them into real libraries.
 */
export type ImportFrom = RelativeImportFrom | 'umi' | 'umiSerializers' | string;

/**
 * Tells Kinobi where a local dependency is located.
 * - `generated` means the dependency is located within the `generated` code.
 * - `hooked` means the dependency is located in the source code but outside of the `generated` code.
 *   This is typically a dedicated folder that is used internally by the auto-generated code.
 *
 * These can be interpreted by renderers as they see fit as different languages
 * have different ways of importing local files.
 */
export type RelativeImportFrom = 'generated' | 'hooked';
