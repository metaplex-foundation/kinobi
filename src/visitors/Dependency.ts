/**
 * Tells Kinobi where a dependency is located.
 * This could be a recognized dependency, or any other string
 * as long as renderers know how to map them into real libraries.
 */
export type Dependency =
  | RelativeDependecy
  | 'core'
  | 'mplEssentials'
  | 'mplDigitalAssets'
  | string;

/**
 * Tells Kinobi where a local dependency is located.
 * - `generated` means the dependency is located in the `generated` folder.
 * - `root` means the dependency is located in the source folder, outside of the `generated` folder.
 *
 * These can be interpreted by renderers as they see fit as different languages
 * have different ways of importing local files.
 */
export type RelativeDependecy = 'generated' | 'root';
