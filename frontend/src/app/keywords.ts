export interface KeywordInfo {
  keyword: string;
  category: "Fashion" | "F&B";
}

/**
 * 31 Kata kunci resmi yang tersedia dalam dataset Rintis AI.
 */
export const AVAILABLE_KEYWORDS: KeywordInfo[] = [
  // Fashion (13 keywords)
  { keyword: "baju batik", category: "Fashion" },
  { keyword: "baju muslim", category: "Fashion" },
  { keyword: "celana pria", category: "Fashion" },
  { keyword: "celana wanita", category: "Fashion" },
  { keyword: "dress wanita", category: "Fashion" },
  { keyword: "hijab", category: "Fashion" },
  { keyword: "hoodie", category: "Fashion" },
  { keyword: "jaket", category: "Fashion" },
  { keyword: "kaos pria", category: "Fashion" },
  { keyword: "kaos wanita", category: "Fashion" },
  { keyword: "kemeja pria", category: "Fashion" },
  { keyword: "kemeja wanita", category: "Fashion" },
  { keyword: "sneakers", category: "Fashion" },

  // F&B (18 keywords)
  { keyword: "biskuit", category: "F&B" },
  { keyword: "bumbu instan", category: "F&B" },
  { keyword: "coklat", category: "F&B" },
  { keyword: "cookies", category: "F&B" },
  { keyword: "frozen food", category: "F&B" },
  { keyword: "keripik", category: "F&B" },
  { keyword: "kopi", category: "F&B" },
  { keyword: "makanan instan", category: "F&B" },
  { keyword: "matcha", category: "F&B" },
  { keyword: "minuman buah", category: "F&B" },
  { keyword: "minuman herbal", category: "F&B" },
  { keyword: "minuman ringan", category: "F&B" },
  { keyword: "minuman serbuk", category: "F&B" },
  { keyword: "permen", category: "F&B" },
  { keyword: "sambal", category: "F&B" },
  { keyword: "snack", category: "F&B" },
  { keyword: "susu", category: "F&B" },
  { keyword: "teh", category: "F&B" },
];

export const KEYWORD_NAMES = AVAILABLE_KEYWORDS.map((k) => k.keyword);

/**
 * Validasi dan pencocokan kata kunci input terhadap data.
 * Mengembalikan nama keyword data yang valid atau null jika tidak ditemukan.
 */
export function findMatchingKeyword(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  if (!normalized) return null;

  // 1. Exact match
  const exact = KEYWORD_NAMES.find((k) => k === normalized);
  if (exact) return exact;

  // 2. Substring match
  const sub = KEYWORD_NAMES.find(
    (k) => k.includes(normalized) || normalized.includes(k)
  );
  if (sub) return sub;

  // 3. Word boundary / partial matching
  const parts = normalized.split(/\s+/).filter((p) => p.length >= 3);
  for (const part of parts) {
    const matched = KEYWORD_NAMES.find((k) => k.includes(part));
    if (matched) return matched;
  }

  return null;
}

/**
 * Filter kata kunci untuk dropdown autocomplete
 */
export function filterKeywords(query: string, maxResults = 8): KeywordInfo[] {
  const q = query.toLowerCase().trim();
  if (!q) return AVAILABLE_KEYWORDS.slice(0, maxResults);
  return AVAILABLE_KEYWORDS.filter(
    (item) =>
      item.keyword.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  ).slice(0, maxResults);
}
