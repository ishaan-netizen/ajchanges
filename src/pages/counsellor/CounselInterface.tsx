import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCamp } from '@/contexts/CampContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Eye, FileText, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Props { patient: any; onBack: () => void; }

const CounselInterface = ({ patient, onBack }: Props) => {
  const { user } = useAuth();
  const { activeCamp } = useCamp();
  const { toast } = useToast();

  // Spectacle
  const [spectaclesGiven, setSpectaclesGiven] = useState(false);
  const [spectaclesPower, setSpectaclesPower] = useState(patient.glass_power || '');
  const [paymentType, setPaymentType] = useState('Free');
  const [amountCollected, setAmountCollected] = useState('');

  // Referral
  const [referralCenter, setReferralCenter] = useState(activeCamp?.base_hospital || '');
  const [advanceCollected, setAdvanceCollected] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [showReferralSlip, setShowReferralSlip] = useState(false);
  const [referralId, setReferralId] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    const refId = patient.referral_needed ? `REF-${Date.now().toString(36).toUpperCase()}` : null;

    const { error } = await supabase
      .from('patients')
      .update({
        spectacles_given: spectaclesGiven,
        spectacles_power: spectaclesPower,
        spectacles_payment_type: paymentType,
        amount_collected: amountCollected ? parseFloat(amountCollected) : 0,
        referral_center: referralCenter,
        advance_collected: advanceCollected,
        advance_amount: advanceAmount ? parseFloat(advanceAmount) : 0,
        referral_id: refId,
        counselled_by: user?.id,
        status: 'Completed',
      })
      .eq('id', patient.id);

    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      if (refId) {
        setReferralId(refId);
        setShowReferralSlip(true);
      } else {
        toast({ title: 'Counselling completed' });
        onBack();
      }
    }
  };

  return (
    <div className="p-4 pb-20 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 px-2"><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-lg font-bold font-heading">Counselling</h1>
      </div>

      {/* Patient Summary */}
      <Card className="mb-3 border-primary/20 bg-accent/30">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{patient.full_name}</p>
            <p className="text-xs text-muted-foreground">{patient.unique_id} • {patient.age ? `${patient.age}y` : ''}</p>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Summary */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3"><CardTitle className="section-header">Clinical Summary</CardTitle></CardHeader>
        <CardContent className="px-3 pb-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Diagnosis</span>
            <span className="font-medium">{patient.diagnosis?.join(', ') || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vision RE/LE (Dist)</span>
            <span className="font-medium">{patient.vision_re_dist || '—'} / {patient.vision_le_dist || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Glass Power</span>
            <span className="font-medium">{patient.glass_power || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Referral Flagged</span>
            <span className="font-medium">{patient.referral_needed ? `Yes — ${patient.referral_purpose}` : 'No'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Section A: Spectacles */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3"><CardTitle className="section-header">A. Spectacle Distribution</CardTitle></CardHeader>
        <CardContent className="px-3 pb-3 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Spectacles Given?</Label>
            <Switch checked={spectaclesGiven} onCheckedChange={setSpectaclesGiven} />
          </div>
          {spectaclesGiven && (
            <>
              <div>
                <Label className="text-xs">Power (from exam)</Label>
                <Input value={spectaclesPower} onChange={e => setSpectaclesPower(e.target.value)} className="h-8 mt-1 text-xs" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Payment</Label>
                <Tabs value={paymentType} onValueChange={setPaymentType}>
                  <TabsList className="w-full h-8">
                    <TabsTrigger value="Free" className="flex-1 text-xs h-7">Free</TabsTrigger>
                    <TabsTrigger value="Paid" className="flex-1 text-xs h-7">Paid</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {paymentType === 'Paid' && (
                <div>
                  <Label className="text-xs">Amount Collected (₹)</Label>
                  <Input type="number" value={amountCollected} onChange={e => setAmountCollected(e.target.value)} placeholder="0" className="h-8 mt-1 text-xs" />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Section B: Surgery/Referral */}
      {patient.referral_needed && (
        <Card className="mb-4">
          <CardHeader className="pb-2 pt-3 px-3"><CardTitle className="section-header">B. Surgery / Referral</CardTitle></CardHeader>
          <CardContent className="px-3 pb-3 space-y-3">
            <div>
              <Label className="text-xs">Referral Destination</Label>
              <Input value={referralCenter} onChange={e => setReferralCenter(e.target.value)} className="h-8 mt-1 text-xs" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Advance Collected?</Label>
              <Switch checked={advanceCollected} onCheckedChange={setAdvanceCollected} />
            </div>
            {advanceCollected && (
              <div>
                <Label className="text-xs">Amount (₹)</Label>
                <Input type="number" value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} placeholder="0" className="h-8 mt-1 text-xs" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSubmit} disabled={submitting} className="w-full h-11">
        <FileText className="w-4 h-4 mr-2" />
        {submitting ? 'Saving...' : patient.referral_needed ? 'Generate Referral & Close' : 'Complete Counselling'}
      </Button>

      {/* Referral Slip Dialog */}
      <Dialog open={showReferralSlip} onOpenChange={v => { setShowReferralSlip(v); if (!v) onBack(); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Referral Slip</DialogTitle>
          </DialogHeader>
          <div className="border border-border rounded-lg p-4 space-y-2 text-sm">
            <div className="text-center border-b border-border pb-2 mb-2">
              <p className="font-bold">Akhand Jyoti Eye Outreach</p>
              <p className="text-xs text-muted-foreground">Referral Document</p>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ref ID:</span><span className="font-medium">{referralId}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Patient:</span><span className="font-medium">{patient.full_name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">UID:</span><span className="font-medium">{patient.unique_id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Age/Gender:</span><span className="font-medium">{patient.age}y / {patient.gender}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Diagnosis:</span><span className="font-medium">{patient.diagnosis?.join(', ')}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Purpose:</span><span className="font-medium">{patient.referral_purpose}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Referred To:</span><span className="font-medium">{referralCenter}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Camp:</span><span className="font-medium">{activeCamp?.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="font-medium">{new Date().toLocaleDateString()}</span></div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1" /> Print
            </Button>
            <Button className="flex-1" onClick={() => { setShowReferralSlip(false); onBack(); }}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CounselInterface;
