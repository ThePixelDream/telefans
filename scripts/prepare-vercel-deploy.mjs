import fs from 'fs';
import path from 'path';

const siteDir = path.resolve('www.telescope.me');
const binaryExt = new Set(['.woff2', '.png', '.ico', '.gif', '.jpg', '.jpeg', '.webp']);

function walk(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, rel));
    else files.push(rel.replace(/\\/g, '/'));
  }
  return files;
}

const files = walk(siteDir).map((file) => {
  const full = path.join(siteDir, file);
  const ext = path.extname(file).toLowerCase();
  const binary = binaryExt.has(ext);
  const data = fs.readFileSync(full);
  return {
    file,
    data: binary ? data.toString('base64') : data.toString('utf8'),
    encoding: binary ? 'base64' : 'utf-8',
  };
});

fs.writeFileSync('vercel-deploy-files.json', JSON.stringify(files));
console.log(`Prepared ${files.length} files`);
