import { Link } from "@tanstack/react-router";
import { Upload, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import { useTranslation } from "react-i18next";

export interface BoqBannerData {
  title: string;
  subtitle: string;
  paragraph: string;
  btn1Text: string;
  btn1Url: string;
  btn2Text: string;
  btn2Url: string;
}

export function BoqCtaBand({ data }: { data?: BoqBannerData }) {
  const { t } = useTranslation();
  const { open } = useQuickQuote();
  const title = data?.title ?? t("quote.submitBoq", "Submit your BOQ.");
  const subtitle = data?.subtitle ?? t("quote.getQuote", "Get a quote – not just a price.");
  const paragraph =
    data?.paragraph ??
    t(
      "quote.uploadBoqDesc",
      "Upload your BOQ or speak to our technical team for expert recommendations and support.",
    );
  const btn1Text = data?.btn1Text ?? t("nav.uploadBoq", "Upload Project BOQ");
  const btn2Text = data?.btn2Text ?? t("nav.quickContact", "Quick Contact");
  const btn2Url = data?.btn2Url ?? "/contacts";

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-page py-10 grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-base font-display uppercase tracking-wide opacity-90">
            {subtitle}
          </p>
          <p className="mt-2 text-sm opacity-90 max-w-xl">{paragraph}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-surface uppercase font-bold tracking-wide cursor-pointer border-0"
            onClick={() => open()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {btn1Text}
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary uppercase font-bold tracking-wide"
          >
            <Link to={btn2Url as any}>
              <Phone className="mr-2 h-4 w-4" />
              {btn2Text}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
