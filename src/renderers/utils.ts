import fs from 'fs';

export function createDirectory(path: string): void {
  fs.mkdirSync(path, { recursive: true });
}

export function createFile(path: string, content: string): void {
  const directory = path.substring(0, path.lastIndexOf('/'));
  if (!fs.existsSync(directory)) {
    createDirectory(directory);
  }
  fs.writeFileSync(path, content);
}
