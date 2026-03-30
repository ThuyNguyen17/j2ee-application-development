package com.example.project_management_class.application.util;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class ClassNameUtils {
    private ClassNameUtils() {}

    // Capture the canonical class key at the start of the string (e.g. "10a2" from "10a2-2025" or "10a2(hk2)").
    // Format: 1-2 digits (grade) + letters + optional digits (section).
    private static final Pattern CANONICAL_CLASS_KEY_PREFIX = Pattern.compile("^(\\d{1,2}[a-z]+\\d*)");

    /**
     * Normalize a class name to a comparable key (lowercase, no spaces, no leading "class"/"lop" prefixes).
     * Examples:
     * - "10A1" -> "10a1"
     * - "class10A1" -> "10a1"
     * - "Lop 10A1" -> "10a1"
     */
    public static String normalizeToKey(String raw) {
        if (raw == null) return "";
        String s = raw.trim();
        if (s.isEmpty()) return "";

        // Collapse whitespace and lowercase for comparison.
        s = s.replaceAll("\\s+", "");
        s = s.toLowerCase(Locale.ROOT);

        // Strip common prefixes if present.
        if (s.startsWith("class")) s = s.substring("class".length());
        if (s.startsWith("lop")) s = s.substring("lop".length());

        // If still starts with non-digit characters, drop until a digit to support inputs like "lop10a1".
        int i = 0;
        while (i < s.length() && !Character.isDigit(s.charAt(i))) {
            i++;
        }
        if (i > 0 && i < s.length()) {
            s = s.substring(i);
        }

        // Trim trailing decorations like "-2025", "(hk2)", etc by extracting the canonical prefix if present.
        Matcher m = CANONICAL_CLASS_KEY_PREFIX.matcher(s);
        if (m.find()) {
            s = m.group(1);
        }

        // Backward-compat:
        // Some seeded/demo data ends up with duplicated grade prefix, e.g. "1010A1", "1111A2", "1212B3".
        // In this system, grade is typically 10-12 (Vietnamese high school), so collapse "1010a1" -> "10a1".
        s = collapseDuplicatedHighSchoolGradePrefix(s);
        return s;
    }

    private static String collapseDuplicatedHighSchoolGradePrefix(String key) {
        if (key == null) return "";
        String s = key.trim();
        if (s.length() < 4) return s;

        String g2 = s.substring(0, 2);
        boolean isHighSchool = "10".equals(g2) || "11".equals(g2) || "12".equals(g2);
        if (!isHighSchool) return s;

        String doubled = g2 + g2;
        if (!s.startsWith(doubled)) return s;

        // Only collapse when the remaining part looks like the class suffix (non-digit start),
        // so we don't accidentally rewrite unrelated numeric codes.
        String rest = s.substring(4);
        if (rest.isEmpty()) return s;
        if (Character.isDigit(rest.charAt(0))) return s;

        return g2 + rest;
    }

    public static Integer parseGradeLevel(String classKey) {
        if (classKey == null) return null;
        String s = classKey.trim();
        if (s.isEmpty()) return null;

        int i = 0;
        while (i < s.length() && Character.isDigit(s.charAt(i))) {
            i++;
        }
        if (i == 0) return null;
        try {
            return Integer.parseInt(s.substring(0, i));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static String parseClassSimpleName(String classKey) {
        if (classKey == null) return "";
        String s = classKey.trim();
        if (s.isEmpty()) return "";
        int i = 0;
        while (i < s.length() && Character.isDigit(s.charAt(i))) {
            i++;
        }
        if (i >= s.length()) return "";
        return s.substring(i);
    }

    /**
     * Format a display class name from an arbitrary raw label such as:
     * - "10A1" -> "10A1"
     * - "1010A1" -> "10A1" (duplicated grade prefix)
     * - "Lop 10a1" -> "10A1"
     */
    public static String formatDisplayClassName(String raw) {
        if (raw == null) return "";
        String key = normalizeToKey(raw);
        if (key.isBlank()) return raw.trim();

        Integer g = parseGradeLevel(key);
        String simple = parseClassSimpleName(key);
        if (g == null || simple.isBlank()) {
            return raw.trim().replaceAll("\\s+", "");
        }
        return g + simple.toUpperCase(Locale.ROOT);
    }

    /**
     * Format a display class name from grade + className fragment (or even a full label).
     * This is safe against inputs where className already contains the grade (e.g. "10A1").
     */
    public static String formatDisplayClassName(Integer gradeLevel, String className) {
        if (gradeLevel == null) {
            return formatDisplayClassName(className);
        }
        String part = className == null ? "" : className.trim();
        String combined = String.valueOf(gradeLevel) + part;
        return formatDisplayClassName(combined);
    }
}
