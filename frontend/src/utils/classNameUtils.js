export function normalizeClassName(raw) {
  if (!raw) return "";

  let s = String(raw).trim();
  if (!s) return "";

  // Remove spaces and common prefixes.
  s = s.replace(/\s+/g, "");
  s = s.replace(/^(class|lop)/i, "");

  // Backward-compat: collapse duplicated grade prefix like "1010A1" -> "10A1".
  // This app targets Vietnamese high school, so grades are typically 10-12.
  const mDup = s.match(/^(\d{2})\1([A-Za-z].*)$/);
  if (mDup && ["10", "11", "12"].includes(mDup[1])) {
    s = mDup[1] + mDup[2];
  }

  // Normalize letter casing: "10a1" -> "10A1".
  const m = s.match(/^(\d+)(.*)$/);
  if (m) return m[1] + String(m[2] || "").toUpperCase();
  return s.toUpperCase();
}

