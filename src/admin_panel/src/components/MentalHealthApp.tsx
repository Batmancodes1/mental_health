import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "./LandingPage";
import AssessmentForm, { AssessmentResults } from "./AssessmentForm";
import ResultsDashboard from "./ResultsDashboard";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { Button } from "@/components/ui/button";
import { BarChart3, Home } from "lucide-react";
import "../index.css";

type AppView = "landing" | "assessment" | "results" | "analytics";

export default function MentalHealthApp() {
  const [currentView, setCurrentView] = useState<AppView>("landing");
  const [assessmentResults, setAssessmentResults] =
    useState<AssessmentResults | null>(null);

  const handleStartAssessment = () => {
    setCurrentView("assessment");
  };

  const handleAssessmentComplete = (results: AssessmentResults) => {
    setAssessmentResults(results);
    setCurrentView("results");

    // Store results anonymously for analytics (localStorage for demo)
    const existingData = JSON.parse(
      localStorage.getItem("mentalHealthAnalytics") || "[]"
    );
    const anonymizedResult = {
      phq9Score: results.phq9Score,
      severity: results.severity,
      riskLevel: results.riskLevel,
      timestamp: results.completedAt.toISOString(),
      // Remove any personal identifiers
      id: Math.random().toString(36).substr(2, 9),
    };
    existingData.push(anonymizedResult);
    localStorage.setItem("mentalHealthAnalytics", JSON.stringify(existingData));
  };

  const handleBackToHome = () => {
    setCurrentView("landing");
    setAssessmentResults(null);
  };

  const handleBackFromAssessment = () => {
    setCurrentView("landing");
  };

  const handleViewAnalytics = () => {
    setCurrentView("analytics");
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <div className="relative min-h-screen">
      {/* Navigation Header (shown on non-landing pages) */}
      {currentView !== "landing" && (
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-wellness rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">MindCare</h1>
            </div>

            <div className="flex items-center space-x-3">
              {currentView !== "analytics" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewAnalytics}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToHome}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </div>
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onStartAssessment={handleStartAssessment} />

            {/* Analytics Access Button */}
            <div className="fixed bottom-8 right-8 z-40">
              <Button
                onClick={handleViewAnalytics}
                className="bg-gradient-wellness text-white shadow-glow hover:opacity-90 rounded-full w-14 h-14"
                size="sm"
              >
                <BarChart3 className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        )}

        {currentView === "assessment" && (
          <motion.div
            key="assessment"
            className="pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <AssessmentForm
              onComplete={handleAssessmentComplete}
              onBack={handleBackFromAssessment}
            />
          </motion.div>
        )}

        {currentView === "results" && assessmentResults && (
          <motion.div
            key="results"
            className="pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ResultsDashboard
              results={assessmentResults}
              onBackToHome={handleBackToHome}
            />
          </motion.div>
        )}

        {currentView === "analytics" && (
          <motion.div
            key="analytics"
            className="pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <AnalyticsDashboard onBackToHome={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
