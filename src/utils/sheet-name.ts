import type { WorkBook } from 'xlsx';

// Normalize sheet name to meet Excel constraints: max 31 chars and no invalid chars.
export function normalizeSheetName(name: string, wb: WorkBook): string {
  if (!name) name = 'Sheet';
  // Remove characters not allowed in Excel sheet names: \\ / ? * [ ] :
  let safe = name.replace(/[\\/*?:[\]]/g, '');
  // Trim whitespace
  safe = safe.trim();
  // If empty after sanitization, fallback
  if (safe.length === 0) safe = 'Sheet';

  // Max length 31
  const MAX = 31;
  if (safe.length > MAX) safe = safe.substring(0, MAX);

  const existing = wb && Array.isArray(wb.SheetNames) ? wb.SheetNames : [];
  let unique = safe;
  let counter = 1;

  // Ensure uniqueness: append " (n)" if needed, keeping within 31 chars
  while (existing.includes(unique)) {
    const suffix = ` (${counter})`;
    const maxBase = MAX - suffix.length;
    const base = safe.substring(0, Math.max(0, maxBase));
    unique = base + suffix;
    counter++;
    if (counter > 1000) break; // safety
  }

  return unique;
}
