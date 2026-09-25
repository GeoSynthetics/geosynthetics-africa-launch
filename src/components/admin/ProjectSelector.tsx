import * as React from "react";
import { ChevronsUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  hero_image_url?: string | null;
  country?: string | null;
  sector?: string | null;
  scale?: string | null;
  project_year?: number | string | null;
}

interface ProjectSelectorProps {
  onSelect: (project: ProjectData) => void;
  excludeIds?: string[];
  placeholder?: string;
  className?: string;
}

export function ProjectSelector({
  onSelect,
  excludeIds,
  placeholder = "Select project...",
  className,
}: ProjectSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [projects, setProjects] = React.useState<ProjectData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("case_studies")
          .select("id, title, slug, hero_image_url, country, sector, scale, project_year")
          .eq("status", "published")
          .order("project_year", { ascending: false })
          .order("title");

        if (!error && data) {
          setProjects(data as ProjectData[]);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = React.useMemo(() => {
    if (!excludeIds || excludeIds.length === 0) return projects;
    return projects.filter((p) => !excludeIds.includes(p.id) && !excludeIds.includes(p.slug));
  }, [projects, excludeIds]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={className}>
          <span className="truncate">{loading ? "Loading case studies..." : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search case studies..." />
          <CommandList>
            <CommandEmpty>No case study found.</CommandEmpty>
            <CommandGroup>
              {filteredProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={`${project.title} ${project.country || ""} ${project.sector || ""}`}
                  onSelect={() => {
                    onSelect(project);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 py-2 cursor-pointer"
                >
                  <div className="h-7 w-9 rounded bg-muted overflow-hidden shrink-0 border border-border/50">
                    {project.hero_image_url ? (
                      <img
                        src={project.hero_image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[8px] text-muted-foreground">
                        <Search className="h-3 w-3 opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs truncate">{project.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {[project.country, project.sector, project.project_year]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
