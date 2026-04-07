import fs from 'node:fs/promises';
import path from 'node:path';

export function getBaseGeoDir(outputDir: string, subdomain: string, baseGeo: string): string {
  return baseGeo ? path.join(outputDir, subdomain, baseGeo) : path.join(outputDir, subdomain);
}

export function getBaseGeoExtractDir(outputDir: string, subdomain: string, baseGeo: string): string {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), '_extract');
}

export function getBaseGeoRegionsFile(outputDir: string, subdomain: string, baseGeo: string): string {
  return path.join(getBaseGeoExtractDir(outputDir, subdomain, baseGeo), 'regions.html');
}

export function getExtendedGeoDir(outputDir: string, subdomain: string, baseGeo: string, extendedGeo: string): string {
  return path.join(getBaseGeoExtractDir(outputDir, subdomain, baseGeo), 'extended', extendedGeo);
}

export function getBaseGeoDataFile(outputDir: string, subdomain: string, baseGeo: string): string {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap.json');
}

export function getBaseGeoHtmlFile(outputDir: string, subdomain: string, baseGeo: string): string {
  return path.join(getBaseGeoDir(outputDir, subdomain, baseGeo), 'sitemap.html');
}

export function getSubdomainManifestJsonFile(outputDir: string, subdomain: string): string {
  return path.join(outputDir, subdomain, 'manifest.json');
}

export function getSubdomainManifestCsvFile(outputDir: string, subdomain: string): string {
  return path.join(outputDir, subdomain, 'manifest.csv');
}

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function writeText(filePath: string, text: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, text, 'utf8');
}
