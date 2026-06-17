import { useState } from 'react';
import {
  Settings as SettingsIcon, Store, Bell, Shield, Truck, Palette,
  Globe, CreditCard, Users, ChevronRight, Check, AlertTriangle
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
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'localization', label: 'Localization', icon: Globe },
];

const deliveryZones = [
  { name: 'Dharampeth', active: true, fee: '₹20', minOrder: '₹100' },
  { name: 'Civil Lines', active: true, fee: '₹20', minOrder: '₹100' },
  { name: 'Sitabuldi', active: true, fee: '₹25', minOrder: '₹100' },
  { name: 'Ramdaspeth', active: true, fee: '₹20', minOrder: '₹100' },
  { name: 'Sadar', active: true, fee: '₹25', minOrder: '₹100' },
  { name: 'Manewada', active: false, fee: '₹35', minOrder: '₹150' },
  { name: 'Wardha Road', active: false, fee: '₹40', minOrder: '₹200' },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0',
        enabled ? 'bg-primary' : 'bg-muted'
      )}
      style={{ height: '22px' }}
    >
      <span className={cn(
        'absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200',
        enabled ? 'translate-x-5' : 'translate-x-0.5'
      )} style={{ width: '18px', height: '18px', top: '2px' }} />
    </button>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('store');
  const [notifs, setNotifs] = useState({
    newOrder: true,
    orderStatus: true,
    lowStock: true,
    reviews: true,
    payments: true,
    bulkOrders: true,
    sms: false,
    email: true,
    push: true,
  });
  const [saved, setSaved] = useState(false);
const [gateways, setGateways] = useState([
  {
    name: 'Razorpay',
    connected: true,
    icon: '💳',
    desc: 'Primary gateway for UPI, Cards, Wallets',
  },
  {
    name: 'Cash on Delivery',
    connected: true,
    icon: '💵',
    desc: 'Accept payments at delivery',
  },
  {
    name: 'Paytm Business',
    connected: false,
    icon: '📱',
    desc: 'Paytm UPI and Paytm Wallet',
  },
  {
    name: 'PhonePe',
    connected: false,
    icon: '📞',
    desc: 'PhonePe UPI payments',
  },
]);

const [teamMembers] = useState([
  {
    name: 'Admin',
    role: 'Super Admin',
    email: 'admin@nagpursabzimart.in',
  },
]);

const [zones] = useState(deliveryZones);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your NagpurSabziMart admin console"
      />

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
                    <Toggle
                      enabled={notifs[n.key as keyof typeof notifs]}
                      onChange={v => setNotifs(prev => ({ ...prev, [n.key]: v }))}
                    />
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
                    <Toggle
                      enabled={notifs[n.key as keyof typeof notifs]}
                      onChange={v => setNotifs(prev => ({ ...prev, [n.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'delivery' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Delivery Zones</h3>
                <button className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                  + Add Zone
                </button>
              </div>
              <div className="space-y-2">
                {zones.map((zone, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <Toggle enabled={zone.active} onChange={() => {}} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{zone.name}</p>
                      <p className="text-xs text-muted-foreground">Min order: {zone.minOrder} · Fee: {zone.fee}</p>
                    </div>
                    {!zone.active && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>
                    )}
                    <button className="text-xs text-primary hover:underline">Edit</button>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Delivery zones outside Nagpur city limits require additional configuration. Contact support to enable pan-city delivery.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'payments' && (
  <div className="rounded-2xl border border-border bg-card p-6 space-y-4 fade-in">
    <h3 className="text-base font-semibold text-foreground">
      Payment Gateways
    </h3>

    {gateways.map((gw) => (
      <div
        key={gw.name}
        className="flex items-center gap-4 p-4 rounded-xl border border-border"
      >
        <span className="text-2xl">{gw.icon}</span>

        <div className="flex-1">
          <p className="font-semibold">{gw.name}</p>
          <p className="text-xs text-muted-foreground">
            {gw.desc}
          </p>
        </div>

        <button
          onClick={() => {
            setGateways((prev) =>
              prev.map((g) =>
                g.name === gw.name
                  ? { ...g, connected: !g.connected }
                  : g
              )
            );
          }}
          className={cn(
            'px-3 py-1 rounded-lg text-xs font-medium',
            gw.connected
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          )}
        >
          {gw.connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    ))}
  </div>
)}

          {activeSection === 'security' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 fade-in">
              <h3 className="text-base font-semibold text-foreground">Security Settings</h3>
              {[
                { label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins', enabled: true },
                { label: 'Session Timeout', desc: 'Auto-logout after 60 minutes of inactivity', enabled: true },
                { label: 'Login Notifications', desc: 'Email alert on new admin login', enabled: true },
                { label: 'IP Whitelist', desc: 'Restrict admin access to specific IPs', enabled: false },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Toggle enabled={s.enabled} onChange={() => {}} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Change Admin Password</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="New password"
                    className="flex-1 h-9 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground text-foreground"
                  />
                  <button className="px-4 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'team' && (
  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-base font-semibold">
        Team & Roles
      </h3>

      <button
        className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm"
      >
        Add Member
      </button>
    </div>

    {teamMembers.map((member, index) => (
      <div
        key={index}
        className="flex justify-between items-center p-4 border rounded-xl"
      >
        <div>
          <p className="font-medium">{member.name}</p>
          <p className="text-xs text-muted-foreground">
            {member.email}
          </p>
        </div>

        <span className="text-sm">
          {member.role}
        </span>
      </div>
    ))}
  </div>
)}
{activeSection === 'appearance' && (
  <div className="rounded-2xl border border-border bg-card p-6">
    <h3 className="font-semibold mb-4">
      Appearance
    </h3>

    <div className="space-y-4">
      <button className="px-4 py-2 rounded-xl border">
        Light Theme
      </button>

      <button className="px-4 py-2 rounded-xl border">
        Dark Theme
      </button>
    </div>
  </div>
)}
{activeSection === 'localization' && (
  <div className="rounded-2xl border border-border bg-card p-6">
    <h3 className="font-semibold mb-4">
      Localization
    </h3>

    <select className="w-full h-10 rounded-xl border px-3">
      <option>English</option>
      <option>Hindi</option>
      <option>Marathi</option>
    </select>
  </div>
)}
          {!['store', 'notifications', 'delivery', 'payments', 'security'].includes(activeSection) && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center fade-in">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {sections.find(s => s.id === activeSection)?.label} Settings
              </h3>
              <p className="text-sm text-muted-foreground">
                This section is coming soon. Configuration options for {sections.find(s => s.id === activeSection)?.label.toLowerCase()} will appear here.
              </p>
            </div>
          )}

          {/* Save Button */}
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
        </div>
      </div>
    </div>
  );
}
