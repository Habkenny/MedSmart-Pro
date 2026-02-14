
import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  MapPin, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Stethoscope,
  Bell,
  Palette,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { useTheme } from '../App';
import HealthcareProviders from './HealthcareProviders';

const ProfileSettings: React.FC = () => {
  const { isDarkMode, toggleDarkMode, accentColor, setAccentColor } = useTheme();
  const [reminders, setReminders] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [activeSubView, setActiveSubView] = useState<'main' | 'providers'>('main');

  if (activeSubView === 'providers') {
    return <HealthcareProviders onBack={() => setActiveSubView('main')} />;
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
        <div className="w-24 h-24 bg-blue-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 border-4 border-white dark:border-slate-900 shadow-lg shadow-blue-100 dark:shadow-none">
          <User size={48} />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Alex Thompson</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Patient ID: MS-48293</p>
        <button className="mt-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold px-4 py-1.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
          Edit Profile
        </button>
      </div>

      {/* Appearance Settings */}
      <section>
        <div className="flex items-center space-x-2 mb-3 ml-2">
          <Palette size={14} className="text-slate-400" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Appearance</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800">
            <div>
              <span className="font-bold text-slate-800 dark:text-white text-sm block">Dark Mode</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Better for night use</span>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="p-4">
            <span className="font-bold text-slate-800 dark:text-white text-sm block mb-3">Primary Accent</span>
            <div className="flex space-x-3">
              <ColorOption color="blue" active={accentColor === 'blue'} onClick={() => setAccentColor('blue')} className="bg-blue-500" />
              <ColorOption color="teal" active={accentColor === 'teal'} onClick={() => setAccentColor('teal')} className="bg-teal-500" />
              <ColorOption color="rose" active={accentColor === 'rose'} onClick={() => setAccentColor('rose')} className="bg-rose-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Account Settings</h3>
        <div className="space-y-2">
          <SettingItem 
            icon={<Stethoscope className="text-blue-500" />} 
            label="Healthcare Providers" 
            onClick={() => setActiveSubView('providers')}
          />
          <SettingItem icon={<CreditCard className="text-indigo-500" />} label="Payment & Insurance" />
          <SettingItem icon={<MapPin className="text-rose-500" />} label="Delivery Addresses" />
          <SettingItem icon={<Shield className="text-emerald-500" />} label="Privacy & Security" />
        </div>
      </section>

      {/* Notification Preferences Section */}
      <section>
        <div className="flex items-center space-x-2 mb-3 ml-2">
          <Bell size={14} className="text-slate-400" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notification Preferences</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <ToggleItem 
            label="Medication Reminders" 
            description="Alerts for scheduled doses"
            isEnabled={reminders} 
            onToggle={() => setReminders(!reminders)} 
          />
          <ToggleItem 
            label="Health Vitals Alerts" 
            description="Notifications for abnormal metrics"
            isEnabled={healthAlerts} 
            onToggle={() => setHealthAlerts(!healthAlerts)} 
          />
        </div>
      </section>

      {/* Support Section */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Help & Support</h3>
        <div className="space-y-2">
          <SettingItem icon={<HelpCircle className="text-slate-400" />} label="Support Center" />
        </div>
      </section>

      {/* Version & Logout */}
      <div className="pt-4">
        <button className="w-full flex items-center justify-center space-x-2 p-4 text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
        <p className="text-center text-[10px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest mt-6">
          MedSmart Pro v2.5.0
        </p>
      </div>
    </div>
  );
};

const ColorOption: React.FC<{ active: boolean, onClick: () => void, className: string, color: string }> = ({ active, onClick, className }) => (
  <button 
    onClick={onClick}
    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${active ? 'border-slate-900 dark:border-white' : 'border-transparent'} ${className} shadow-sm transition-all active:scale-90`}
  >
    {active && <Check size={16} className="text-white" />}
  </button>
);

const SettingItem: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-50 dark:border-slate-800 rounded-2xl transition-all active:scale-[0.98]"
  >
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
        {icon}
      </div>
      <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{label}</span>
    </div>
    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
  </button>
);

const ToggleItem: React.FC<{ label: string, description: string, isEnabled: boolean, onToggle: () => void }> = ({ label, description, isEnabled, onToggle }) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
    <div>
      <span className="font-bold text-slate-800 dark:text-white text-sm block">{label}</span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{description}</span>
    </div>
    <button 
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

export default ProfileSettings;
