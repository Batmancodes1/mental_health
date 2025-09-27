import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface DoctorCardProps {
  platform: {
    id: number;
    websiteName: string;
    specialty: string;
    url: string;
    gender: boolean | null;
    hospital: boolean;
    languageFilter: boolean;
    labTest: boolean;
  };
  type: "online" | "onsite";
  onBook: (url: string) => void;
}

export const DoctorCard = ({ platform, type, onBook }: DoctorCardProps) => {
  const getActiveFilters = () => {
    const filters: { label: string; color: string }[] = [];
    if (platform.gender === true)
      filters.push({
        label: "Gender Filter",
        color:
          "bg-pink-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all",
      });
    if (platform.hospital === true)
      filters.push({
        label: "Hospital Filter",
        color:
          "bg-green-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all",
      });
    if (platform.languageFilter === true)
      filters.push({
        label: "Language Filter",
        color:
          "bg-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all",
      });
    if (platform.labTest === true)
      filters.push({
        label: "Lab Test Available",
        color:
          "bg-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all",
      });
    return filters;
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-600 group cursor-pointer"
      onClick={() => onBook(platform.url)}
    >
      <CardContent className="p-6">
        {/* Title & Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
              {platform.websiteName}
            </h3>
            <p className="text-gray-500 mb-2">{platform.specialty}</p>
            <p className="text-sm text-gray-400">Online Medical Platform</p>
          </div>
          <div className="text-right">
            <Badge
              variant={type === "online" ? "default" : "secondary"}
              className={`mb-2 ${
                type === "online"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {type === "online" ? "Online Platform" : "In-Person Visit"}
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <img
              src="src/assets/public/google_maps.svg"
              alt="Google Maps"
              className="h-5 w-5"
            />
            <span className="text-gray-700">
              Specialty: {platform.specialty}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {getActiveFilters().map((filter) => (
              <Badge
                key={filter.label}
                className={`text-xs px-3 py-1 rounded-md ${filter.color}`}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-lg font-semibold text-blue-600">
              {platform.websiteName}
            </span>
            <span className="text-sm text-gray-500 ml-1">platform</span>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-md transition-all">
            Visit Platform
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
