import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  BookOpen,
  MessageSquare,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalStudents: number;
  totalCounselors: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalScreenings: number;
  totalResources: number;
  pendingPosts: number;
}

interface AppointmentTrend {
  date: string;
  appointments: number;
}

interface ScreeningData {
  tool: string;
  count: number;
  avgScore: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCounselors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalScreenings: 0,
    totalResources: 0,
    pendingPosts: 0,
  });
  const [appointmentTrends, setAppointmentTrends] = useState<AppointmentTrend[]>([]);
  const [screeningData, setScreeningData] = useState<ScreeningData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch aggregated statistics (anonymized)
      const [
        { count: totalStudents },
        { count: totalCounselors },
        { count: totalAppointments },
        { count: pendingAppointments },
        { count: completedAppointments },
        { count: totalScreenings },
        { count: totalResources },
        { count: pendingPosts },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'counselor'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('screening_results').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('peer_posts').select('*', { count: 'exact', head: true }).eq('approved', false),
      ]);

      setStats({
        totalStudents: totalStudents || 0,
        totalCounselors: totalCounselors || 0,
        totalAppointments: totalAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        completedAppointments: completedAppointments || 0,
        totalScreenings: totalScreenings || 0,
        totalResources: totalResources || 0,
        pendingPosts: pendingPosts || 0,
      });

      // Fetch appointment trends for the last 7 days
      const { data: appointmentData } = await supabase
        .from('appointments')
        .select('appointment_date')
        .gte('appointment_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Group appointments by date
      const trends: { [key: string]: number } = {};
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        trends[dateStr] = 0;
        return dateStr;
      }).reverse();

      appointmentData?.forEach(apt => {
        const date = apt.appointment_date;
        if (trends.hasOwnProperty(date)) {
          trends[date]++;
        }
      });

      const trendData = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        appointments: trends[date]
      }));

      setAppointmentTrends(trendData);

      // Fetch aggregated screening data (anonymized)
      const { data: screeningResults } = await supabase
        .from('screening_results')
        .select('tool, score');

      // Aggregate screening data
      const screeningAgg: { [key: string]: { count: number; totalScore: number } } = {};
      screeningResults?.forEach(result => {
        if (!screeningAgg[result.tool]) {
          screeningAgg[result.tool] = { count: 0, totalScore: 0 };
        }
        screeningAgg[result.tool].count++;
        screeningAgg[result.tool].totalScore += result.score;
      });

      const screeningDataFormatted = Object.entries(screeningAgg).map(([tool, data]) => ({
        tool,
        count: data.count,
        avgScore: Math.round(data.totalScore / data.count * 10) / 10
      }));

      setScreeningData(screeningDataFormatted);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusDistribution = [
    { name: 'Completed', value: stats.completedAppointments, color: '#10B981' },
    { name: 'Pending', value: stats.pendingAppointments, color: '#A78BFA' },
    { name: 'Other', value: stats.totalAppointments - stats.completedAppointments - stats.pendingAppointments, color: '#6B7280' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and analytics (all data is anonymized)
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.totalStudents}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              Total Counselors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {stats.totalCounselors}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {stats.totalAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-trust">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Screening Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-trust">
              {stats.totalScreenings}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Resources Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.totalResources}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Pending Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {stats.pendingPosts}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Completed Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {stats.completedAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-trust">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-trust">
              {stats.pendingAppointments}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appointment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Appointment Trends (Last 7 Days)
            </CardTitle>
            <CardDescription>
              Daily appointment scheduling activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appointmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Appointment Status Distribution
            </CardTitle>
            <CardDescription>
              Current status of all appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Screening Results Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Mental Health Screening Overview
          </CardTitle>
          <CardDescription>
            Aggregated screening data (anonymized)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {screeningData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={screeningData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tool" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="count" fill="hsl(var(--primary))" name="Total Tests" />
                <Bar yAxisId="right" dataKey="avgScore" fill="hsl(var(--secondary))" name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No screening data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;