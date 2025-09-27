import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface KeywordCardProps {
  keyword: string;
  index: number;
  onSearch: (keyword: string) => void;
}

export const KeywordCard = ({ keyword, index, onSearch }: KeywordCardProps) => {
  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-600 group cursor-pointer"
      onClick={() => onSearch(keyword)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {keyword}
            </h3>
            <p className="text-gray-600 mb-2">Search near your location</p>
            <p className="text-sm text-gray-500">Find nearby mental health services</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <img
              src="src/assets/public/google_maps.svg"
              alt="Google Maps"
              className="h-5 w-5"
            />
            <span className="text-gray-700">Location-based search</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-lg font-semibold text-blue-600">Google Maps</span>
            <span className="text-sm text-gray-500 ml-1">search</span>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-md transition-all">
            Search on Map
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
