import { KinobiError } from './errors';

/**
 * Ensures a Codama-standard root's `version` field is compatible with this
 * version of Kinobi. Kinobi's Codama loader only understands the shape of
 * major version `1` Codama roots.
 */
export function validateCodamaVersion(version?: string): void {
  const major = version
    ? Number.parseInt(version.split('.')[0] ?? '', 10)
    : NaN;
  if (Number.isNaN(major) || major !== 1) {
    throw new KinobiError(
      `Unsupported Codama IDL version [${version ?? 'undefined'}]. ` +
        'Kinobi can only load Codama-standard IDLs with a major version of 1.'
    );
  }
}
