import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, ArrowRight, Brain } from "lucide-react";
import "../index.css";

// PHQ-9 Depression Assessment Questions
const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
];

const responseOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

interface AssessmentFormProps {
  onComplete: (results: AssessmentResults) => void;
  onBack: () => void;
}

export interface AssessmentResults {
  phq9Score: number;
  responses: number[];
  severity: "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";
  riskLevel: "low" | "medium" | "high";
  completedAt: Date;
}

export default function AssessmentForm({
  onComplete,
  onBack,
}: AssessmentFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>(
    new Array(phq9Questions.length).fill(-1)
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const progress = ((currentQuestion + 1) / phq9Questions.length) * 100;
  const isLastQuestion = currentQuestion === phq9Questions.length - 1;
  const canProceed = selectedAnswer !== -1;
  const canGoBack = currentQuestion > 0;

  const handleAnswerSelect = (value: number) => {
    setSelectedAnswer(value);
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(responses[currentQuestion + 1] || -1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswer(responses[currentQuestion - 1]);
  };

  const calculateResults = () => {
    const totalScore = responses.reduce((sum, score) => sum + score, 0);

    let severity: AssessmentResults["severity"];
    let riskLevel: AssessmentResults["riskLevel"];

    if (totalScore <= 4) {
      severity = "minimal";
      riskLevel = "low";
    } else if (totalScore <= 9) {
      severity = "mild";
      riskLevel = "low";
    } else if (totalScore <= 14) {
      severity = "moderate";
      riskLevel = "medium";
    } else if (totalScore <= 19) {
      severity = "moderately-severe";
      riskLevel = "high";
    } else {
      severity = "severe";
      riskLevel = "high";
    }

    // Check for suicidal ideation (question 9)
    if (responses[8] > 0) {
      riskLevel = "high";
    }

    const results: AssessmentResults = {
      phq9Score: totalScore,
      responses,
      severity,
      riskLevel,
      completedAt: new Date(),
    };

    onComplete(results);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
              Mental Health Assessment
            </h1>
            <p className="text-lg text-muted-foreground">
              PHQ-9 Depression Screening
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {phq9Questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Question Card */}
          <Card className="p-8 mb-8 shadow-medium">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Over the last 2 weeks, how often have you been bothered by:
                </p>
                <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
                  {phq9Questions[currentQuestion]}
                </h2>
              </div>

              <div className="space-y-3">
                {responseOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedAnswer === option.value
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option.value}
                          checked={selectedAnswer === option.value}
                          onChange={() => handleAnswerSelect(option.value)}
                          className="w-5 h-5 text-primary"
                        />
                        <span className="text-lg">{option.label}</span>
                      </div>
                    </label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={currentQuestion === 0 ? onBack : handlePrevious}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentQuestion === 0 ? "Back to Home" : "Previous"}</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center space-x-2 bg-gradient-wellness text-white hover:opacity-90"
            >
              <span>
                {isLastQuestion ? "Complete Assessment" : "Next Question"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This assessment is for informational
              purposes only and is not a substitute for professional medical
              advice, diagnosis, or treatment. If you are experiencing a mental
              health crisis, please seek immediate professional help.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
