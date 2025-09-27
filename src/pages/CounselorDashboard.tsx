import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Users, Clock, CheckCircle, AlertCircle, MessageSquare, BookOpen } from 'lucide-react';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  student_id: string;
  notes?: string;
}

interface PeerPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  approved: boolean;
  user_id: string;
}

const CounselorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pendingPosts, setPendingPosts] = useState<PeerPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch appointments for this counselor
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('counselor_id', user?.id)
        .order('appointment_date', { ascending: true })
        .limit(10);

      // Fetch pending peer posts for moderation
      const { data: postsData } = await supabase
        .from('peer_posts')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: true })
        .limit(5);

      setAppointments(appointmentsData || []);
      setPendingPosts(postsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('peer_posts')
        .update({ 
          approved: true, 
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (!error) {
        setPendingPosts(prev => prev.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (!error) {
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId ? { ...apt, status } : apt
          )
        );
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
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

  const todayAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date).toDateString() === new Date().toDateString()
  );

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
        <h1 className="text-3xl font-bold text-foreground">Counselor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your appointments and support students
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {todayAppointments.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {appointments.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Pending Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {pendingPosts.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-trust">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pending Confirmations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-trust">
              {appointments.filter(apt => apt.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appointments Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              Manage your scheduled counseling sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(appointment.status)}
                        <div>
                          <p className="font-medium">
                            {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Student ID: {appointment.student_id.substring(0, 8)}...
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
                    
                    {appointment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        variant="calm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Peer Posts Moderation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Posts Awaiting Approval
            </CardTitle>
            <CardDescription>
              Review and moderate peer support forum posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingPosts.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingPosts.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg space-y-3">
                    <div>
                      <h4 className="font-medium">{post.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.content.substring(0, 150)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Posted: {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleApprovePost(post.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No posts pending approval</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselorDashboard;