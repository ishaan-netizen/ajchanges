import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Camp {
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

interface CampState {
  activeCamp: Camp | null;
  setActiveCamp: (camp: Camp | null) => void;
  loading: boolean;
  needsSelection: boolean;
}

const CampContext = createContext<CampState | undefined>(undefined);

export const CampProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeCamp, setActiveCamp] = useState<Camp | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSelection, setNeedsSelection] = useState(false);

  useEffect(() => {
    if (!user) {
      setActiveCamp(null);
      setLoading(false);
      return;
    }

    const checkAssignment = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data: assignment } = await supabase
        .from('camp_assignments')
        .select('camp_id')
        .eq('user_id', user.id)
        .eq('assignment_date', today)
        .maybeSingle();

      if (assignment?.camp_id) {
        const { data: camp } = await supabase
          .from('camps')
          .select('*')
          .eq('id', assignment.camp_id)
          .single();
        if (camp) {
          setActiveCamp(camp as Camp);
          setNeedsSelection(false);
          setLoading(false);
          return;
        }
      }
      
      setNeedsSelection(true);
      setLoading(false);
    };

    checkAssignment();
  }, [user]);

  return (
    <CampContext.Provider value={{ activeCamp, setActiveCamp: (camp) => { setActiveCamp(camp); setNeedsSelection(false); }, loading, needsSelection }}>
      {children}
    </CampContext.Provider>
  );
};

export const useCamp = () => {
  const ctx = useContext(CampContext);
  if (!ctx) throw new Error('useCamp must be used within CampProvider');
  return ctx;
};
