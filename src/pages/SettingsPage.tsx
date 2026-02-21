import { useState, useEffect } from 'react';
import { useAuthStore, UserProfile } from '@/store/authStore';
import { updateProfile } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, User, Save, Bell } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { user, profile, setProfile } = useAuthStore();
  const [form, setForm] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ ...profile });
  }, [profile]);

  const handleSave = async () => {
    if (!user || !form) return;
    setSaving(true);
    const saved = await updateProfile(user.uid, form);
    if (saved) {
      setProfile(form);
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  if (!form) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Profile section */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5 text-primary" /> Profile Information
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Ration Card Number</Label>
            <Input value={form.rationCardNumber} onChange={(e) => setForm({ ...form, rationCardNumber: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Card Type</Label>
            <Select value={form.cardType} onValueChange={(v) => setForm({ ...form, cardType: v as UserProfile['cardType'] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="APL">APL</SelectItem>
                <SelectItem value="BPL">BPL</SelectItem>
                <SelectItem value="AAY">AAY</SelectItem>
                <SelectItem value="Priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Family Members</Label>
            <Input type="number" min={1} value={form.familyMembers} onChange={(e) => setForm({ ...form, familyMembers: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-5 w-5 text-primary" /> Notifications
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Push Alerts</p>
            <p className="text-sm text-muted-foreground">Receive alerts for ration updates and reminders</p>
          </div>
          <Switch
            checked={form.notificationsEnabled}
            onCheckedChange={(v) => setForm({ ...form, notificationsEnabled: v })}
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="gap-2">
        <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default SettingsPage;
