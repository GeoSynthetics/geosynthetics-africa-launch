import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import type { FaqEntry } from "@/lib/faq";

interface FaqAccordionProps {
  items: FaqEntry[];
  /** Optional content before each question (e.g. a number). */
  renderPrefix?: (index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
  /** Emit FAQPage JSON-LD for these items (default true; once per page). */
  withSchema?: boolean;
}

/**
 * FAQ list built on native <details>/<summary>.
 *
 * Unlike the Radix accordion, closed answers stay in the server-rendered HTML,
 * so search engines and AI crawlers (which mostly don't run JavaScript) can
 * read every answer. Works without JavaScript and is keyboard accessible.
 */
export function FaqAccordion({
  items,
  renderPrefix,
  className,
  itemClassName,
  questionClassName,
  answerClassName,
  withSchema = true,
}: FaqAccordionProps) {
  if (!items || items.length === 0) return null;

  return (
    <>
      {withSchema && <FAQPageSchema items={items} />}
      <div className={cn("w-full", className)}>
        {items.map((faq, i) => (
          <details key={i} className={cn("group", itemClassName)}>
            <summary
              className={cn(
                "flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-medium [&::-webkit-details-marker]:hidden",
                questionClassName,
              )}
            >
              <span className="flex items-center gap-3">
                {renderPrefix?.(i)}
                {faq.question}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className={cn("pb-4 pt-0 text-sm", answerClassName)}>{faq.answer}</div>
          </details>
        ))}
      </div>
    </>
  );
}
