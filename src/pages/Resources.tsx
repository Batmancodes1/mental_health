import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, BookOpen, Play, FileText, ExternalLink, Clock, Star } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'audio' | 'pdf' | 'article';
  language: string;
  url: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  is_featured: boolean;
  created_at: string;
}

const Resources = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, selectedType, selectedLanguage]);

  const fetchResources = async () => {
    try {
      const { data: resourcesData, error } = await supabase
        .from('resources')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResources(resourcesData || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(resource => resource.language === selectedLanguage);
    }

    setFilteredResources(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'audio':
        return <Play className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'default';
      case 'audio':
        return 'secondary';
      case 'pdf':
        return 'accent';
      case 'article':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  // Get unique languages for filter
  const languages = [...new Set(resources.map(r => r.language))];

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Resource Hub</h1>
        <p className="text-muted-foreground">
          Access curated mental health resources including videos, audio content, articles, and guides
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Video
                    </div>
                  </SelectItem>
                  <SelectItem value="audio">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Audio
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="article">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Article
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language.charAt(0).toUpperCase() + language.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedLanguage('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Resources */}
      {resources.some(r => r.is_featured) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-accent" />
              Featured Resources
            </CardTitle>
            <CardDescription>
              Handpicked resources recommended by our mental health professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources
                .filter(r => r.is_featured)
                .slice(0, 3)
                .map((resource) => (
                  <Card key={resource.id} className="border-l-4 border-l-accent">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getTypeColor(resource.type) as any} className="text-xs">
                              <span className="flex items-center">
                                {getTypeIcon(resource.type)}
                                <span className="ml-1">{resource.type}</span>
                              </span>
                            </Badge>
                            {resource.duration_minutes && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDuration(resource.duration_minutes)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Star className="h-4 w-4 text-accent fill-current" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {resource.description.substring(0, 100)}...
                        </p>
                      )}
                      <Button
                        variant="hero"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Access Resource
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              All Resources ({filteredResources.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResources.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="group hover:shadow-medium transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                        <div className="flex items-center flex-wrap gap-2">
                          <Badge variant={getTypeColor(resource.type) as any} className="text-xs">
                            <span className="flex items-center">
                              {getTypeIcon(resource.type)}
                              <span className="ml-1">{resource.type}</span>
                            </span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {resource.language.charAt(0).toUpperCase() + resource.language.slice(1)}
                          </Badge>
                          {resource.duration_minutes && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDuration(resource.duration_minutes)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {resource.is_featured && (
                        <Star className="h-4 w-4 text-accent fill-current flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {resource.description.length > 120
                          ? `${resource.description.substring(0, 120)}...`
                          : resource.description
                        }
                      </p>
                    )}
                    <Button
                      variant="calm"
                      size="sm"
                      className="w-full group-hover:variant-hero transition-all"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedLanguage('all');
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;