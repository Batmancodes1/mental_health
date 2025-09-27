import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

interface LanguageFilterProps {
  selectedLanguages: string[];
  onLanguageToggle: (language: string) => void;
  availableLanguages: string[];
}

export const LanguageFilter = ({ 
  selectedLanguages, 
  onLanguageToggle, 
  availableLanguages 
}: LanguageFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-wellness-soft/50 rounded-xl border border-wellness-soft mb-8">
      <div className="flex items-center space-x-2 text-wellness-blue font-medium">
        <Globe className="w-5 h-5" />
        <span>Filter by Language:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map((language) => (
          <Button
            key={language}
            variant={selectedLanguages.includes(language) ? "default" : "outline"}
            size="sm"
            onClick={() => onLanguageToggle(language)}
            className={`transition-all duration-200 ${
              selectedLanguages.includes(language)
                ? 'bg-wellness-gradient text-white shadow-glow'
                : 'border-wellness-blue/30 text-wellness-blue hover:bg-wellness-blue hover:text-white'
            }`}
          >
            {language}
            {selectedLanguages.includes(language) && (
              <Badge className="ml-2 bg-white/20 text-white text-xs">
                ✓
              </Badge>
            )}
          </Button>
        ))}
        {selectedLanguages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => availableLanguages.forEach(lang => onLanguageToggle(lang))}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};