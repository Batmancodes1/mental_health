import { Button } from "@/components/ui/button";
import { Brain, Heart, Headphones } from "lucide-react";

export const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-wellness-teal rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-wellness-green rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm shadow-glow">
            <Brain className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Psychoeducational
          <span className="block bg-gradient-to-r from-white to-wellness-soft bg-clip-text text-transparent">
            Resource Hub
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          Discover comprehensive mental wellness resources, guided meditations, and expert content 
          in multiple languages to support your journey toward better mental health.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            onClick={() => scrollToSection('resources')}
            size="lg" 
            className="bg-white text-wellness-blue hover:bg-wellness-light transition-all duration-300 transform hover:scale-105 shadow-wellness text-lg px-8 py-6"
          >
            <Heart className="w-5 h-5 mr-2" />
            Explore Resources
          </Button>
          <Button 
            onClick={() => scrollToSection('meditation')}
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-wellness-blue transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6"
          >
            <Headphones className="w-5 h-5 mr-2" />
            Start Meditation
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-white/80">Guided Videos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">3</div>
            <div className="text-white/80">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/80">Available Access</div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};