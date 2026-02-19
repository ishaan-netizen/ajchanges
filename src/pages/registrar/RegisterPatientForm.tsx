import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCamp } from '@/contexts/CampContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Camera, Search, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Props { onBack: () => void; }

const RegisterPatientForm = ({ onBack }: Props) => {
  const { user } = useAuth();
  const { activeCamp } = useCamp();
  const { toast } = useToast();

  const [patientType, setPatientType] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneRelationship, setPhoneRelationship] = useState('Self');
  const [dob, setDob] = useState('');
  const [dobStatus, setDobStatus] = useState('Self Declared');
  const [age, setAge] = useState('');
  const [idProofType, setIdProofType] = useState('None');
  const [idProofNumber, setIdProofNumber] = useState('');

  // Address (pre-filled from camp)
  const [addressDoor, setAddressDoor] = useState('');
  const [addressVillage, setAddressVillage] = useState(activeCamp?.village || '');
  const [addressBlock, setAddressBlock] = useState(activeCamp?.block || '');
  const [addressDistrict, setAddressDistrict] = useState(activeCamp?.district || '');
  const [addressState, setAddressState] = useState(activeCamp?.state || 'Bihar');
  const [addressPincode, setAddressPincode] = useState('');

  const [consentGiven, setConsentGiven] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [createdId, setCreatedId] = useState('');

  // Auto-calculate age from DOB
  const handleDobChange = (val: string) => {
    setDob(val);
    if (val) {
      const birthDate = new Date(val);
      const ageYears = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      setAge(String(ageYears));
    }
  };

  const isGuardianRequired = age !== '' && parseInt(age) < 18;

  const handleSearch = async () => {
    if (!searchQuery || !activeCamp) return;
    const { data } = await supabase
      .from('patients')
      .select('*')
      .or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,unique_id.ilike.%${searchQuery}%,id_proof_number.ilike.%${searchQuery}%`)
      .limit(10);
    setSearchResults(data || []);
  };

  const selectExisting = (p: any) => {
    setFullName(p.full_name || '');
    setGender(p.gender || '');
    setGuardianName(p.guardian_name || '');
    setPhone(p.phone || '');
    setDob(p.dob || '');
    setAge(p.age ? String(p.age) : '');
    setIdProofNumber(p.id_proof_number || '');
    setAddressVillage(p.address_village || '');
    setAddressBlock(p.address_block || '');
    setAddressDistrict(p.address_district || '');
    setAddressState(p.address_state || '');
    setAddressPincode(p.address_pincode || '');
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = async () => {
    if (!fullName || !consentGiven || !activeCamp || !user) return;
    if (isGuardianRequired && !guardianName) {
      toast({ title: 'Guardian name is required for patients under 18', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from('patients')
      .insert({
        camp_id: activeCamp.id,
        patient_type: patientType,
        full_name: fullName,
        gender,
        guardian_name: guardianName,
        phone,
        phone_relationship: phoneRelationship,
        dob: dob || null,
        dob_status: dobStatus,
        age: age ? parseInt(age) : null,
        id_proof_type: idProofType,
        id_proof_number: idProofNumber,
        address_door: addressDoor,
        address_village: addressVillage,
        address_block: addressBlock,
        address_district: addressDistrict,
        address_state: addressState,
        address_pincode: addressPincode,
        consent_given: consentGiven,
        registered_by: user.id,
        status: 'Registered',
      })
      .select('unique_id')
      .single();

    setSubmitting(false);

    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
    } else {
      setCreatedId(data?.unique_id || '');
      setShowIdModal(true);
    }
  };

  return (
    <div className="p-4 pb-20 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 px-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-bold font-heading">Register Patient</h1>
      </div>

      {/* Section 1: Patient Type */}
      <Card className="mb-3">
        <CardContent className="p-3">
          <Tabs value={patientType} onValueChange={setPatientType}>
            <TabsList className="w-full">
              <TabsTrigger value="New" className="flex-1">New</TabsTrigger>
              <TabsTrigger value="Existing" className="flex-1">Existing</TabsTrigger>
            </TabsList>
          </Tabs>

          {patientType === 'Existing' && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                <Input placeholder="Search name, mobile, Aadhar, ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-9" />
                <Button size="sm" onClick={handleSearch} className="h-9 px-3"><Search className="w-4 h-4" /></Button>
              </div>
              {searchResults.length > 0 && (
                <div className="border border-border rounded-md overflow-hidden">
                  {searchResults.map(p => (
                    <button key={p.id} onClick={() => selectExisting(p)} className="w-full text-left px-3 py-2 text-sm hover:bg-accent border-b last:border-0 border-border">
                      <span className="font-medium">{p.full_name}</span>
                      <span className="text-muted-foreground"> — {p.phone || 'No phone'} — {p.unique_id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Demographics */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="section-header">Demographics & ID</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-3">
          <div>
            <Label className="text-xs">Full Name *</Label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Patient full name" className="h-9 mt-1" />
          </div>
          <div>
            <Label className="text-xs">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Parent / Spouse Name {isGuardianRequired && <span className="text-destructive">*</span>}</Label>
            <Input value={guardianName} onChange={e => setGuardianName(e.target.value)} placeholder="Guardian name" className="h-9 mt-1" />
            {isGuardianRequired && <p className="text-xs text-destructive mt-1">Required for patients under 18</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile" className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Relationship</Label>
              <Select value={phoneRelationship} onValueChange={setPhoneRelationship}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Self', 'Parent', 'Spouse', 'Child', 'Other'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Date of Birth</Label>
              <Input type="date" value={dob} onChange={e => handleDobChange(e.target.value)} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">DOB Status</Label>
              <Select value={dobStatus} onValueChange={setDobStatus}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Self Declared">Self Declared</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Age (auto-calculated)</Label>
            <Input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" className="h-9 mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">ID Proof</Label>
              <Select value={idProofType} onValueChange={setIdProofType}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aadhar">Aadhar</SelectItem>
                  <SelectItem value="PAN">PAN</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">ID Number</Label>
              <Input value={idProofNumber} onChange={e => setIdProofNumber(e.target.value)} placeholder="Number" className="h-9 mt-1" disabled={idProofType === 'None'} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Address */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="section-header">Address (Pre-filled from camp)</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-3">
          <div>
            <Label className="text-xs">Door / Street</Label>
            <Input value={addressDoor} onChange={e => setAddressDoor(e.target.value)} placeholder="Door / Street" className="h-9 mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Village / Area</Label>
              <Input value={addressVillage} onChange={e => setAddressVillage(e.target.value)} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Block</Label>
              <Input value={addressBlock} onChange={e => setAddressBlock(e.target.value)} className="h-9 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">District</Label>
              <Input value={addressDistrict} onChange={e => setAddressDistrict(e.target.value)} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">State</Label>
              <Input value={addressState} onChange={e => setAddressState(e.target.value)} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">PinCode</Label>
              <Input value={addressPincode} onChange={e => setAddressPincode(e.target.value)} className="h-9 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Image Capture */}
      <Card className="mb-3">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="section-header">Image Capture</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex-col gap-1">
              <Camera className="w-5 h-5" />
              <span className="text-xs">Aadhar Photo</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-1">
              <Camera className="w-5 h-5" />
              <span className="text-xs">Patient Photo</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Consent */}
      <Card className="mb-4">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="section-header">Consent & Signature</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-3">
          <div className="flex items-start gap-2">
            <Checkbox id="consent" checked={consentGiven} onCheckedChange={(v) => setConsentGiven(v === true)} className="mt-0.5" />
            <Label htmlFor="consent" className="text-xs leading-relaxed cursor-pointer">
              Patient confirms understanding of the registration form and consents to examination.
            </Label>
          </div>
          <Button variant="outline" className="w-full h-14 flex-col gap-1">
            <span className="text-xs text-muted-foreground">Capture Signature / Thumbprint</span>
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={!fullName || !consentGiven || submitting} className="w-full h-11">
        {submitting ? 'Registering...' : 'Register Patient'}
      </Button>

      {/* ID Modal */}
      <Dialog open={showIdModal} onOpenChange={(v) => { setShowIdModal(v); if (!v) onBack(); }}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center">Patient Registered</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
            <p className="text-2xl font-bold font-heading text-foreground">{createdId}</p>
          </div>
          <Button onClick={() => { setShowIdModal(false); onBack(); }} className="w-full">Done</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterPatientForm;
