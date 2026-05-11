import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { ArrowRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Geosynthetics Africa" },
      { name: "description", content: "Explore our successful geosynthetic installations across Africa." },
      { property: "og:title", content: "Projects — Geosynthetics Africa" },
    ],
  }),
  component: ProjectsPage,
});

const PLACEHOLDER_PROJECTS = [
  {
    id: "1",
    title: "Tailings Storage Facility Extension",
    location: "Limpopo, South Africa",
    application: "Mining Systems",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
    description: "Design, supply, and installation of a 1.5mm HDPE geomembrane lining system for a platinum mine TSF."
  },
  {
    id: "2",
    title: "Municipal Landfill Cell Construction",
    location: "Nairobi, Kenya",
    application: "Waste & Landfills",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    description: "Complete containment system including GCL, 2.0mm HDPE geomembrane, and drainage geocomposite."
  },
  {
    id: "3",
    title: "Agricultural Water Reservoir",
    location: "Western Cape, South Africa",
    application: "Water Containment",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    description: "Lining of a 50,000 m³ irrigation dam using LLDPE geomembranes for high flexibility and settlement accommodation."
  },
  {
    id: "4",
    title: "Highway Embankment Stabilisation",
    location: "Accra, Ghana",
    application: "Roads & Infrastructure",
    image: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=800&q=80",
    description: "Basal reinforcement of a highway embankment over soft soils using high-strength woven geogrids."
  },
  {
    id: "5",
    title: "Process Water Pond Liner Replacement",
    location: "Copperbelt, Zambia",
    application: "Mining Systems",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    description: "Relining of an acidic process water pond with specialized chemical-resistant geomembranes."
  },
  {
    id: "6",
    title: "Coastal Erosion Protection",
    location: "Dar es Salaam, Tanzania",
    application: "Erosion Control",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    description: "Installation of non-woven geotextile filters beneath rock armour to prevent fine soil washout."
  }
];

function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Proven Execution Across Africa"
        description="From remote mining operations to critical municipal infrastructure, explore our track record of successful geosynthetic system installations."
        image="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80"
      />

      <section className="bg-background">
        <div className="container-page py-16 md:py-24">
          <div className="flex flex-wrap gap-4 mb-10">
             {["All", "Mining Systems", "Water Containment", "Waste & Landfills", "Roads & Infrastructure", "Erosion Control"].map((cat) => (
               <button 
                 key={cat}
                 className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${cat === 'All' ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-surface-dark hover:text-surface-dark-foreground'}`}
               >
                 {cat}
               </button>
             ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_PROJECTS.map((project) => (
              <div key={project.id} className="group rounded border border-border bg-card overflow-hidden hover:border-primary transition flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    {project.application}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">
                    {project.description}
                  </p>
                  <div className="mt-auto text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    View Project <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-8 py-3 rounded border border-primary text-primary text-sm font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition">
              Load More Projects
            </button>
          </div>
        </div>
      </section>

      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
