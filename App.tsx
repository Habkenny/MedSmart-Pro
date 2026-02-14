
import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  Activity, 
  MessageSquare, 
  Settings, 
  Bell, 
  User,
  Moon,
  Sun
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import MedicationList from './components/MedicationList';
import HealthTracker from './components/HealthTracker';
import AIAssistant from './components/AIAssistant';
import ProfileSettings from './components/ProfileSettings';

type Tab = 'dashboard' | 'meds' | 'health' | 'ai' | 'settings';
type AccentColor = 'blue' | 'teal' | 'rose';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [notificationCount, setNotificationCount] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [accentColor, setAccentColor] = useState<AccentColor>(() => (localStorage.getItem('accent') as AccentColor) || 'blue');

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('accent', accentColor);
  }, [isDarkMode, accentColor]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const getAccentClass = () => {
    switch(accentColor) {
      case 'teal': return 'bg-teal-600 shadow-teal-200';
      case 'rose': return 'bg-rose-600 shadow-rose-200';
      default: return 'bg-blue-600 shadow-blue-200';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigateToMeds={() => setActiveTab('meds')} />;
      case 'meds': return <MedicationList />;
      case 'health': return <HealthTracker />;
      case 'ai': return <AIAssistant />;
      case 'settings': return <ProfileSettings />;
      default: return <Dashboard onNavigateToMeds={() => setActiveTab('meds')} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, accentColor, setAccentColor }}>
      <div className={`flex flex-col h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-950 shadow-2xl relative overflow-hidden theme-transition ${isDarkMode ? 'dark' : ''}`}>
        {/* Header */}
        <header className="px-6 pt-8 pb-4 bg-white dark:bg-slate-900 sticky top-0 z-10 flex justify-between items-center border-b border-gray-100 dark:border-slate-800 theme-transition">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {activeTab === 'dashboard' && 'Welcome, Alex'}
              {activeTab === 'meds' && 'Medications'}
              {activeTab === 'health' && 'Health Vitals'}
              {activeTab === 'ai' && 'AI Assistant'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest mt-0.5">
              {activeTab === 'dashboard' ? 'Your health at a glance' : 'Manage your wellness'}
            </p>
          </div>
          <div className="flex space-x-1">
             <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button className="relative p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Bell size={22} />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24 bg-slate-50 dark:bg-slate-950 theme-transition">
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 px-4 py-3 flex justify-around items-center shadow-inner z-20 theme-transition">
          <NavButton 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={22} />} 
            label="Home" 
          />
          <NavButton 
            isActive={activeTab === 'meds'} 
            onClick={() => setActiveTab('meds')} 
            icon={<Pill size={22} />} 
            label="Meds" 
          />
          <button 
            onClick={() => setActiveTab('ai')}
            className={`${getAccentClass()} text-white p-4 rounded-full -mt-10 shadow-lg hover:brightness-110 transition-all active:scale-95`}
          >
            <MessageSquare size={24} />
          </button>
          <NavButton 
            isActive={activeTab === 'health'} 
            onClick={() => setActiveTab('health')} 
            icon={<Activity size={22} />} 
            label="Health" 
          />
          <NavButton 
            isActive={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<Settings size={22} />} 
            label="Menu" 
          />
        </nav>
      </div>
    </ThemeContext.Provider>
  );
};

interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ isActive, onClick, icon, label }) => {
  const { accentColor } = useTheme();
  
  const getActiveTextClass = () => {
    if (!isActive) return 'text-slate-400 dark:text-slate-600';
    switch(accentColor) {
      case 'teal': return 'text-teal-600 dark:text-teal-400';
      case 'rose': return 'text-rose-600 dark:text-rose-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center space-y-1 px-3 py-1 transition-colors ${getActiveTextClass()}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
};

export default App;
