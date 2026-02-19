import { useState } from 'react';
import RegisterPatientForm from './RegisterPatientForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Users, Activity } from 'lucide-react';
import { useCamp } from '@/contexts/CampContext';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const RegistrarDashboard = () => {
  const { activeCamp } = useCamp();
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  useEffect(() => {
    if (!activeCamp) return;
    const fetchStats = async () => {
      const { count } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('camp_id', activeCamp.id);
      setStats({ total: count || 0, today: count || 0 });
    };
    fetchStats();
  }, [activeCamp]);

  if (showForm) {
    return <RegisterPatientForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="p-4 pb-20 max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-bold font-heading mb-1">Registrar Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-4">{activeCamp?.name}</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Activity className="w-5 h-5 mx-auto text-success mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.today}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => setShowForm(true)} className="w-full h-12 text-base">
        <UserPlus className="w-5 h-5 mr-2" />
        Register New Patient
      </Button>
    </div>
  );
};

export default RegistrarDashboard;
