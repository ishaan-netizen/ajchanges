import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCamp } from '@/contexts/CampContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, User, Stethoscope } from 'lucide-react';
import ExamInterface from './ExamInterface';

const OptometristDashboard = () => {
  const { activeCamp } = useCamp();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    if (!activeCamp) return;
    setLoading(true);
    const { data } = await supabase
      .from('patients')
      .select('*')
      .eq('camp_id', activeCamp.id)
      .eq('status', 'Registered')
      .order('created_at', { ascending: true });
    setPatients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQueue(); }, [activeCamp]);

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) || p.unique_id?.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedPatient) {
    return <ExamInterface patient={selectedPatient} onBack={() => { setSelectedPatient(null); fetchQueue(); }} />;
  }

  return (
    <div className="p-4 pb-20 max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-bold font-heading mb-1">Optometrist</h1>
      <p className="text-sm text-muted-foreground mb-4">Patient Queue — {filtered.length} waiting</p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
      </div>

      <div className="space-y-2">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading queue...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No patients in queue</p>
        ) : (
          filtered.map(p => (
            <Card key={p.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedPatient(p)}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">{p.unique_id} • {p.age ? `${p.age}y` : ''} {p.gender || ''}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">
                  <Stethoscope className="w-3.5 h-3.5 mr-1" /> Exam
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OptometristDashboard;
