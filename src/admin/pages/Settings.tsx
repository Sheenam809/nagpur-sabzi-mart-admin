import { useState } from 'react';
import {
  Settings as SettingsIcon, Store, Bell, Shield, Truck,
  Globe, CreditCard, Users, ChevronRight, Check, AlertTriangle,
  X, Eye, EyeOff
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { cn } from '../../lib/utils';

const sections = [
  { id: 'store', label: 'Store Details', icon: Store },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'delivery', label: 'Delivery Zones', icon: Truck },
  { id: 'payments', label: 'Payment Gateways', icon: CreditCard },
  { id: 'team', label: 'Team & Roles', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'localization', label: 'Localization', icon: Globe },
];

const initialZones = [
  { name: 'Dharampeth', active: true, fee: '20', minOrder: '100' },
  { name: 'Civil Lines', active: true, fee: '20', minOrder: '100' },
  { name: 'Sitabuldi', active: true, fee: '25', minOrder: '100' },
  { name: 'Ramdaspeth', active: true, fee: '20', minOrder: '100' },
  { name: 'Sadar', active: true, fee: '25', minOrder: '100' },
  { name: 'Manewada', active: false, fee: '35', minOrder: '150' },
  { name: 'Wardha Road', active: false, fee: '40', minOrder: '200' },
];

type Zone = { name: string; active: boolean; fee: string; minOrder: string };

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-10 rounded-full transition-colors duration-200 shrink-0',
        enabled ? 'bg-primary' : 'bg-muted'
      )}
      style={{ height: '22px' }}
    >
      <span className={cn(
        'absolute bg-white rounded-full shadow-sm transition-transform duration-200',
        enabled ? 'translate-x-5' : 'translate-x-0.5'
      )} style={{ width: '18px', height: '18px', top: '2px' }} />
    </button>
  );
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all animate-in fade-in slide-in-from-bottom-4',
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    )}>
      {type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {message}
    </div>
  );
}

// Zone Modal
function ZoneModal({
  zone,
  onClose,
  onSave,
}: {
  zone: Zone | null;
  onClose: () => void;
  onSave: (z: Zone) => void;
}) {
  const [form, setForm] = useState<Zone>(
    zone ?? { name: '', active: true, fee: '', minOrder: '' }
  );
  const [errors, setErrors] = useState<Partial<Zone>>({});

  const validate = () => {
    const e: Partial<Zone> = {};
    if (!form.name.trim()) e.name = 'Zone name is required';
    if (!form.fee || isNaN(Number(form.fee))) e.fee = 'Valid delivery fee required';
    if (!form.minOrder || isNaN(Number(form.minOrder))) e.minOrder = 'Valid min order required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4 mx-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {zone ? 'Edit Zone' : 'Add Delivery Zone'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Zone Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Dharampeth"
              className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Delivery Fee (₹)</label>
              <input
                type="number"
                value={form.fee}
                onChange={e => setForm(p => ({ ...p, fee: e.target.value }))}
                placeholder="e.g. 25"
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
              />
              {errors.fee && <p className="text-xs text-red-500 mt-1">{errors.fee}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Min Order (₹)</label>
              <input
                type="number"
                value={form.minOrder}
                onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))}
                placeholder="e.g. 100"
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
              />
              {errors.minOrder && <p className="text-xs text-red-500 mt-1">{errors.minOrder}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Zone Active</p>
              <p className="text-xs text-muted-foreground">Enable delivery to this zone</p>
            </div>
            <Toggle enabled={form.active} onChange={v => setForm(p => ({ ...p, active: v }))} />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {zone ? 'Save Changes' : 'Add Zone'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('store');
  const [saved, setSaved] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Notifications
  const [notifs, setNotifs] = useState({
    newOrder: true, orderStatus: true, lowStock: true,
    reviews: true, payments: true, bulkOrders: true,
    sms: false, email: true, push: true,
  });

  // Payment Gateways
  const [gateways, setGateways] = useState([
    { name: 'Razorpay', connected: true, icon: '💳', desc: 'Primary gateway for UPI, Cards, Wallets' },
    { name: 'Cash on Delivery', connected: true, icon: '💵', desc: 'Accept payments at delivery' },
    { name: 'Paytm Business', connected: false, icon: '📱', desc: 'Paytm UPI and Paytm Wallet' },
    { name: 'PhonePe', connected: false, icon: '📞', desc: 'PhonePe UPI payments' },
  ]);

  // Team
  const [teamMembers] = useState([
    { name: 'Admin', role: 'Super Admin', email: 'admin@nagpursabzimart.in' },
  ]);

  // Delivery Zones
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [zoneModal, setZoneModal] = useState<{ open: boolean; zone: Zone | null; index: number | null }>({
    open: false, zone: null, index: null,
  });

  const handleSaveZone = (z: Zone) => {
    if (zoneModal.index !== null) {
      setZones(prev => prev.map((zone, i) => i === zoneModal.index ? z : zone));
      showToast(`Zone "${z.name}" updated successfully`);
    } else {
      setZones(prev => [...prev, z]);
      showToast(`Zone "${z.name}" added successfully`);
    }
    setZoneModal({ open: false, zone: null, index: null });
  };

  const handleDeleteZone = (index: number) => {
    const name = zones[index].name;
    setZones(prev => prev.filter((_, i) => i !== index));
    showToast(`Zone "${name}" removed`);
  };

  // Security
  const [securityToggles, setSecurityToggles] = useState({
    twoFactor: true, sessionTimeout: true, loginNotifs: true, ipWhitelist: false,
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, newPass: false, confirm: false });
  const [passErrors, setPassErrors] = useState<Record<string, string>>({});

  const handleUpdatePassword = () => {
    const errs: Record<string, string> = {};
    if (!passwords.current) errs.current = 'Current password is required';
    if (!passwords.newPass) errs.newPass = 'New password is required';
    else if (passwords.newPass.length < 8) errs.newPass = 'Password must be at least 8 characters';
    if (!passwords.confirm) errs.confirm = 'Please confirm your new password';
    else if (passwords.newPass !== passwords.confirm) errs.confirm = 'Passwords do not match';
    setPassErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // API call
    fetch('/api/auth/change-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to update password');
        }
        setPasswords({ current: '', newPass: '', confirm: '' });
        setPassErrors({});
        showToast('Password updated successfully');
      })
      .catch(err => showToast(err.message, 'error'));
  };

  // Localization
  const [locale, setLocale] = useState({
    language: localStorage.getItem('app_language') || 'English',
    timezone: localStorage.getItem('app_timezone') || 'Asia/Kolkata',
    currency: localStorage.getItem('app_currency') || 'INR',
    dateFormat: localStorage.getItem('app_date_format') || 'DD/MM/YYYY',
  });

  const handleSaveLocalization = () => {
    localStorage.setItem('app_language', locale.language);
    localStorage.setItem('app_timezone', locale.timezone);
    localStorage.setItem('app_currency', locale.currency);
    localStorage.setItem('app_date_format', locale.dateFormat);
    showToast('Localization settings saved');
  };

  const handleSave = () => {
    setSaved(true);
    showToast('Settings saved successfully');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {zoneModal.open && (
        <ZoneModal
          zone={zoneModal.zone}
          onClose={() => setZoneModal({ open: false, zone: null, index: null })}
          onSave={handleSaveZone}
        />
      )}

      <PageHeader title="Settings" description="Configure your NagpurSabziMart admin console" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 sticky top-24">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  activeSection === s.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{s.label}</span>
                {activeSection !== s.id && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">

          {/* Store Details */}
          {activeSection === 'store' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 fade-in">
              <h3 className="text-base font-semibold text-foreground">Store Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Store Name', value: 'NagpurSabziMart', type: 'text' },
                  { label: 'Website', value: 'nagpursabzimart.in', type: 'text' },
                  { label: 'Contact Phone', value: '+91 98765 43210', type: 'tel' },
                  { label: 'Contact Email', value: 'admin@nagpursabzimart.in', type: 'email' },
                  { label: 'GST Number', value: '27AAAAA0000A1Z5', type: 'text' },
                  { label: 'Min Order Value', value: '₹100', type: 'text' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Store Address</label>
                <textarea
                  defaultValue="Itwari Market, Nagpur, Maharashtra - 440002"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Delivery Hours</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Opening Time</p>
                    <input type="time" defaultValue="06:00" className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-all text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Closing Time</p>
                    <input type="time" defaultValue="22:00" className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-all text-foreground" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 fade-in">
              <h3 className="text-base font-semibold text-foreground">Notification Preferences</h3>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Event Notifications</p>
                {[
                  { key: 'newOrder', label: 'New Order Placed', desc: 'Alert when a new order is placed' },
                  { key: 'orderStatus', label: 'Order Status Changes', desc: 'Updates on order lifecycle changes' },
                  { key: 'lowStock', label: 'Low Stock Alerts', desc: 'When inventory falls below threshold' },
                  { key: 'reviews', label: 'New Reviews', desc: 'Customer product reviews submitted' },
                  { key: 'payments', label: 'Payment Events', desc: 'Failed or refunded payments' },
                  { key: 'bulkOrders', label: 'Bulk Order Requests', desc: 'New wholesale order inquiries' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Toggle enabled={notifs[n.key as keyof typeof notifs]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notification Channels</p>
                {[
                  { key: 'push', label: 'Push Notifications', desc: 'Browser & mobile push alerts' },
                  { key: 'email', label: 'Email Alerts', desc: 'Email to admin@nagpursabzimart.in' },
                  { key: 'sms', label: 'SMS Alerts', desc: 'SMS to registered admin numbers' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Toggle enabled={notifs[n.key as keyof typeof notifs]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Zones */}
          {activeSection === 'delivery' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Delivery Zones</h3>
                <button
                  onClick={() => setZoneModal({ open: true, zone: null, index: null })}
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  + Add Zone
                </button>
              </div>
              <div className="space-y-2">
                {zones.map((zone, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <Toggle
                      enabled={zone.active}
                      onChange={v => setZones(prev => prev.map((z, idx) => idx === i ? { ...z, active: v } : z))}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{zone.name}</p>
                      <p className="text-xs text-muted-foreground">Min order: ₹{zone.minOrder} · Fee: ₹{zone.fee}</p>
                    </div>
                    {!zone.active && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>
                    )}
                    <button
                      onClick={() => setZoneModal({ open: true, zone: zone, index: i })}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteZone(i)}
                      className="text-xs text-red-500 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {zones.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No delivery zones yet. Click "+ Add Zone" to create one.
                  </div>
                )}
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Delivery zones outside Nagpur city limits require additional configuration. Contact support to enable pan-city delivery.
                </p>
              </div>
            </div>
          )}

          {/* Payments */}
          {activeSection === 'payments' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 fade-in">
              <h3 className="text-base font-semibold text-foreground">Payment Gateways</h3>
              {gateways.map(gw => (
                <div key={gw.name} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                  <span className="text-2xl">{gw.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{gw.name}</p>
                    <p className="text-xs text-muted-foreground">{gw.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      setGateways(prev => prev.map(g => g.name === gw.name ? { ...g, connected: !g.connected } : g));
                      showToast(`${gw.name} ${gw.connected ? 'disconnected' : 'connected'}`);
                    }}
                    className={cn('px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                      gw.connected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                    )}
                  >
                    {gw.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Team */}
          {activeSection === 'team' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-foreground">Team & Roles</h3>
                <button
                  onClick={() => showToast('Team member invite coming soon')}
                  className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Add Member
                </button>
              </div>
              {teamMembers.map((member, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-border rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground">{member.role}</span>
                </div>
              ))}
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 fade-in">
              <h3 className="text-base font-semibold text-foreground">Security Settings</h3>

              {/* Security toggles */}
              {[
                { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins' },
                { key: 'sessionTimeout', label: 'Session Timeout', desc: 'Auto-logout after 60 minutes of inactivity' },
                { key: 'loginNotifs', label: 'Login Notifications', desc: 'Email alert on new admin login' },
                { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict admin access to specific IPs' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Toggle
                    enabled={securityToggles[s.key as keyof typeof securityToggles]}
                    onChange={v => setSecurityToggles(p => ({ ...p, [s.key]: v }))}
                  />
                </div>
              ))}

              {/* Change Password */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-foreground">Change Admin Password</p>

                {[
                  { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
                  { key: 'newPass', label: 'New Password', placeholder: 'Min. 8 characters' },
                  { key: 'confirm', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs text-muted-foreground mb-1">{field.label}</label>
                    <div className="relative">
                      <input
                        type={showPasswords[field.key as keyof typeof showPasswords] ? 'text' : 'password'}
                        value={passwords[field.key as keyof typeof passwords]}
                        onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className={cn(
                          'w-full h-9 px-3 pr-10 rounded-xl border bg-background text-sm outline-none transition-all text-foreground placeholder:text-muted-foreground',
                          passErrors[field.key] ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(p => ({ ...p, [field.key]: !p[field.key as keyof typeof p] }))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPasswords[field.key as keyof typeof showPasswords]
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passErrors[field.key] && (
                      <p className="text-xs text-red-500 mt-1">{passErrors[field.key]}</p>
                    )}
                  </div>
                ))}

                <button
                  onClick={handleUpdatePassword}
                  className="px-4 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* Localization */}
          {activeSection === 'localization' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 fade-in">
              <h3 className="text-base font-semibold text-foreground">Localization</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Language</label>
                  <select
                    value={locale.language}
                    onChange={e => setLocale(p => ({ ...p, language: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Timezone</label>
                  <select
                    value={locale.timezone}
                    onChange={e => setLocale(p => ({ ...p, timezone: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground"
                  >
                    <option value="Asia/Kolkata">IST — Asia/Kolkata (UTC+5:30)</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Currency</label>
                  <select
                    value={locale.currency}
                    onChange={e => setLocale(p => ({ ...p, currency: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground"
                  >
                    <option value="INR">₹ INR — Indian Rupee</option>
                    <option value="USD">$ USD — US Dollar</option>
                    <option value="EUR">€ EUR — Euro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Date Format</label>
                  <select
                    value={locale.dateFormat}
                    onChange={e => setLocale(p => ({ ...p, dateFormat: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-secondary/40 border border-border space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Preview</p>
                <p className="text-sm text-foreground">Language: <span className="font-medium">{locale.language}</span></p>
                <p className="text-sm text-foreground">Timezone: <span className="font-medium">{locale.timezone}</span></p>
                <p className="text-sm text-foreground">Currency: <span className="font-medium">{locale.currency}</span></p>
                <p className="text-sm text-foreground">Date example: <span className="font-medium">
                  {locale.dateFormat === 'DD/MM/YYYY' ? '18/06/2026'
                    : locale.dateFormat === 'MM/DD/YYYY' ? '06/18/2026'
                    : '2026-06-18'}
                </span></p>
              </div>

              <button
                onClick={handleSaveLocalization}
                className="px-4 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Save Localization
              </button>
            </div>
          )}

          {/* Save Button */}
          {['store', 'notifications'].includes(activeSection) && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button className="px-4 h-9 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                Discard
              </button>
              <button
                onClick={handleSave}
                className={cn(
                  'flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-medium transition-all duration-200',
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-green-900/20'
                )}
              >
                {saved ? <><Check className="w-4 h-4" />Saved!</> : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}