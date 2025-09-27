import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MessageSquare, BookOpen, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  counselor_id: string;
  notes?: string;
}

interface ScreeningResult {
  id: string;
  tool: string;
  score: number;
  created_at: string;
  recommendations?: string;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', user?.id)
        .order('appointment_date', { ascending: true })
        .limit(5);

      // Fetch screening results
      const { data: screeningData } = await supabase
        .from('screening_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setAppointments(appointmentsData || []);
      setScreeningResults(screeningData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-accent" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'secondary';
      case 'pending':
        return 'default';
      case 'completed':
        return 'outline';
      default:
        return 'destructive';
    }
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Here's your mental health journey overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {appointments.filter(apt => apt.status === 'confirmed').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Screenings Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {screeningResults.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Chat Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">0</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-trust">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Forum Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-trust">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Appointments
          </CardTitle>
          <CardDescription>
            Your upcoming and recent counseling sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(appointment.status)}
                    <div>
                      <p className="font-medium">
                        {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(appointment.status) as any}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments scheduled</p>
              <Button variant="calm" className="mt-4">
                Book an Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Screening Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Recent Screening Results
          </CardTitle>
          <CardDescription>
            Your mental health assessment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {screeningResults.length > 0 ? (
            <div className="space-y-4">
              {screeningResults.map((result) => {
                const scoreInfo = getScoreLevel(result.tool, result.score);
                return (
                  <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{result.tool} Assessment</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(result.created_at).toLocaleDateString()}
                      </p>
                      {result.recommendations && (
                        <p className="text-sm text-muted-foreground">
                          {result.recommendations.substring(0, 100)}...
                        </p>
                      )}
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
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No screening results yet</p>
              <Button variant="calm" className="mt-4">
                Take a Screening
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;