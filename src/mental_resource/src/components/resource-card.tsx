import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Play, Clock, Globe } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  url: string;
  type: "video" | "audio" | "playlist" | "article";
  language?: string;
  duration?: string;
  category: string;
}

export const ResourceCard = ({
  title,
  description,
  url,
  type,
  language,
  duration,
  category,
}: ResourceCardProps) => {
  const getTypeColor = () => {
    switch (type) {
      case "video":
        return "bg-blue-500 text-white";
      case "audio":
        return "bg-green-500 text-white";
      case "playlist":
        return "bg-teal-500 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "video":
      case "audio":
        return <Play className="w-4 h-4" />;
      case "playlist":
        return <Globe className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-sky-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          {/* Type badge */}
          <Badge
            className={`${getTypeColor()} px-2 py-1 rounded flex items-center`}
          >
            {getTypeIcon()}
            <span className="ml-1 capitalize">{type}</span>
          </Badge>

          {/* Language badge with white text, blue background, shadow on hover */}
          {language && (
            <Badge className="bg-blue-500 text-white px-2 py-1 rounded text-xs transition-shadow duration-200 group-hover:shadow-lg">
              {language}
            </Badge>
          )}
        </div>

        <CardTitle className="text-lg group-hover:text-teal-600 transition-colors duration-200 line-clamp-2">
          {title}
        </CardTitle>

        <CardDescription className="text-sm line-clamp-2 bg-white/80 backdrop-blur-sm">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            onClick={() => window.open(url, "_blank")}
            className="bg-gradient-to-r from-teal-500 to-green-500 hover:shadow-lg text-white transition-all duration-300 flex items-center px-3 py-1 rounded"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Watch
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t border-sky-200">
          <Badge className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
            {category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
