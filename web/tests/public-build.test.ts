import { expect, it } from 'vitest';
import { mkdtempSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

it('regenerating policies preserves published website analytics and mobile retention disclosures', () => {
  const root = new URL('../../', import.meta.url);
  const temporary = mkdtempSync(join(tmpdir(), 'beanywhere-policy-build-'));
  try {
    for (const file of ['generate.mjs', 'legal-data.mjs', 'public-pages.js', 'usage-settings.css'])
      copyFileSync(new URL(file, root), join(temporary, file));
    execFileSync(process.execPath, ['generate.mjs'], { cwd: temporary, stdio: 'pipe' });
    for (const file of ['privacy.html', 'terms.html'])
      expect(readFileSync(join(temporary, file), 'utf8')).toBe(readFileSync(new URL(file, root), 'utf8'));
    const privacy = readFileSync(join(temporary, 'privacy.html'), 'utf8');
    expect(privacy).toContain('Mobile usage analytics:');
    expect(privacy).toContain('Website usage measurement');
    expect(privacy).toContain('without a scheduled expiration');
    expect(privacy).toContain('unverified and does not merge accounts');
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});
