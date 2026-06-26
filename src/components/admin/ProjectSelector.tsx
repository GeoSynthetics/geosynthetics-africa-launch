import * as React from "react"
import { ChevronsUpDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from "@/integrations/supabase/client"

export interface ProjectData {
  id: string
  title: string
  slug: string
  hero_image_url?: string | null
  country?: string | null
  project_year?: number | string | null
}

interface ProjectSelectorProps {
  onSelect: (project: ProjectData) => void
  excludeIds?: string[]
  placeholder?: string
  className?: string
}

export function ProjectSelector({ onSelect, excludeIds, placeholder = "Select project...", className }: ProjectSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [projects, setProjects] = React.useState<ProjectData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadProjects() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("case_studies")
          .select("id, title, slug, hero_image_url, country, project_year")
          .order("title")

        if (!error && data) {
          setProjects(data as ProjectData[])
        }
      } catch (err) {
        console.error("Failed to load projects:", err)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const filteredProjects = React.useMemo(() => {
    if (!excludeIds || excludeIds.length === 0) return projects;
    return projects.filter((p) => !excludeIds.includes(p.id));
  }, [projects, excludeIds]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={className}
        >
          <span className="truncate">
            {loading ? "Loading case studies..." : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search case studies..." />
          <CommandList>
            <CommandEmpty>No case study found.</CommandEmpty>
            <CommandGroup>
              {filteredProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.title}
                  onSelect={() => {
                    onSelect(project)
                    setOpen(false)
                  }}
                >
                  <Search className="mr-2 h-4 w-4 opacity-50" />
                  {project.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
