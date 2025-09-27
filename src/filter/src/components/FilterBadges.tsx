import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterBadgesProps {
  platforms: Array<{
    id: number;
    websiteName: string;
    specialty: string;
    url: string;
    gender: boolean | null;
    hospital: boolean;
    languageFilter: boolean;
    labTest: boolean;
  }>;
}

export const FilterBadges = ({ platforms }: FilterBadgesProps) => {
  const getAllFilters = () => {
    const filterSet = new Set<string>();
    platforms.forEach((platform) => {
      if (platform.gender === true) filterSet.add("Gender Filter");
      if (platform.hospital === true) filterSet.add("Hospital Filter");
      if (platform.languageFilter === true) filterSet.add("Language Filter");
      if (platform.labTest === true) filterSet.add("Lab Test Available");
    });
    return Array.from(filterSet);
  };

  const getUniqueSpecialties = () => {
    const specialties = [...new Set(platforms.map((p) => p.specialty))];
    return specialties;
  };

  const specialties = getUniqueSpecialties();

  const handleFilterClick = (searchTerm: string) => {
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      searchTerm
    )}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2 flex-wrap p-4 bg-blue-100 rounded-lg border border-blue-300">
      <Filter className="h-4 w-4 text-blue-600" />
      <span className="text-sm font-medium text-gray-800">
        Available Filters:
      </span>

      {specialties.map((specialty) => (
        <Badge
          key={specialty}
          variant="default"
          className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          onClick={() => handleFilterClick(specialty)}
        >
          {specialty}
        </Badge>
      ))}
    </div>
  );
};
