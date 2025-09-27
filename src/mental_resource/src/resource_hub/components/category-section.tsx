import { ResourceCard } from "./resource-card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Resource {
  title: string;
  description: string;
  url: string;
  type: 'video' | 'audio' | 'playlist' | 'article';
  language?: string;
  duration?: string;
}

interface CategorySectionProps {
  title: string;
  description: string;
  resources: Resource[];
  category: string;
  icon: React.ReactNode;
  defaultExpanded?: boolean;
}

export const CategorySection = ({ 
  title, 
  description, 
  resources, 
  category, 
  icon,
  defaultExpanded = false
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 p-6 bg-wellness-gradient rounded-2xl text-white shadow-wellness">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-white/90 max-w-2xl">{description}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:bg-white/20 transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              title={resource.title}
              description={resource.description}
              url={resource.url}
              type={resource.type}
              language={resource.language}
              duration={resource.duration}
              category={category}
            />
          ))}
        </div>
      )}

      {!isExpanded && (
        <div className="text-center p-8 bg-wellness-soft/30 rounded-xl border border-wellness-soft">
          <p className="text-muted-foreground">
            Click above to explore {resources.length} resources in this category
          </p>
        </div>
      )}
    </section>
  );
};