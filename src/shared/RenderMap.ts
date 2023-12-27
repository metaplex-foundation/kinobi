import { createFile } from '../renderers/utils';

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

  write(path: string): void {
    this._map.forEach((code, relativePath) => {
      createFile(`${path}/${relativePath}`, code);
    });
  }
}
