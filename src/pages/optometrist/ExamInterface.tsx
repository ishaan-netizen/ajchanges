import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, User, Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COMPLAINTS = ['Blurring', 'Itching', 'Watery', 'Redness', 'Other'];
const SYSTEMIC = ['Asthma', 'Cardiac', 'Diabetic', 'Other'];
const VISION_DIST = ['6/60', '6/36', '6/24', '6/18', '6/12', '6/9', '6/6'];
const VISION_NEAR = ['N36', 'N24', 'N18', 'N12', 'N10', 'N8', 'N6'];
const DIAGNOSES = ['Refractive Error', 'Cataract', 'Glaucoma', 'Pterygium', 'Conjunctivitis', 'Diabetic Retinopathy', 'Normal', 'Other'];
const MEDICINES = ['Moxifloxacin', 'Tobramycin', 'Carboxymethylcellulose', 'Timolol', 'Other'];
const ANATOMY_FIELDS = ['Conjunctiva', 'Cornea', 'Iris', 'Pupil', 'Lens', 'Fundus'];

interface Props {
  patient: any;
  onBack: () => void;
}

const ExamInterface = ({ patient, onBack }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Step 1: History
  const [complaints, setComplaints] = useState<string[]>([]);
  const [complaintOther, setComplaintOther] = useState('');
  const [wearsGlasses, setWearsGlasses] = useState(false);
  const [systemic, setSystemic] = useState<string[]>([]);
  const [systemicOther, setSystemicOther] = useState('');

  // Step 2: Vision
  const [visionReDist, setVisionReDist] = useState('');
  const [visionLeDist, setVisionLeDist] = useState('');
  const [visionReNear, setVisionReNear] = useState('');
  const [visionLeNear, setVisionLeNear] = useState('');
  const [visionRePinhole, setVisionRePinhole] = useState('');
  const [visionLePinhole, setVisionLePinhole] = useState('');

  // Step 3: Anatomy
  const [anatomy, setAnatomy] = useState<Record<string, { re: string; le: string }>>(
    Object.fromEntries(ANATOMY_FIELDS.map(f => [f.toLowerCase(), { re: 'Normal', le: 'Normal' }]))
  );

  // Step 4: Diagnosis
  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const [diagnosisOther, setDiagnosisOther] = useState('');
  const [glassPowerRe, setGlassPowerRe] = useState('');
  const [glassPowerLe, setGlassPowerLe] = useState('');
  const [medicine, setMedicine] = useState('');
  const [medicineOther, setMedicineOther] = useState('');
  const [referralNeeded, setReferralNeeded] = useState(false);
  const [referralPurpose, setReferralPurpose] = useState('');

  // Eye Images
  const [eyeImageRe, setEyeImageRe] = useState<string | null>(null);
  const [eyeImageLe, setEyeImageLe] = useState<string | null>(null);
  const fileInputRe = useRef<HTMLInputElement>(null);
  const fileInputLe = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleEyeCapture = (eye: 'RE' | 'LE') => {
    const input = eye === 'RE' ? fileInputRe.current : fileInputLe.current;
    input?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, eye: 'RE' | 'LE') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (eye === 'RE') setEyeImageRe(reader.result as string);
      else setEyeImageLe(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleArray = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase
      .from('patients')
      .update({
        chief_complaint: complaints,
        chief_complaint_other: complaintOther,
        wears_glasses: wearsGlasses,
        systemic_disease: systemic,
        systemic_disease_other: systemicOther,
        vision_re_dist: visionReDist,
        vision_le_dist: visionLeDist,
        vision_re_near: visionReNear,
        vision_le_near: visionLeNear,
        vision_re_pinhole: visionRePinhole,
        vision_le_pinhole: visionLePinhole,
        conjunctiva_re: anatomy.conjunctiva.re,
        conjunctiva_le: anatomy.conjunctiva.le,
        cornea_re: anatomy.cornea.re,
        cornea_le: anatomy.cornea.le,
        iris_re: anatomy.iris.re,
        iris_le: anatomy.iris.le,
        pupil_re: anatomy.pupil.re,
        pupil_le: anatomy.pupil.le,
        lens_re: anatomy.lens.re,
        lens_le: anatomy.lens.le,
        fundus_re: anatomy.fundus.re,
        fundus_le: anatomy.fundus.le,
        diagnosis,
        diagnosis_other: diagnosisOther,
        glass_power_re: glassPowerRe,
        glass_power_le: glassPowerLe,
        medicine,
        medicine_other: medicineOther,
        referral_needed: referralNeeded,
        referral_purpose: referralPurpose,
        examined_by: user?.id,
        status: 'Examined',
      })
      .eq('id', patient.id);

    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Examination completed' });
      onBack();
    }
  };

  return (
    <div className="p-4 pb-20 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 px-2"><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-lg font-bold font-heading">Eye Examination</h1>
      </div>

      {/* Patient Summary */}
      <Card className="mb-3 border-primary/20 bg-accent/30">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{patient.full_name}</p>
            <p className="text-xs text-muted-foreground">{patient.unique_id} • {patient.age ? `${patient.age}y` : ''} • {patient.gender || ''}</p>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: History */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3"><CardTitle className="section-header">1. History & Complaints</CardTitle></CardHeader>
        <CardContent className="px-3 pb-3 space-y-3">
          <div>
            <Label className="text-xs mb-2 block">Chief Complaint</Label>
            <div className="flex flex-wrap gap-2">
              {COMPLAINTS.map(c => (
                <label key={c} className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={complaints.includes(c)} onCheckedChange={() => toggleArray(complaints, c, setComplaints)} />
                  {c}
                </label>
              ))}
            </div>
            {complaints.includes('Other') && (
              <Input value={complaintOther} onChange={e => setComplaintOther(e.target.value)} placeholder="Specify other" className="h-8 mt-2 text-xs" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Wears Glasses?</Label>
            <Switch checked={wearsGlasses} onCheckedChange={setWearsGlasses} />
          </div>
          <div>
            <Label className="text-xs mb-2 block">Systemic Disease</Label>
            <div className="flex flex-wrap gap-2">
              {SYSTEMIC.map(s => (
                <label key={s} className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={systemic.includes(s)} onCheckedChange={() => toggleArray(systemic, s, setSystemic)} />
                  {s}
                </label>
              ))}
            </div>
            {systemic.includes('Other') && (
              <Input value={systemicOther} onChange={e => setSystemicOther(e.target.value)} placeholder="Specify other" className="h-8 mt-2 text-xs" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Vision */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3"><CardTitle className="section-header">2. Vision Tests (6/6 Format)</CardTitle></CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div></div>
            <div className="text-center font-medium text-muted-foreground">Right Eye</div>
            <div className="text-center font-medium text-muted-foreground">Left Eye</div>
          </div>
          {[
            { label: 'Distant', values: VISION_DIST, reVal: visionReDist, leVal: visionLeDist, reSet: setVisionReDist, leSet: setVisionLeDist },
            { label: 'Near', values: VISION_NEAR, reVal: visionReNear, leVal: visionLeNear, reSet: setVisionReNear, leSet: setVisionLeNear },
            { label: 'Pin Hole', values: VISION_DIST, reVal: visionRePinhole, leVal: visionLePinhole, reSet: setVisionRePinhole, leSet: setVisionLePinhole },
          ].map(row => (
            <div key={row.label} className="grid grid-cols-3 gap-2 mb-2">
              <Label className="text-xs self-center">{row.label}</Label>
              <Select value={row.reVal} onValueChange={row.reSet}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{row.values.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={row.leVal} onValueChange={row.leSet}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{row.values.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Step 3: Anatomy */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3"><CardTitle className="section-header">3. Eye Anatomy (Slit Lamp)</CardTitle></CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div></div>
            <div className="text-center font-medium text-muted-foreground">RE</div>
            <div className="text-center font-medium text-muted-foreground">LE</div>
          </div>
          {ANATOMY_FIELDS.map(field => {
            const key = field.toLowerCase();
            return (
              <div key={field} className="grid grid-cols-3 gap-2 mb-2 items-center">
                <Label className="text-xs">{field}</Label>
                <div className="flex items-center justify-center gap-1">
                  <Switch
                    checked={anatomy[key].re === 'Abnormal'}
                    onCheckedChange={(v) => setAnatomy(prev => ({ ...prev, [key]: { ...prev[key], re: v ? 'Abnormal' : 'Normal' } }))}
                  />
                  <span className="text-[10px] text-muted-foreground w-6">{anatomy[key].re === 'Normal' ? 'N' : 'Ab'}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Switch
                    checked={anatomy[key].le === 'Abnormal'}
                    onCheckedChange={(v) => setAnatomy(prev => ({ ...prev, [key]: { ...prev[key], le: v ? 'Abnormal' : 'Normal' } }))}
                  />
                  <span className="text-[10px] text-muted-foreground w-6">{anatomy[key].le === 'Normal' ? 'N' : 'Ab'}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Step 3.5: Eye Image Capture */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3"><CardTitle className="section-header">Eye Image Capture</CardTitle></CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-3">
            {(['RE', 'LE'] as const).map(eye => {
              const img = eye === 'RE' ? eyeImageRe : eyeImageLe;
              const setImg = eye === 'RE' ? setEyeImageRe : setEyeImageLe;
              const ref = eye === 'RE' ? fileInputRe : fileInputLe;
              return (
                <div key={eye} className="flex flex-col items-center gap-2">
                  <Label className="text-xs font-medium">{eye === 'RE' ? 'Right Eye' : 'Left Eye'}</Label>
                  {img ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={img} alt={`${eye} capture`} className="w-full h-full object-cover" />
                      <button onClick={() => setImg(null)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEyeCapture(eye)}
                      className="w-full aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
                    >
                      <Camera className="w-6 h-6 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Capture</span>
                    </button>
                  )}
                  <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFileChange(e, eye)} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader className="pb-2 pt-3 px-3"><CardTitle className="section-header">4. Diagnosis & Prescription</CardTitle></CardHeader>
        <CardContent className="px-3 pb-3 space-y-3">
          <div>
            <Label className="text-xs mb-2 block">Final Diagnosis</Label>
            <div className="flex flex-wrap gap-2">
              {DIAGNOSES.map(d => (
                <label key={d} className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={diagnosis.includes(d)} onCheckedChange={() => toggleArray(diagnosis, d, setDiagnosis)} />
                  {d}
                </label>
              ))}
            </div>
            {diagnosis.includes('Other') && (
              <Input value={diagnosisOther} onChange={e => setDiagnosisOther(e.target.value)} placeholder="Specify" className="h-8 mt-2 text-xs" />
            )}
          </div>
          <div>
            <Label className="text-xs mb-2 block">Glass Power</Label>
            <div className="grid grid-cols-3 gap-2 text-xs mb-1">
              <div></div>
              <div className="text-center font-medium text-muted-foreground">RE</div>
              <div className="text-center font-medium text-muted-foreground">LE</div>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <Label className="text-xs">Power</Label>
              <Input value={glassPowerRe} onChange={e => setGlassPowerRe(e.target.value)} placeholder="e.g. +2.5" className="h-8 text-xs" />
              <Input value={glassPowerLe} onChange={e => setGlassPowerLe(e.target.value)} placeholder="e.g. -1.75" className="h-8 text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Medicine</Label>
              <Select value={medicine} onValueChange={setMedicine}>
                <SelectTrigger className="h-8 mt-1 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {MEDICINES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {medicine === 'Other' && (
            <Input value={medicineOther} onChange={e => setMedicineOther(e.target.value)} placeholder="Specify medicine" className="h-8 text-xs" />
          )}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Referral Required?</Label>
            <Switch checked={referralNeeded} onCheckedChange={setReferralNeeded} />
          </div>
          {referralNeeded && (
            <Select value={referralPurpose} onValueChange={setReferralPurpose}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select purpose" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Spectacles">Spectacles</SelectItem>
                <SelectItem value="Further Exam">Further Exam</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={submitting} className="w-full h-11">
        {submitting ? 'Saving...' : 'Complete Examination'}
      </Button>
    </div>
  );
};

export default ExamInterface;
