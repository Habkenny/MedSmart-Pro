
import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  X, 
  Save, 
  Sparkles, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  BrainCircuit,
  Droplets,
  Syringe,
  Hand,
  Clock,
  Check,
  History,
  CalendarDays,
  Trash2,
  Edit2
} from 'lucide-react';
import { Medication } from '../types';
import { getMedicationInsights } from '../services/geminiService';

const INITIAL_MEDS: Medication[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: '3x daily',
    nextDose: new Date(new Date().setHours(new Date().getHours() + 2)),
    remainingPills: 14,
    totalPills: 21,
    type: 'pill',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Insulin Glargine',
    dosage: '10 Units',
    frequency: 'Nightly',
    nextDose: new Date(new Date().setHours(22, 0, 0, 0)),
    remainingPills: 300,
    totalPills: 1000,
    type: 'injection',
    color: 'bg-rose-500'
  },
  {
    id: '3',
    name: 'Metformin Syrup',
    dosage: '5ml',
    frequency: '2x daily',
    nextDose: new Date(new Date().setHours(new Date().getHours() + 5)),
    remainingPills: 120,
    totalPills: 500,
    type: 'liquid',
    color: 'bg-indigo-500'
  }
];

interface DoseLogEntry {
  id: string;
  medId: string;
  medName: string;
  dosage: string;
  timestamp: Date;
  type: Medication['type'];
}

interface InsightState {
  content: string;
  loading: boolean;
  expanded: boolean;
}

const LoadingInsights: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Analyzing chemical composition...",
    "Searching medical databases...",
    "Evaluating safety profiles...",
    "Checking drug interactions...",
    "Synthesizing dosage guidelines..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-pulse">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full animate-ping"></div>
        <div className="bg-white p-3 rounded-full shadow-lg relative z-10 border border-blue-50">
          <BrainCircuit className="text-blue-600 animate-bounce" size={28} />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-1.5">
        <span className="text-xs font-bold text-blue-700 tracking-wide text-center h-4 flex items-center">
          {messages[messageIndex]}
        </span>
        <div className="w-32 h-1 bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 w-1/3 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
        </div>
      </div>
    </div>
  );
};

const MedicationList: React.FC = () => {
  const [meds, setMeds] = useState<Medication[]>(INITIAL_MEDS);
  const [doseHistory, setDoseHistory] = useState<DoseLogEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'history'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<string, InsightState>>({});
  const [loggedMeds, setLoggedMeds] = useState<Record<string, boolean>>({});
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    remainingPills: '',
    totalPills: '',
    type: 'pill' as Medication['type']
  });

  const filteredMeds = meds.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const calculateNextDose = (frequency: string, currentNext: Date): Date => {
    const next = new Date(currentNext);
    const now = new Date();
    const baseDate = next < now ? now : next;
    const result = new Date(baseDate);

    switch (frequency) {
      case 'Daily':
      case 'Nightly':
        result.setDate(result.getDate() + 1);
        break;
      case '2x daily':
        result.setHours(result.getHours() + 12);
        break;
      case '3x daily':
        result.setHours(result.getHours() + 8);
        break;
      case 'Weekly':
        result.setDate(result.getDate() + 7);
        break;
      default:
        result.setMinutes(result.getMinutes() + 30);
        break;
    }
    return result;
  };

  const handleLogDose = (medId: string) => {
    const med = meds.find(m => m.id === medId);
    if (!med) return;

    setLoggedMeds(prev => ({ ...prev, [medId]: true }));
    
    const newEntry: DoseLogEntry = {
      id: Date.now().toString(),
      medId: med.id,
      medName: med.name,
      dosage: med.dosage,
      timestamp: new Date(),
      type: med.type
    };

    setTimeout(() => {
      setMeds(prevMeds => prevMeds.map(m => {
        if (m.id === medId) {
          const newRemaining = Math.max(0, m.remainingPills - 1);
          return {
            ...m,
            remainingPills: newRemaining,
            nextDose: calculateNextDose(m.frequency, m.nextDose)
          };
        }
        return m;
      }));
      setDoseHistory(prev => [newEntry, ...prev]);
      setLoggedMeds(prev => ({ ...prev, [medId]: false }));
    }, 1000);
  };

  const formatNextDose = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (date.toDateString() === now.toDateString()) return `Today, ${timeString}`;
    if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${timeString}`;
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeString}`;
  };

  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) return;

    if (editingMedId) {
      setMeds(meds.map(m => m.id === editingMedId ? {
        ...m,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        remainingPills: parseInt(formData.remainingPills) || 0,
        totalPills: parseInt(formData.totalPills) || 30,
        type: formData.type,
        color: getCategoryColor(formData.type)
      } : m));
      setEditingMedId(null);
    } else {
      const med: Medication = {
        id: Date.now().toString(),
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        nextDose: new Date(new Date().setHours(new Date().getHours() + 1)),
        remainingPills: parseInt(formData.remainingPills) || 0,
        totalPills: parseInt(formData.totalPills) || 30,
        type: formData.type,
        color: getCategoryColor(formData.type)
      };
      setMeds([med, ...meds]);
    }

    setFormData({ name: '', dosage: '', frequency: 'Daily', remainingPills: '', totalPills: '', type: 'pill' });
    setIsAdding(false);
  };

  const startEditing = (med: Medication) => {
    setFormData({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      remainingPills: med.remainingPills.toString(),
      totalPills: med.totalPills.toString(),
      type: med.type
    });
    setEditingMedId(med.id);
    setActiveMenuId(null);
  };

  const deleteMedication = (id: string) => {
    if (confirm("Are you sure you want to delete this medication? This action cannot be undone.")) {
      setMeds(meds.filter(m => m.id !== id));
      setActiveMenuId(null);
    }
  };

  const getCategoryColor = (type: Medication['type']) => {
    switch (type) {
      case 'pill': return 'bg-blue-500';
      case 'liquid': return 'bg-indigo-500';
      case 'injection': return 'bg-rose-500';
      case 'topical': return 'bg-teal-500';
      default: return 'bg-slate-500';
    }
  };

  const getMedicationIcon = (type: Medication['type'], size = 24) => {
    switch (type) {
      case 'pill': return <Pill size={size} />;
      case 'liquid': return <Droplets size={size} />;
      case 'injection': return <Syringe size={size} />;
      case 'topical': return <Hand size={size} />;
      default: return <Pill size={size} />;
    }
  };

  const toggleInsights = async (medId: string, medName: string) => {
    const currentState = insights[medId] || { content: '', loading: false, expanded: false };
    if (currentState.expanded) {
      setInsights({ ...insights, [medId]: { ...currentState, expanded: false } });
      return;
    }
    if (currentState.content) {
      setInsights({ ...insights, [medId]: { ...currentState, expanded: true } });
      return;
    }
    setInsights({ ...insights, [medId]: { ...currentState, loading: true, expanded: true } });
    try {
      const content = await getMedicationInsights(medName);
      setInsights(prev => ({
        ...prev,
        [medId]: { content: content || 'No insights available.', loading: false, expanded: true }
      }));
    } catch (error) {
      setInsights(prev => ({
        ...prev,
        [medId]: { content: 'Failed to fetch insights.', loading: false, expanded: true }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search medications..." 
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => {
            setEditingMedId(null);
            setFormData({ name: '', dosage: '', frequency: 'Daily', remainingPills: '', totalPills: '', type: 'pill' });
            setIsAdding(true);
          }}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-md hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {(isAdding || editingMedId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingMedId ? 'Edit Medication' : 'Add Medication'}
              </h3>
              <button onClick={() => { setIsAdding(false); setEditingMedId(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveMedication} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Medication Name</label>
                <input required type="text" placeholder="e.g. Lisinopril" className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Dosage</label>
                  <input required type="text" placeholder="e.g. 10mg" className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Type</label>
                  <select className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as Medication['type']})}>
                    <option value="pill">Pill</option>
                    <option value="liquid">Liquid</option>
                    <option value="injection">Injection</option>
                    <option value="topical">Topical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Remaining</label>
                  <input type="number" placeholder="30" className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.remainingPills} onChange={e => setFormData({...formData, remainingPills: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Total Pack</label>
                  <input type="number" placeholder="30" className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.totalPills} onChange={e => setFormData({...formData, totalPills: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => { setIsAdding(false); setEditingMedId(null); }} className="flex-1 px-4 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-2xl text-sm">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3.5 bg-blue-600 text-white font-bold rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-200">
                  {editingMedId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`${activeFilter === 'all' ? 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'} px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm`}
        >
          Inventory
        </button>
        <button 
          onClick={() => setActiveFilter('history')}
          className={`${activeFilter === 'history' ? 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'} px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5`}
        >
          <History size={12} />
          <span>Dose History</span>
        </button>
      </div>

      <div className="space-y-4">
        {activeFilter === 'all' ? (
          filteredMeds.map((med) => {
            const medInsight = insights[med.id] || { content: '', loading: false, expanded: false };
            const isLogged = loggedMeds[med.id];
            const isOverdue = med.nextDose < new Date() && med.frequency !== 'As needed';
            const isMenuOpen = activeMenuId === med.id;
            
            return (
              <div key={med.id} className={`bg-white dark:bg-slate-900 border ${isOverdue ? 'border-rose-100 dark:border-rose-900/50' : 'border-slate-100 dark:border-slate-800'} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative`}>
                {isOverdue && (
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest animate-pulse">
                    Overdue
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${med.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                      {getMedicationIcon(med.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{med.name}</h4>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          {med.type}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm">{med.dosage} • {med.frequency}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 relative">
                    <button 
                      onClick={() => toggleInsights(med.id, med.name)}
                      className={`p-2 rounded-xl transition-all ${medInsight.expanded ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                      title="AI Insights"
                    >
                      <Sparkles size={20} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenuId(isMenuOpen ? null : med.id)}
                        className={`text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isMenuOpen ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      
                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button 
                            onClick={() => startEditing(med)}
                            className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2"
                          >
                            <Edit2 size={14} className="text-blue-500" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => deleteMedication(med.id)}
                            className="w-full px-4 py-2.5 text-left text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center space-x-2"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {medInsight.expanded && (
                  <div className="mb-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">MedSmart AI Insights</span>
                      </div>
                      {medInsight.loading ? (
                        <LoadingInsights />
                      ) : (
                        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {medInsight.content}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Supply</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{med.remainingPills} / {med.totalPills} units</span>
                    <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${med.remainingPills < 10 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(med.remainingPills / med.totalPills) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className={`bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border ${isOverdue ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50' : 'border-slate-100 dark:border-slate-800/50'}`}>
                    <span className={`block text-[10px] ${isOverdue ? 'text-rose-400' : 'text-slate-400'} font-bold uppercase tracking-wider mb-1`}>Next Dose</span>
                    <span className={`font-bold ${isOverdue ? 'text-rose-700' : 'text-slate-700 dark:text-slate-300'}`}>
                      {med.frequency === 'As needed' ? 'Ready' : formatNextDose(med.nextDose)}
                    </span>
                    <div className="mt-2 flex items-center space-x-1">
                      <Clock size={12} className={isOverdue ? 'text-rose-500' : 'text-blue-600'} />
                      <span className={`text-[10px] font-bold ${isOverdue ? 'text-rose-600' : 'text-blue-600 dark:text-blue-400'}`}>
                        {isOverdue ? 'Action Required' : 'Scheduled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleLogDose(med.id)}
                    disabled={isLogged}
                    className={`flex-1 font-bold py-3 rounded-2xl text-sm active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-lg ${
                      isLogged 
                        ? 'bg-emerald-500 text-white shadow-emerald-200' 
                        : isOverdue 
                          ? 'bg-rose-600 text-white shadow-rose-200' 
                          : 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white shadow-slate-200'
                    }`}
                  >
                    {isLogged ? <Check size={18} /> : <CheckCircle2 size={18} />}
                    <span>{isLogged ? 'Dose Logged' : 'Log Dose'}</span>
                  </button>
                  <button className="px-6 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold py-3 rounded-2xl text-sm active:scale-95 transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
                    Refill
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
            {doseHistory.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Clock size={32} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">No doses logged yet</h3>
                <p className="text-slate-500 text-xs mt-1">Logged doses will appear here for your review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2">Chronological Log</h3>
                {doseHistory.map((entry) => (
                  <div key={entry.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${getCategoryColor(entry.type)}`}>
                        {getMedicationIcon(entry.type, 18)}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">{entry.medName}</h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{entry.dosage} Dose Taken</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {entry.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeFilter === 'all' && filteredMeds.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">No results found</h3>
            <p className="text-slate-500 text-sm mt-1">Try a different medication name.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationList;
