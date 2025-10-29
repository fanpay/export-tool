// Excel cell text limit is 32767 characters. Provide helpers to sanitize cell values.
export function truncateCellText(value: any, max = 32767): any {
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

export function sanitizeRowValues(row: any[], max = 32767): any[] {
  return row.map(cell => truncateCellText(cell, max));
}

export function sanitizeRows(rows: any[], max = 32767): any[] {
  return rows.map((row) => Array.isArray(row) ? sanitizeRowValues(row, max) : row);
}
