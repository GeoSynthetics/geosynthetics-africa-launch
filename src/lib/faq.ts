export interface FaqEntry {
  question: string;
  answer: string;
}

/** Plain text for JSON-LD: drops any HTML tags and collapses whitespace. */
function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Keeps only entries with both a question and an answer, as plain text. */
export function cleanFaqEntries(items: FaqEntry[] | null | undefined): FaqEntry[] {
  return (items || [])
    .map((item) => ({
      question: toPlainText(String(item?.question ?? "")),
      answer: toPlainText(String(item?.answer ?? "")),
    }))
    .filter((item) => item.question && item.answer);
}
