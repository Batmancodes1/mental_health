import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Play, Clock, Globe } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  url: string;
  type: 'video' | 'audio' | 'playlist' | 'article';
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
  category 
}: ResourceCardProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'audio':
        return <Play className="w-4 h-4" />;
      case 'playlist':
        return <Globe className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'video':
        return 'bg-wellness-blue text-white';
      case 'audio':
        return 'bg-wellness-green text-white';
      case 'playlist':
        return 'bg-wellness-teal text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="group hover:shadow-card-wellness transition-all duration-300 transform hover:-translate-y-1 border-wellness-soft/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getTypeColor()}>
            {getTypeIcon()}
            <span className="ml-1 capitalize">{type}</span>
          </Badge>
          {language && (
            <Badge variant="outline" className="text-wellness-blue border-wellness-blue/30">
              {language}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-wellness-blue transition-colors duration-200 line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-muted-foreground text-sm">
            {duration && (
              <>
                <Clock className="w-4 h-4 mr-1" />
                <span>{duration}</span>
              </>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={() => window.open(url, '_blank')}
            className="bg-wellness-gradient hover:shadow-glow transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Watch
          </Button>
        </div>
        <div className="mt-3 pt-3 border-t border-wellness-soft/30">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};