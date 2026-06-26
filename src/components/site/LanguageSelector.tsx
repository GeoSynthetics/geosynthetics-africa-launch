import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split("-")[0] || "en";
  const selectedLang = languages.find((lang) => lang.code === currentLang) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    void i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-primary transition outline-none cursor-pointer">
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase font-medium text-xs">{selectedLang.code}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-surface-dark text-white border-zinc-800">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 cursor-pointer py-1.5 px-2 text-xs focus:bg-white/10 focus:text-white ${
              lang.code === selectedLang.code ? "bg-white/5 font-bold text-primary" : ""
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
