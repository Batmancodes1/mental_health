import { ResourceCard } from "./resource-card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import "../index.css";

interface Resource {
  title: string;
  description: string;
  url: string;
  type: "video" | "audio" | "playlist" | "article";
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
  defaultExpanded = false,
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="mb-12">
      {/* Header with animated gradient */}
      <div
        className="flex items-center justify-between mb-6 p-6 rounded-2xl text-white shadow-lg
          bg-gradient-to-r from-teal-500 via-green-400 to-teal-500
          bg-[length:200%_200%] animate-gradient-x"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-white/90 max-w-2xl">{description}</p>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <Button
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`transition-all duration-300 flex items-center justify-center px-3 py-1 rounded ${
            isExpanded
              ? "bg-blue-500 hover:shadow-lg text-white"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Expanded Resources */}
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

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="text-center p-8 rounded-xl border border-sky-200 bg-sky-100/50">
          <p className="text-gray-600">
            Click above to explore {resources.length} resources in this category
          </p>
        </div>
      )}
    </section>
  );
};
