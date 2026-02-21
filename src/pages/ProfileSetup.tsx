import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserProfile } from '@/store/authStore';
import { saveProfile } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, MapPin, CreditCard, Users, ArrowRight, Wheat } from 'lucide-react';

const ProfileSetup = () => {
  const { user, setProfile } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    rationCardNumber: '',
    cardType: '' as UserProfile['cardType'],
    familyMembers: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const profile: UserProfile = { ...form, notificationsEnabled: true };
    const saved = await saveProfile(user.uid, profile);
    if (saved) {
      setProfile(profile);
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg space-y-6 animate-fade-in-up">
        <div className="text-center">
          <div className="gradient-primary mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
            <Wheat className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="mt-1 text-muted-foreground">We need a few details to set up your ration dashboard</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Enter your full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Your address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="pl-10" required />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ration Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="e.g., KL123456" value={form.rationCardNumber} onChange={(e) => setForm({ ...form, rationCardNumber: e.target.value })} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Card Type</Label>
                <Select value={form.cardType} onValueChange={(v) => setForm({ ...form, cardType: v as UserProfile['cardType'] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APL">APL (Above Poverty Line)</SelectItem>
                    <SelectItem value="BPL">BPL (Below Poverty Line)</SelectItem>
                    <SelectItem value="AAY">AAY (Antyodaya)</SelectItem>
                    <SelectItem value="Priority">Priority Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Family Members</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="number" min={1} max={20} value={form.familyMembers} onChange={(e) => setForm({ ...form, familyMembers: Number(e.target.value) })} className="pl-10" required />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !form.cardType}>
              {loading ? 'Saving...' : 'Complete Setup'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
