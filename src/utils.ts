export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .split(/[-_\s+.]/)
    .filter((word) => word.length > 0)
    .map(capitalize)
    .join(' ');
}

export function pascalCase(str: string): string {
  return titleCase(str).split(' ').join('');
}

export function camelCase(str: string): string {
  if (str.length === 0) return str;
  const pascalStr = pascalCase(str);
  return pascalStr.charAt(0).toLowerCase() + pascalStr.slice(1);
}

export function kebabCase(str: string): string {
  return titleCase(str).split(' ').join('-').toLowerCase();
}

export function snakeCase(str: string): string {
  return titleCase(str).split(' ').join('_').toLowerCase();
}
