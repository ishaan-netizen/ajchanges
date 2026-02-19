import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCamp } from '@/contexts/CampContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const RecordsPage = () => {
  const { activeCamp } = useCamp();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeCamp) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('patients')
        .select('*')
        .eq('camp_id', activeCamp.id)
        .order('created_at', { ascending: false });
      setPatients(data || []);
      setLoading(false);
    };
    fetch();
  }, [activeCamp]);

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.unique_id?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  const statusColor = (s: string) => {
    switch (s) {
      case 'Registered': return 'status-registered';
      case 'Examined': return 'status-examined';
      case 'Completed': return 'status-completed';
      default: return 'status-registered';
    }
  };

  return (
    <div className="p-4 pb-20 max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-bold font-heading mb-4">Patient Records</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, ID, or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
      </div>

      <p className="text-xs text-muted-foreground mb-2">{filtered.length} patients</p>

      <div className="space-y-2">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No records found</p>
        ) : (
          filtered.map(p => (
            <Card key={p.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">{p.unique_id} • {p.age ? `${p.age}y` : ''} {p.gender || ''}</p>
                </div>
                <span className={cn('status-badge', statusColor(p.status))}>{p.status}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RecordsPage;
