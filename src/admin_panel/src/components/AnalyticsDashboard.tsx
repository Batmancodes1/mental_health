import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import "../index.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Heart,
  BarChart3,
  PieChart as PieChartIcon,
  Home,
  Calendar,
} from "lucide-react";

interface AnalyticsDashboardProps {
  onBackToHome: () => void;
}

// Mock analytics data
const generateMockData = () => {
  const severityData = [
    { severity: "Minimal", count: 45, percentage: 36.3, color: "#22c55e" },
    { severity: "Mild", count: 32, percentage: 25.8, color: "#eab308" },
    { severity: "Moderate", count: 28, percentage: 22.6, color: "#f97316" },
    { severity: "Mod. Severe", count: 12, percentage: 9.7, color: "#ef4444" },
    { severity: "Severe", count: 7, percentage: 5.6, color: "#dc2626" },
  ];

  const demographicData = [
    { category: "Freshman", minimal: 15, mild: 8, moderate: 6, severe: 3 },
    { category: "Sophomore", minimal: 12, mild: 10, moderate: 8, severe: 4 },
    { category: "Junior", minimal: 10, mild: 9, moderate: 9, severe: 6 },
    { category: "Senior", minimal: 8, mild: 5, moderate: 5, severe: 4 },
  ];

  const trendData = [
    { month: "Jan", assessments: 45, averageScore: 8.2 },
    { month: "Feb", assessments: 52, averageScore: 9.1 },
    { month: "Mar", assessments: 48, averageScore: 8.8 },
    { month: "Apr", assessments: 61, averageScore: 9.5 },
    { month: "May", assessments: 58, averageScore: 10.2 },
    { month: "Jun", assessments: 34, averageScore: 7.9 },
  ];

  const riskData = [
    { level: "Low Risk", count: 77, color: "#22c55e" },
    { level: "Medium Risk", count: 28, color: "#eab308" },
    { level: "High Risk", count: 19, color: "#ef4444" },
  ];

  return { severityData, demographicData, trendData, riskData };
};

export default function AnalyticsDashboard({
  onBackToHome,
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("6months");
  const { severityData, demographicData, trendData, riskData } = useMemo(
    () => generateMockData(),
    []
  );

  const totalAssessments = severityData.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const averageScore = 8.9;
  const highRiskCount =
    riskData.find((item) => item.level === "High Risk")?.count || 0;
  const completionRate = 87.3;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-secondary py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Anonymous mental health insights for institutional planning
              </p>
            </div>
            <Button
              onClick={onBackToHome}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Assessments
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {totalAssessments}
                  </p>
                  <p className="text-sm text-success">↗ +12% this month</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Average PHQ-9 Score
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {averageScore}
                  </p>
                  <p className="text-sm text-warning">→ Moderate range</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-warning" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    High Risk Cases
                  </p>
                  <p className="text-3xl font-bold text-destructive">
                    {highRiskCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {((highRiskCount / totalAssessments) * 100).toFixed(1)}% of
                    total
                  </p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Completion Rate
                  </p>
                  <p className="text-3xl font-bold text-success">
                    {completionRate}%
                  </p>
                  <p className="text-sm text-success">↗ +3.2% this month</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-success" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Severity Distribution */}
            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  Depression Severity Distribution
                </h3>
                <PieChartIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {severityData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>
                      {item.severity}: {item.count} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trends Over Time */}
            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Assessment Trends</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">Last 6 months</Badge>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="assessments"
                      stroke="#1f5173"
                      fill="#1f5173"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Demographic Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-6 shadow-medium">
              <h3 className="text-xl font-semibold mb-6">
                Severity by Academic Year
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="minimal" stackId="a" fill="#22c55e" />
                    <Bar dataKey="mild" stackId="a" fill="#eab308" />
                    <Bar dataKey="moderate" stackId="a" fill="#f97316" />
                    <Bar dataKey="severe" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 shadow-medium">
              <h3 className="text-xl font-semibold mb-6">
                Risk Level Distribution
              </h3>
              <div className="space-y-4">
                {riskData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.level}</span>
                      <Badge
                        style={{ backgroundColor: item.color, color: "white" }}
                        className="border-0"
                      >
                        {item.count}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: item.color,
                          width: `${(item.count / totalAssessments) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {((item.count / totalAssessments) * 100).toFixed(1)}% of
                      total assessments
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Insights Section */}
          <Card className="mt-8 p-6 shadow-medium">
            <h3 className="text-xl font-semibold mb-4">
              Key Insights & Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-warning mt-1" />
                  <div>
                    <p className="font-medium">Increasing Assessment Usage</p>
                    <p className="text-sm text-muted-foreground">
                      12% increase in assessments this month indicates growing
                      awareness and engagement with mental health resources.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <p className="font-medium">High-Risk Student Support</p>
                    <p className="text-sm text-muted-foreground">
                      15.3% of students show moderate to severe symptoms.
                      Consider expanding counseling services and outreach
                      programs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Junior Year Vulnerability</p>
                    <p className="text-sm text-muted-foreground">
                      Junior students show higher rates of moderate to severe
                      symptoms. Targeted interventions during this period may be
                      beneficial.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-success mt-1" />
                  <div>
                    <p className="font-medium">Strong Completion Rates</p>
                    <p className="text-sm text-muted-foreground">
                      87.3% completion rate suggests students find the
                      assessment valuable and user-friendly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground">
              <strong>Privacy Notice:</strong> All data shown is anonymized and
              aggregated. No personal information is stored or displayed. This
              dashboard helps institutional planning while maintaining complete
              student privacy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
