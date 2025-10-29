// Excel cell text limit is 32767 characters. Provide helpers to sanitize cell values.
export function truncateCellText(value: unknown, max = 32767): unknown {
  // Add a suffix that indicates original length when truncating.
  // Suffix example: "... [TRUNCATED from N chars]"
  const makeSuffix = (origLen: number) => `... [TRUNCATED from ${origLen} chars]`;

  if (typeof value === 'string') {
    if (value.length > max) {
      const suffix = makeSuffix(value.length);
      const allowed = max - suffix.length;
      if (allowed > 0) {
        return value.substring(0, allowed) + suffix;
      }
      // If suffix itself is longer than max, return a trimmed suffix
      return suffix.substring(0, max);
    }
    return value;
  }

  if (Array.isArray(value)) {
    const joined = value.join(',');
    if (joined.length > max) {
      const suffix = makeSuffix(joined.length);
      const allowed = max - suffix.length;
      if (allowed > 0) {
        return joined.substring(0, allowed) + suffix;
      }
      return suffix.substring(0, max);
    }
    return joined;
  }

  return value;
}

export function sanitizeRowValues(row: unknown[], max = 32767): unknown[] {
  return row.map(cell => truncateCellText(cell, max));
}

export function sanitizeRows(rows: unknown[], max = 32767): unknown[] {
  return rows.map((row) => Array.isArray(row) ? sanitizeRowValues(row as unknown[], max) : row);
}

export function sanitizeObjectRow(obj: Record<string, unknown>, max = 32767): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = truncateCellText(v as any, max);
  }
  return out;
}
