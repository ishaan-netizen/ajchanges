import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCamp } from '@/contexts/CampContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Search, Building } from 'lucide-react';

interface CampRow {
  id: string;
  camp_code: string;
  name: string;
  date: string;
  vertical: string;
  district: string;
  block: string;
  state: string;
  village: string;
  base_hospital: string;
  status: string;
}

const CampSelectPage = () => {
  const { setActiveCamp } = useCamp();
  const [camps, setCamps] = useState<CampRow[]>([]);
  const [filtered, setFiltered] = useState<CampRow[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [districtFilter, setDistrictFilter] = useState('all');
  const [verticalFilter, setVerticalFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCamps = async () => {
      const { data } = await supabase.from('camps').select('*').order('date', { ascending: false });
      if (data) {
        setCamps(data as CampRow[]);
        setFiltered(data as CampRow[]);
      }
      setLoading(false);
    };
    fetchCamps();
  }, []);

  useEffect(() => {
    let result = camps;
    if (dateFilter) result = result.filter(c => c.date === dateFilter);
    if (districtFilter && districtFilter !== 'all') result = result.filter(c => c.district === districtFilter);
    if (verticalFilter && verticalFilter !== 'all') result = result.filter(c => c.vertical === verticalFilter);
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.camp_code?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [camps, dateFilter, districtFilter, verticalFilter, search]);

  const districts = [...new Set(camps.map(c => c.district).filter(Boolean))];
  const verticals = [...new Set(camps.map(c => c.vertical).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold font-heading text-foreground">Select Camp</h1>
          <p className="text-sm text-muted-foreground">No camp assigned for today. Select manually.</p>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search camps..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="h-9 text-xs" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">District</Label>
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {districts.map(d => <SelectItem key={d} value={d!}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Vertical</Label>
              <Select value={verticalFilter} onValueChange={setVerticalFilter}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {verticals.map(v => <SelectItem key={v} value={v!}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Camp List */}
        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading camps...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No camps found</p>
          ) : (
            filtered.map(camp => (
              <Card key={camp.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveCamp(camp)}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{camp.name}</p>
                      <p className="text-xs text-muted-foreground">{camp.camp_code}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />{camp.district}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />{camp.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Building className="w-3 h-3" />{camp.vertical}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 ml-2 text-xs">Select</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CampSelectPage;
