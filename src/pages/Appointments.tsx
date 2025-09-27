import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface Counselor {
  id: string;
  profiles: {
    full_name: string;
  };
  specialization?: string;
  bio?: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  counselor_id: string;
  notes?: string;
  counselors?: {
    profiles: {
      full_name: string;
    };
    specialization?: string;
  } | null;
}

const Appointments = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    counselor_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch counselors with their profiles
      const { data: counselorsData } = await supabase
        .from('counselors')
        .select(`
          id,
          specialization,
          bio,
          profiles!inner(full_name)
        `);

      setCounselors(counselorsData || []);

      // Fetch user's appointments if student
      if (userRole === 'student') {
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select(`
            *,
            counselors(
              profiles(full_name),
              specialization
            )
          `)
          .eq('student_id', user?.id)
          .order('appointment_date', { ascending: true });

        setAppointments((appointmentsData as any) || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.counselor_id || !bookingForm.appointment_date || !bookingForm.appointment_time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          student_id: user?.id,
          counselor_id: bookingForm.counselor_id,
          appointment_date: bookingForm.appointment_date,
          appointment_time: bookingForm.appointment_time,
          notes: bookingForm.notes,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Appointment booked successfully. You will receive a confirmation email.",
      });

      // Reset form
      setBookingForm({
        counselor_id: '',
        appointment_date: '',
        appointment_time: '',
        notes: ''
      });

      // Refresh appointments
      fetchData();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
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

  // Generate time slots
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

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

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground">
          {userRole === 'student' 
            ? 'Book appointments with our counselors and manage your sessions'
            : 'Manage your counseling appointments'
          }
        </p>
      </div>

      {userRole === 'student' && (
        <>
          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Book New Appointment
              </CardTitle>
              <CardDescription>
                Schedule a confidential session with one of our counselors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="counselor">Select Counselor *</Label>
                    <Select
                      value={bookingForm.counselor_id}
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, counselor_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a counselor" />
                      </SelectTrigger>
                      <SelectContent>
                        {counselors.map((counselor) => (
                          <SelectItem key={counselor.id} value={counselor.id}>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <div>
                                <div className="font-medium">{counselor.profiles.full_name}</div>
                                {counselor.specialization && (
                                  <div className="text-sm text-muted-foreground">
                                    {counselor.specialization}
                                  </div>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={bookingForm.appointment_date}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, appointment_date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time *</Label>
                    <Select
                      value={bookingForm.appointment_time}
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, appointment_time: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific concerns or topics you'd like to discuss..."
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto" variant="hero">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                My Appointments
              </CardTitle>
              <CardDescription>
                View and manage your scheduled sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(appointment.status)}
                          <div>
                            <p className="font-medium">
                              {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })} at {appointment.appointment_time}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Counselor: {appointment.counselors?.profiles.full_name}
                            </p>
                            {appointment.counselors?.specialization && (
                              <p className="text-sm text-muted-foreground">
                                Specialization: {appointment.counselors.specialization}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant={getStatusColor(appointment.status) as any}>
                          {appointment.status}
                        </Badge>
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Notes:</p>
                          <p className="text-sm">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments scheduled</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Book your first appointment using the form above
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Available Counselors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Our Counselors
          </CardTitle>
          <CardDescription>
            Meet our team of professional mental health counselors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {counselors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {counselors.map((counselor) => (
                <Card key={counselor.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{counselor.profiles.full_name}</CardTitle>
                    {counselor.specialization && (
                      <CardDescription>{counselor.specialization}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {counselor.bio && (
                      <p className="text-sm text-muted-foreground">{counselor.bio}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No counselors available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;