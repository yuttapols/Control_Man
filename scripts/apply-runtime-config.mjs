import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const environment = process.argv[2];
const supportedEnvironments = new Set(['dev']);

if (!supportedEnvironments.has(environment)) {
  throw new Error(`Unsupported deployment environment: ${environment ?? ''}`);
}

const source = resolve(`deployment/config/config.${environment}.json`);
const targetDirectory = resolve('dist/control-man-portal/browser/config');
const target = resolve(targetDirectory, 'config.json');

await mkdir(targetDirectory, { recursive: true });
await copyFile(source, target);
