import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Brain, Heart, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

interface ScreeningTool {
  name: 'PHQ-9' | 'GAD-7';
  title: string;
  description: string;
  questions: Question[];
}

interface ScreeningResult {
  id: string;
  tool: string;
  score: number;
  created_at: string;
  recommendations?: string;
}

const phq9Questions: Question[] = [
  {
    id: 'phq9_1',
    text: 'Little interest or pleasure in doing things',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9_2',
    text: 'Feeling down, depressed, or hopeless',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9_3',
    text: 'Trouble falling or staying asleep, or sleeping too much',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9_4',
    text: 'Feeling tired or having little energy',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9_5',
    text: 'Poor appetite or overeating',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9_6',
    text: 'Feeling bad about yourself or that you are a failure or have let yourself or your family down',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9_7',
    text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9_8',
    text: 'Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'phq9_9',
    text: 'Thoughts that you would be better off dead, or of hurting yourself',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const gad7Questions: Question[] = [
  {
    id: 'gad7_1',
    text: 'Feeling nervous, anxious, or on edge',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7_2',
    text: 'Not being able to stop or control worrying',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7_3',
    text: 'Worrying too much about different things',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7_4',
    text: 'Trouble relaxing',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7_5',
    text: 'Being so restless that it is hard to sit still',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7_6',
    text: 'Becoming easily annoyed or irritable',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'gad7_7',
    text: 'Feeling afraid, as if something awful might happen',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const screeningTools: ScreeningTool[] = [
  {
    name: 'PHQ-9',
    title: 'Depression Screening (PHQ-9)',
    description: 'A 9-question assessment to help identify symptoms of depression',
    questions: phq9Questions
  },
  {
    name: 'GAD-7',
    title: 'Anxiety Screening (GAD-7)',
    description: 'A 7-question assessment to help identify symptoms of anxiety',
    questions: gad7Questions
  }
];

const Screening = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState<ScreeningTool | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<{ score: number; recommendations: string } | null>(null);
  const [previousResults, setPreviousResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreviousResults();
  }, [user]);

  const fetchPreviousResults = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('screening_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPreviousResults(data || []);
    } catch (error) {
      console.error('Error fetching previous results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!selectedTool) return;

    if (currentQuestionIndex < selectedTool.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeScreening();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    if (!selectedTool) return 0;
    return selectedTool.questions.reduce((total, question) => {
      return total + (answers[question.id] || 0);
    }, 0);
  };

  const getRecommendations = (tool: string, score: number): string => {
    if (tool === 'PHQ-9') {
      if (score < 5) return 'Minimal depression symptoms. Continue with healthy lifestyle practices and self-care.';
      if (score < 10) return 'Mild depression symptoms. Consider speaking with a counselor and practicing stress management techniques.';
      if (score < 15) return 'Moderate depression symptoms. We recommend scheduling an appointment with a counselor for support.';
      if (score < 20) return 'Moderately severe depression symptoms. Please schedule an appointment with a counselor as soon as possible.';
      return 'Severe depression symptoms. Please contact a counselor immediately or seek emergency mental health services.';
    } else if (tool === 'GAD-7') {
      if (score < 5) return 'Minimal anxiety symptoms. Continue with relaxation and stress management practices.';
      if (score < 10) return 'Mild anxiety symptoms. Consider mindfulness practices and speaking with a counselor if needed.';
      if (score < 15) return 'Moderate anxiety symptoms. We recommend scheduling an appointment with a counselor for support.';
      return 'Severe anxiety symptoms. Please schedule an appointment with a counselor as soon as possible.';
    }
    return 'Please consult with a mental health professional for personalized guidance.';
  };

  const completeScreening = async () => {
    if (!selectedTool || !user) return;

    setIsCompleting(true);

    try {
      const score = calculateScore();
      const recommendations = getRecommendations(selectedTool.name, score);

      const { error } = await supabase
        .from('screening_results')
        .insert({
          user_id: user.id,
          tool: selectedTool.name,
          score,
          responses: answers,
          recommendations
        });

      if (error) throw error;

      setCurrentResult({ score, recommendations });
      setShowResults(true);

      toast({
        title: "Assessment Complete",
        description: "Your results have been saved securely.",
      });

      // Refresh previous results
      fetchPreviousResults();

    } catch (error) {
      console.error('Error saving screening result:', error);
      toast({
        title: "Error",
        description: "Failed to save results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const resetScreening = () => {
    setSelectedTool(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setCurrentResult(null);
  };

  const getScoreLevel = (tool: string, score: number) => {
    if (tool === 'PHQ-9') {
      if (score < 5) return { level: 'Minimal', color: 'secondary' };
      if (score < 10) return { level: 'Mild', color: 'default' };
      if (score < 15) return { level: 'Moderate', color: 'accent' };
      if (score < 20) return { level: 'Moderately Severe', color: 'destructive' };
      return { level: 'Severe', color: 'destructive' };
    } else if (tool === 'GAD-7') {
      if (score < 5) return { level: 'Minimal', color: 'secondary' };
      if (score < 10) return { level: 'Mild', color: 'default' };
      if (score < 15) return { level: 'Moderate', color: 'accent' };
      return { level: 'Severe', color: 'destructive' };
    }
    return { level: 'Unknown', color: 'outline' };
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show screening tool selection
  if (!selectedTool && !showResults) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Mental Health Screening</h1>
          <p className="text-muted-foreground">
            Take a confidential assessment to better understand your mental health
          </p>
        </div>

        {/* Disclaimer */}
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-accent" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• These screenings are for educational purposes and are not diagnostic tools</li>
              <li>• Results are confidential and only accessible by you</li>
              <li>• If you're experiencing a mental health crisis, please contact emergency services</li>
              <li>• Consider booking an appointment with our counselors for professional guidance</li>
            </ul>
          </CardContent>
        </Card>

        {/* Screening Tools */}
        <div className="grid gap-6 md:grid-cols-2">
          {screeningTools.map((tool) => (
            <Card key={tool.name} className="cursor-pointer hover:shadow-medium transition-shadow border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {tool.name === 'PHQ-9' ? (
                    <Heart className="h-5 w-5 mr-2 text-primary" />
                  ) : (
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                  )}
                  {tool.title}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Questions: {tool.questions.length}</p>
                    <p>Time: ~5 minutes</p>
                  </div>
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => setSelectedTool(tool)}
                  >
                    Start {tool.name} Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Previous Results */}
        {previousResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Previous Results
              </CardTitle>
              <CardDescription>
                Your screening history (last 5 results)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previousResults.slice(0, 5).map((result) => {
                  const scoreInfo = getScoreLevel(result.tool, result.score);
                  return (
                    <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{result.tool} Assessment</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(result.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-lg font-bold">Score: {result.score}</div>
                        <Badge variant={scoreInfo.color as any}>
                          {scoreInfo.level}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Show results
  if (showResults && currentResult) {
    const scoreInfo = getScoreLevel(selectedTool?.name || '', currentResult.score);
    
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 mr-2 text-secondary" />
              Assessment Complete
            </CardTitle>
            <CardDescription>
              Your {selectedTool?.name} screening results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">
                Score: {currentResult.score}
              </div>
              <Badge variant={scoreInfo.color as any} className="text-lg px-4 py-2">
                {scoreInfo.level}
              </Badge>
            </div>

            <div className="max-w-2xl mx-auto p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Recommendations:</h3>
              <p className="text-sm text-muted-foreground">
                {currentResult.recommendations}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="hero" onClick={() => window.location.href = '/appointments'}>
                Book Appointment
              </Button>
              <Button variant="outline" onClick={resetScreening}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show current question
  if (selectedTool) {
    const currentQuestion = selectedTool.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedTool.questions.length) * 100;
    const currentAnswer = answers[currentQuestion.id];

    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedTool.title}</CardTitle>
              <Button variant="outline" size="sm" onClick={resetScreening}>
                Exit
              </Button>
            </div>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {selectedTool.questions.length}
            </CardDescription>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Over the last 2 weeks, how often have you been bothered by:
              </h3>
              <p className="text-xl">{currentQuestion.text}</p>
            </div>

            <RadioGroup
              value={currentAnswer?.toString()}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={option.value.toString()} />
                    <Label htmlFor={option.value.toString()} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={currentAnswer === undefined || isCompleting}
              >
                {isCompleting ? 'Saving...' : 
                  currentQuestionIndex === selectedTool.questions.length - 1
                    ? 'Complete Assessment'
                    : 'Next Question'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Screening;