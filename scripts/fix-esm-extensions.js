// Post-build fixer for strict Node ESM support.
// - Renames esm files from .js to .mjs
// - Rewrites relative import/export specifiers to include explicit extensions
//   and use .mjs (including directory index resolution)
const fs = require('fs');
const path = require('path');

const esmRoot = path.resolve(__dirname, '..', 'esm');

/** @param {string} p */
function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/** @param {string} dir */
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  /** @type {string[]} */
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function ensureRelativeWithExt(spec, fromFile) {
  if (!spec.startsWith('./') && !spec.startsWith('../')) return spec; // external
  // Normalize and resolve target on disk relative to fromFile
  const fromDir = path.dirname(fromFile);
  const raw = path.resolve(fromDir, spec);

  // If spec already has an extension, normalize to .mjs when it points into esm
  if (/\.(js|mjs|cjs)$/.test(spec)) {
    // Convert .js to .mjs for intra-esm imports
    return spec.replace(/\.js$/i, '.mjs');
  }

  // Try file.mjs
  if (fs.existsSync(raw + '.mjs')) {
    return spec + '.mjs';
  }
  // Try file.js (before rename step) or when resolving precomputed graph
  if (fs.existsSync(raw + '.js')) {
    return spec + '.mjs';
  }
  // Try directory index
  if (isDir(raw)) {
    if (fs.existsSync(path.join(raw, 'index.mjs'))) {
      return spec.replace(/\/?$/, '/') + 'index.mjs';
    }
    if (fs.existsSync(path.join(raw, 'index.js'))) {
      return spec.replace(/\/?$/, '/') + 'index.mjs';
    }
  }
  // Fallback: append .mjs
  return spec + '.mjs';
}

function rewriteFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  // import ... from '...';  export ... from '...';  dynamic import('...')
  code = code.replace(/(import\s+[^'"()]+?from\s*["'])([^"']+)(["'])/g, (m, a, s, b) => a + ensureRelativeWithExt(s, file) + b);
  code = code.replace(/(export\s+[^'"()]+?from\s*["'])([^"']+)(["'])/g, (m, a, s, b) => a + ensureRelativeWithExt(s, file) + b);
  code = code.replace(/(import\s*\(\s*["'])([^"']+)(["']\s*\))/g, (m, a, s, b) => a + ensureRelativeWithExt(s, file) + b);
  fs.writeFileSync(file, code);
}

function main() {
  if (!fs.existsSync(esmRoot)) return;
  // First rename all .js files to .mjs to ensure ESM mode regardless of package type
  const files = walk(esmRoot).filter((f) => f.endsWith('.js'));
  // Rename leaf files first to avoid conflicts
  for (const f of files.sort((a, b) => b.length - a.length)) {
    fs.renameSync(f, f.slice(0, -3) + '.mjs');
  }
  // Now rewrite imports in all .mjs files
  const mjsFiles = walk(esmRoot).filter((f) => f.endsWith('.mjs'));
  for (const f of mjsFiles) rewriteFile(f);
}

main();
