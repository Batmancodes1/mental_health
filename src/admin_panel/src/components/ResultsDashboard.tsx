import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import "../index.css";
import {
  Brain,
  Download,
  Phone,
  Heart,
  AlertTriangle,
  CheckCircle,
  Home,
  Book,
  Moon,
  Dumbbell,
  Users,
  MessageCircle,
} from "lucide-react";
import { AssessmentResults } from "./AssessmentForm";
import { generatePDFReport } from "../lib/pdfGenerator";

interface ResultsDashboardProps {
  results: AssessmentResults;
  onBackToHome: () => void;
}

const severityConfig = {
  minimal: {
    label: "Minimal Depression",
    color: "bg-success text-success-foreground",
    description:
      "Your responses suggest minimal signs of depression. Keep up the good work!",
    percentage: 20,
  },
  mild: {
    label: "Mild Depression",
    color: "bg-warning text-warning-foreground",
    description:
      "Your responses suggest mild depression symptoms that may benefit from attention.",
    percentage: 40,
  },
  moderate: {
    label: "Moderate Depression",
    color: "bg-warning text-warning-foreground",
    description:
      "Your responses suggest moderate depression that would benefit from professional support.",
    percentage: 60,
  },
  "moderately-severe": {
    label: "Moderately Severe Depression",
    color: "bg-destructive text-destructive-foreground",
    description:
      "Your responses suggest moderately severe depression. Professional help is strongly recommended.",
    percentage: 80,
  },
  severe: {
    label: "Severe Depression",
    color: "bg-destructive text-destructive-foreground",
    description:
      "Your responses suggest severe depression. Please seek professional help immediately.",
    percentage: 100,
  },
};

const selfCareStrategies = [
  {
    icon: Moon,
    title: "Sleep Hygiene",
    description:
      "Maintain 7-9 hours of sleep, consistent bedtime, and avoid screens before bed.",
  },
  {
    icon: Dumbbell,
    title: "Physical Activity",
    description:
      "Engage in 30 minutes of moderate exercise daily, even a short walk can help.",
  },
  {
    icon: Book,
    title: "Mindfulness & Meditation",
    description:
      "Practice daily meditation, deep breathing, or mindfulness exercises for 10-15 minutes.",
  },
  {
    icon: Users,
    title: "Social Connection",
    description:
      "Maintain regular contact with friends, family, or join support groups.",
  },
  {
    icon: Heart,
    title: "Healthy Nutrition",
    description:
      "Eat balanced meals, stay hydrated, and limit alcohol and caffeine intake.",
  },
  {
    icon: MessageCircle,
    title: "Professional Support",
    description:
      "Consider therapy, counseling, or speaking with your healthcare provider.",
  },
];

export default function ResultsDashboard({
  results,
  onBackToHome,
}: ResultsDashboardProps) {
  const severityInfo = severityConfig[results.severity];

  const handleDownloadReport = async () => {
    try {
      await generatePDFReport(results);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const getRecommendation = () => {
    if (results.riskLevel === "high" || results.phq9Score >= 15) {
      return {
        title: "Seek Professional Help Immediately",
        description:
          "Your responses indicate significant symptoms that require professional attention. Please contact a mental health professional or your healthcare provider.",
        urgency: "high",
      };
    } else if (results.riskLevel === "medium" || results.phq9Score >= 10) {
      return {
        title: "Consider Professional Support",
        description:
          "Your responses suggest moderate symptoms that could benefit from professional guidance. Consider scheduling an appointment with a counselor or therapist.",
        urgency: "medium",
      };
    } else {
      return {
        title: "Continue Self-Care Practices",
        description:
          "Your responses suggest minimal symptoms. Continue with healthy lifestyle practices and monitor your mental well-being regularly.",
        urgency: "low",
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="min-h-screen bg-gradient-secondary py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-wellness rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Your Assessment Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Completed on {results.completedAt.toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score Card */}
              <Card className="p-6 shadow-medium">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">PHQ-9 Depression Score</h2>
                  <Badge className={severityInfo.color}>
                    {severityInfo.label}
                  </Badge>
                </div>

                <div className="mb-6">
                  <div className="flex items-end space-x-2 mb-2">
                    <span className="text-4xl font-bold text-primary">
                      {results.phq9Score}
                    </span>
                    <span className="text-lg text-muted-foreground">/ 27</span>
                  </div>
                  <Progress
                    value={severityInfo.percentage}
                    className="h-3 mb-3"
                  />
                  <p className="text-muted-foreground">
                    {severityInfo.description}
                  </p>
                </div>
              </Card>

              {/* Recommendation Card */}
              <Card className="p-6 shadow-medium">
                <div className="flex items-start space-x-3">
                  {recommendation.urgency === "high" && (
                    <AlertTriangle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  )}
                  {recommendation.urgency === "medium" && (
                    <Heart className="h-6 w-6 text-warning mt-1 flex-shrink-0" />
                  )}
                  {recommendation.urgency === "low" && (
                    <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  )}

                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {recommendation.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Self-Care Strategies */}
              <Card className="p-6 shadow-medium">
                <h3 className="text-xl font-semibold mb-4">
                  Personalized Self-Care Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selfCareStrategies.map((strategy, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <strategy.icon className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{strategy.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {strategy.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card className="p-6 shadow-medium">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleDownloadReport}
                    className="w-full bg-gradient-wellness text-white hover:opacity-90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>

                  <Button
                    variant="outline"
                    onClick={onBackToHome}
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </div>
              </Card>

              {/* Crisis Support */}
              <Card className="p-6 shadow-medium border-destructive/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Phone className="h-5 w-5 text-destructive" />
                  <h3 className="text-lg font-semibold">Crisis Support</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  If you're having thoughts of self-harm or suicide, please
                  reach out immediately:
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>National Suicide Prevention Lifeline:</strong>
                    <br />
                    <a href="tel:988" className="text-primary hover:underline">
                      988
                    </a>
                  </div>
                  <div>
                    <strong>Crisis Text Line:</strong>
                    <br />
                    Text HOME to{" "}
                    <a
                      href="sms:741741"
                      className="text-primary hover:underline"
                    >
                      741741
                    </a>
                  </div>
                  <div>
                    <strong>Emergency:</strong>
                    <br />
                    <a href="tel:911" className="text-primary hover:underline">
                      911
                    </a>
                  </div>
                </div>
              </Card>

              {/* Support Resources */}
              <Card className="p-6 shadow-medium">
                <h3 className="text-lg font-semibold mb-4">
                  Support Resources
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Campus Counseling Center</strong>
                    <br />
                    <span className="text-muted-foreground">
                      Mon-Fri: 9AM-5PM
                    </span>
                    <br />
                    <a
                      href="tel:555-123-4567"
                      className="text-primary hover:underline"
                    >
                      (555) 123-4567
                    </a>
                  </div>

                  <div>
                    <strong>24/7 Student Support</strong>
                    <br />
                    <span className="text-muted-foreground">
                      Available 24/7
                    </span>
                    <br />
                    <a
                      href="tel:555-987-6543"
                      className="text-primary hover:underline"
                    >
                      (555) 987-6543
                    </a>
                  </div>

                  <div>
                    <strong>Online Counseling</strong>
                    <br />
                    <span className="text-muted-foreground">
                      Schedule virtual appointments
                    </span>
                    <br />
                    <a
                      href="mailto:counseling@university.edu"
                      className="text-primary hover:underline"
                    >
                      counseling@university.edu
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Understanding Your Score */}
          <Card className="mt-8 p-6 shadow-medium">
            <h3 className="text-xl font-semibold mb-4">
              Understanding Your PHQ-9 Score
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(severityConfig).map(([key, config]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg text-center ${
                    key === results.severity ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div
                    className={`w-full h-2 rounded-full mb-2 ${config.color}`}
                  />
                  <div className="font-medium text-sm">{config.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {key === "minimal" && "0-4"}
                    {key === "mild" && "5-9"}
                    {key === "moderate" && "10-14"}
                    {key === "moderately-severe" && "15-19"}
                    {key === "severe" && "20-27"}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
