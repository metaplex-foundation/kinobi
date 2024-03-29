import { KinobiError } from './errors';
import { createFile } from './utils';

export class RenderMap {
  protected readonly _map: Map<string, string> = new Map();

  add(relativePath: string, code: string): RenderMap {
    this._map.set(relativePath, code);
    return this;
  }

  remove(relativePath: string): RenderMap {
    this._map.delete(relativePath);
    return this;
  }

  mergeWith(...others: RenderMap[]): RenderMap {
    others.forEach((other) => {
      other._map.forEach((code, relativePath) => {
        this.add(relativePath, code);
      });
    });
    return this;
  }

  isEmpty(): boolean {
    return this._map.size === 0;
  }

  has(key: string): boolean {
    return this._map.has(key);
  }

  get(key: string): string {
    const value = this.safeGet(key);
    if (value === undefined) {
      throw new KinobiError(`Cannot find key "${key}" in RenderMap.`);
    }
    return value;
  }

  safeGet(key: string): string | undefined {
    return this._map.get(key);
  }

  contains(key: string, value: string | RegExp): boolean {
    const content = this.get(key);
    return typeof value === 'string'
      ? content.includes(value)
      : value.test(content);
  }

  write(path: string): void {
    this._map.forEach((code, relativePath) => {
      createFile(`${path}/${relativePath}`, code);
    });
  }
}
