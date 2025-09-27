import { useState } from "react";
import { HeroSection } from "../components/hero-section";
import { CategorySection } from "../components/category-section";
import { LanguageFilter } from "../components/language-filter";
import { mentalWellnessData } from "../data/resources";
import "../index.css";
import {
  Brain,
  Headphones,
  BookOpen,
  Radio,
  Music,
  Mic,
  Video,
  Heart,
  Waves,
} from "lucide-react";

const Index = () => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const availableLanguages = ["English", "Hindi", "Bengali"];

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const filterByLanguage = (resources: any) => {
    if (selectedLanguages.length === 0) return resources;
    return resources.filter(
      (resource: any) =>
        !resource.language || selectedLanguages.includes(resource.language)
    );
  };

  const mentalWellnessGuides = [
    ...filterByLanguage([
      ...mentalWellnessData.Mental_Wellness_Guide.English,
      ...mentalWellnessData.Mental_Wellness_Guide.Hindi,
      ...mentalWellnessData.Mental_Wellness_Guide.Bengali,
    ]),
  ];

  const meditationVideos = [
    ...filterByLanguage([
      ...mentalWellnessData.Meditational_Video.English,
      ...mentalWellnessData.Meditational_Video.Hindi,
      ...mentalWellnessData.Meditational_Video.Bengali,
    ]),
  ];

  const mentalHealthReasons = [
    ...filterByLanguage([
      ...mentalWellnessData.Reason_Behind_Mental_Health.English,
      ...mentalWellnessData.Reason_Behind_Mental_Health.Hindi,
    ]),
  ];

  const soundTherapy = [
    ...mentalWellnessData.Frequency_For_Mental_Wellbeing,
    ...mentalWellnessData.Sound_Therapy_For_Mental_Health,
  ];

  const musicWellness = [
    ...mentalWellnessData.Music_For_Mental_Wellness.Healing_Frequencies,
    ...mentalWellnessData.Music_For_Mental_Wellness.Relaxing_Music,
    ...mentalWellnessData.Music_For_Mental_Wellness.Long_Form_Relaxation,
    ...mentalWellnessData.Music_For_Mental_Wellness.Self_Care_Collection,
    ...mentalWellnessData.Music_For_Mental_Wellness.Playlists,
  ];

  const educationalContent = [
    ...mentalWellnessData.Article_Style_Video.Educational,
    ...mentalWellnessData.Article_Style_Video.Animation,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-sky-50">
      <HeroSection />

      <main className="container mx-auto px-6 py-16" id="resources">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Comprehensive Mental Health Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our carefully curated collection of mental wellness
            resources, available in multiple languages to support your journey
            toward better mental health.
          </p>
        </div>

        <LanguageFilter
          selectedLanguages={selectedLanguages}
          onLanguageToggle={handleLanguageToggle}
          availableLanguages={availableLanguages}
        />

        <div className="space-y-16">
          <CategorySection
            title="Mental Wellness Guides"
            description="Comprehensive guides to understanding and maintaining mental wellness in daily life"
            resources={mentalWellnessGuides}
            category="Mental Wellness"
            icon={<Brain className="w-6 h-6" />}
            defaultExpanded={true}
          />

          <CategorySection
            title="Meditation & Mindfulness"
            description="Guided meditation sessions and mindfulness practices for stress relief and relaxation"
            resources={meditationVideos}
            category="Meditation"
            icon={<Headphones className="w-6 h-6" />}
            defaultExpanded={true}
          />

          <CategorySection
            title="Understanding Mental Health"
            description="Educational content exploring the science and psychology behind mental health"
            resources={mentalHealthReasons}
            category="Education"
            icon={<BookOpen className="w-6 h-6" />}
          />

          <CategorySection
            title="Sound Therapy & Healing Frequencies"
            description="Therapeutic sound frequencies and binaural beats for mental wellbeing"
            resources={soundTherapy}
            category="Sound Therapy"
            icon={<Waves className="w-6 h-6" />}
          />

          <CategorySection
            title="Wellness Music Collection"
            description="Carefully curated music for relaxation, sleep, and mental wellness"
            resources={musicWellness}
            category="Music Therapy"
            icon={<Music className="w-6 h-6" />}
          />

          <CategorySection
            title="Podcasts & Discussions"
            description="Expert discussions and personal stories about mental health awareness"
            resources={mentalWellnessData.Podcast_On_Mental_Illness}
            category="Podcasts"
            icon={<Mic className="w-6 h-6" />}
          />

          <CategorySection
            title="Educational Videos"
            description="Animated and educational content explaining mental health concepts"
            resources={educationalContent}
            category="Educational"
            icon={<Video className="w-6 h-6" />}
          />
        </div>

        <div className="mt-20 text-center bg-gradient-to-r from-teal-500 to-green-500 p-12 rounded-3xl text-white shadow-lg">
          <Heart className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h3 className="text-3xl font-bold mb-4">
            Your Mental Health Matters
          </h3>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-6">
            Remember that seeking help is a sign of strength. These resources
            are here to support you, but professional help should always be
            sought when needed.
          </p>
          <div className="text-lg opacity-80">
            <p>
              🌟 Available 24/7 • 🌍 Multiple Languages • 💙 Professional
              Quality
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
