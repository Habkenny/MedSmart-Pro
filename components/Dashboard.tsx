
import React from 'react';
import { 
  ChevronRight, 
  Pill, 
  Droplet, 
  Wind, 
  ArrowRight,
  PlusCircle,
  Calendar
} from 'lucide-react';
import { useTheme } from '../App';

interface DashboardProps {
  onNavigateToMeds: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToMeds }) => {
  const { accentColor } = useTheme();

  const getAccentGradient = () => {
    switch(accentColor) {
      case 'teal': return 'from-teal-600 to-emerald-700';
      case 'rose': return 'from-rose-600 to-pink-700';
      default: return 'from-blue-600 to-indigo-700';
    }
  };

  const getAccentBtn = () => {
    switch(accentColor) {
      case 'teal': return 'bg-teal-600 hover:bg-teal-700';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700';
      default: return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Progress */}
      <section className={`bg-gradient-to-br ${getAccentGradient()} rounded-3xl p-6 text-white shadow-xl transition-all`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Daily Routine</h2>
            <p className="text-blue-100 text-sm mt-1">3 of 5 medications taken</p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Calendar size={20} />
          </div>
        </div>
        
        <div className="mt-6 flex items-center space-x-3">
          <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-3/5 rounded-full shadow-sm"></div>
          </div>
          <span className="text-sm font-bold">60%</span>
        </div>
      </section>

      {/* Next Dose Card */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Up Next</h3>
          <button onClick={onNavigateToMeds} className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-all">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/20 rounded-2xl flex items-center justify-center text-orange-500">
              <Pill size={28} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-lg">Lisinopril</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm">10mg • Daily at 8:00 AM</p>
            </div>
          </div>
          <button className={`bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-4 py-2 rounded-xl text-sm transition-all`}>
            Log
          </button>
        </div>
      </section>

      {/* Health Vitals Summary */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Vitals Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <VitalCard 
            icon={<Droplet size={20} />} 
            label="Blood Glucose" 
            value="98" 
            unit="mg/dL" 
            status="Normal"
            color="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
          />
          <VitalCard 
            icon={<Wind size={20} />} 
            label="Heart Rate" 
            value="72" 
            unit="bpm" 
            status="Stable"
            color="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
          />
        </div>
      </section>

      {/* Order Refill */}
      <section className="bg-slate-900 dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 text-white relative overflow-hidden transition-all">
        <div className="relative z-10">
          <h3 className="text-lg font-bold">Refill Needed</h3>
          <p className="text-slate-400 text-sm mt-1">2 prescriptions are running low.</p>
          <button className={`mt-4 ${getAccentBtn()} text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center space-x-2 transition-all`}>
            <span>Order Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <PlusCircle size={100} />
        </div>
      </section>
    </div>
  );
};

const VitalCard: React.FC<{ icon: React.ReactNode, label: string, value: string, unit: string, status: string, color: string }> = ({ icon, label, value, unit, status, color }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm transition-all">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
    <div className="flex items-baseline space-x-1 mt-1">
      <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
      <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">{unit}</span>
    </div>
    <div className="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 inline-block px-2 py-0.5 rounded-full uppercase">
      {status}
    </div>
  </div>
);

export default Dashboard;
