import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { DoctorCard } from "../components/DoctorCard";
import { FilterBadges } from "../components/FilterBadges";
import { KeywordCard } from "../components/KeywordCard";
import { platformsData, mentalHealthKeywords } from "../data/doctors";
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const Index = () => {
  const [activeTab, setActiveTab] = useState<"online" | "onsite">("online");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages =
    activeTab === "online"
      ? Math.ceil(platformsData.length / ITEMS_PER_PAGE)
      : Math.ceil(mentalHealthKeywords.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPlatforms = platformsData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const currentKeywords = mentalHealthKeywords.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleBooking = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleMapSearch = (keyword: string) => {
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      keyword
    )}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="relative bg-[length:200%_200%] animate-[gradient_12s_ease_infinite] text-white py-8 shadow-lg"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0e7490, #1e40af, #4338ca)", // darker cyan → dark blue → dark indigo
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Medical Platform Directory</h1>
          </div>
          <p className="text-lg opacity-90">
            Find and connect with medical platforms for various specialties
          </p>
        </div>
      </div>

      <style>
        {`
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`}
      </style>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Badges */}
        <div className="mb-6">
          <FilterBadges platforms={platformsData} />
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "online" | "onsite");
            setCurrentPage(1); // Reset to first page when switching tabs
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-fit grid-cols-2 bg-blue-100">
              <TabsTrigger
                value="online"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Online Consultation
              </TabsTrigger>
              <TabsTrigger
                value="onsite"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Onsite Visit
              </TabsTrigger>
            </TabsList>

            {/* Results Count */}
            <Badge className="text-sm border border-blue-500 px-3 py-1 rounded-md">
              {activeTab === "online"
                ? `${platformsData.length} platforms available`
                : `${mentalHealthKeywords.length} search options available`}
            </Badge>
          </div>

          <TabsContent value="online" className="space-y-4">
            {currentPlatforms.map((platform) => (
              <DoctorCard
                key={platform.id}
                platform={platform}
                type="online"
                onBook={handleBooking}
              />
            ))}
          </TabsContent>

          <TabsContent value="onsite" className="space-y-4">
            {currentKeywords.map((keyword, index) => (
              <KeywordCard
                key={keyword}
                keyword={keyword}
                index={startIndex + index}
                onSearch={handleMapSearch}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">
            {activeTab === "online"
              ? `Showing ${startIndex + 1}-${Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  platformsData.length
                )} of ${platformsData.length} platforms`
              : `Showing ${startIndex + 1}-${Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  mentalHealthKeywords.length
                )} of ${mentalHealthKeywords.length} search options`}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="border-blue-600 bg-blue-50 hover: text-blue-600"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size="sm"
                    className={`${
                      currentPage === page
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border-blue-600  bg-blue-50 hover: text-blue-600"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="border-blue-600 bg-blue-50 hover: text-blue-600"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
