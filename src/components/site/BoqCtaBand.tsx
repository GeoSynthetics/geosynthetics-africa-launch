import { Link } from "@tanstack/react-router";
import { Upload, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BoqCtaBand() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-page py-10 grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
            Submit your BOQ.
          </h2>
          <p className="mt-2 text-base font-display uppercase tracking-wide opacity-90">
            Get a system — not just materials.
          </p>
          <p className="mt-2 text-sm opacity-90 max-w-xl">
            Upload your BOQ or speak to our technical team for expert recommendations and support.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
          <Button asChild size="lg" className="bg-background text-foreground hover:bg-surface uppercase font-bold tracking-wide">
            <Link to="/contacts">
              <Upload className="mr-2 h-4 w-4" />
              Upload Project BOQ
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary uppercase font-bold tracking-wide">
            <Link to="/contacts">
              <Phone className="mr-2 h-4 w-4" />
              Quick Contact
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
