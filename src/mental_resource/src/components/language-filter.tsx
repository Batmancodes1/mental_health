import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import "../index.css";

interface LanguageFilterProps {
  selectedLanguages: string[];
  onLanguageToggle: (language: string) => void;
  availableLanguages: string[];
}

export const LanguageFilter = ({
  selectedLanguages,
  onLanguageToggle,
  availableLanguages,
}: LanguageFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-sky-100/50 rounded-xl border border-sky-200 mb-8">
      <div className="flex items-center space-x-2 text-teal-600 font-medium">
        <Globe className="w-5 h-5" />
        <span>Filter by Language:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map((language) => (
          <Button
            key={language}
            variant={
              selectedLanguages.includes(language) ? "default" : "outline"
            }
            size="sm"
            onClick={() => onLanguageToggle(language)}
            className={`transition-all duration-200 flex items-center justify-center ${
              selectedLanguages.includes(language)
                ? "bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg"
                : "border-teal-600/30 text-teal-600 hover:bg-teal-500 hover:text-white"
            }`}
          >
            {language}
            {selectedLanguages.includes(language) && (
              <Badge className="ml-2 bg-white/20 text-white text-xs">✓</Badge>
            )}
          </Button>
        ))}
        {selectedLanguages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              availableLanguages.forEach((lang) => onLanguageToggle(lang))
            }
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};
