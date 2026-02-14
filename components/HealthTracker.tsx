
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  ArrowDownRight, 
  ArrowUpRight, 
  Plus, 
  X, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  Droplet,
  Heart,
  Scale,
  Gauge
} from 'lucide-react';
import { HealthMetricType } from '../types';

const INITIAL_DATA = [
  { name: 'Mon', value: 98 },
  { name: 'Tue', value: 102 },
  { name: 'Wed', value: 95 },
  { name: 'Thu', value: 105 },
  { name: 'Fri', value: 97 },
  { name: 'Sat', value: 101 },
  { name: 'Sun', value: 98 },
];

interface HealthLog {
  id: string;
  type: HealthMetricType;
  value: string;
  unit: string;
  timestamp: Date;
  note?: string;
}

const HealthTracker: React.FC = () => {
  const [logs, setLogs] = useState<HealthLog[]>([
    { id: '1', type: HealthMetricType.GLUCOSE, value: '98', unit: 'mg/dL', timestamp: new Date(), note: 'After Breakfast' },
    { id: '2', type: HealthMetricType.HEART_RATE, value: '72', unit: 'bpm', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', type: HealthMetricType.BLOOD_PRESSURE, value: '120/80', unit: 'mmHg', timestamp: new Date(Date.now() - 7200000) },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<HealthMetricType>(HealthMetricType.GLUCOSE);
  const [formData, setFormData] = useState({
    value1: '',
    value2: '', // For BP (Diastolic)
    timestamp: new Date().toISOString().slice(0, 16),
    note: ''
  });

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalValue = formData.value1;
    let unit = 'unit';

    switch (selectedType) {
      case HealthMetricType.BLOOD_PRESSURE:
        finalValue = `${formData.value1}/${formData.value2}`;
        unit = 'mmHg';
        break;
      case HealthMetricType.GLUCOSE:
        unit = 'mg/dL';
        break;
      case HealthMetricType.HEART_RATE:
        unit = 'bpm';
        break;
      case HealthMetricType.WEIGHT:
        unit = 'kg';
        break;
    }

    const newLog: HealthLog = {
      id: Date.now().toString(),
      type: selectedType,
      value: finalValue,
      unit: unit,
      timestamp: new Date(formData.timestamp),
      note: formData.note
    };

    setLogs([newLog, ...logs]);
    setIsModalOpen(false);
    setFormData({ value1: '', value2: '', timestamp: new Date().toISOString().slice(0, 16), note: '' });
  };

  const getMetricIcon = (type: HealthMetricType) => {
    switch (type) {
      case HealthMetricType.GLUCOSE: return <Droplet size={18} />;
      case HealthMetricType.HEART_RATE: return <Heart size={18} />;
      case HealthMetricType.BLOOD_PRESSURE: return <Activity size={18} />;
      case HealthMetricType.WEIGHT: return <Scale size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const getMetricLabel = (type: HealthMetricType) => {
    switch (type) {
      case HealthMetricType.GLUCOSE: return "Blood Glucose";
      case HealthMetricType.HEART_RATE: return "Heart Rate";
      case HealthMetricType.BLOOD_PRESSURE: return "Blood Pressure";
      case HealthMetricType.WEIGHT: return "Body Weight";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Action */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Vitals Overview</h2>
          <p className="text-xs text-slate-500 font-medium">Tracking your key health metrics</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white flex items-center space-x-2 px-4 py-2.5 rounded-2xl shadow-lg shadow-blue-200 font-bold text-sm active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>Log Vitals</span>
        </button>
      </div>

      {/* Chart Card */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Blood Glucose</h3>
            <p className="text-slate-500 text-sm">Last 7 days average: <span className="text-slate-900 font-bold">99.4 mg/dL</span></p>
          </div>
          <div className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center">
            <TrendingUp size={12} className="mr-1" />
            Normal
          </div>
        </div>

        <div className="h-64 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={INITIAL_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                hide 
                domain={['dataMin - 10', 'dataMax + 10']} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
                labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={4}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem 
          label="Systolic BP" 
          value="120" 
          unit="mmHg" 
          trend="down" 
          trendValue="2%" 
          color="text-blue-600"
        />
        <StatItem 
          label="Diastolic BP" 
          value="80" 
          unit="mmHg" 
          trend="stable" 
          trendValue="0%" 
          color="text-indigo-600"
        />
        <StatItem 
          label="Heart Rate" 
          value="72" 
          unit="bpm" 
          trend="up" 
          trendValue="4%" 
          color="text-rose-600"
        />
        <StatItem 
          label="Oxygen Level" 
          value="98" 
          unit="%" 
          trend="stable" 
          trendValue="0%" 
          color="text-teal-600"
        />
      </div>

      {/* Log History */}
      <section className="pb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Recent Logs</h3>
          <button className="text-blue-600 text-sm font-bold">See All History</button>
        </div>
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                  {getMetricIcon(log.type)}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{getMetricLabel(log.type)}</h5>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    {log.timestamp.toLocaleDateString()} • {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900 block">{log.value} <span className="text-[10px] text-slate-400 font-medium">{log.unit}</span></span>
                {log.note && <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded-md">{log.note}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Log Vital Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in fade-in duration-300 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Log Health Vitals</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 text-slate-400 p-2 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Metric Type Selector */}
            <div className="flex justify-between mb-8 space-x-2">
              <TypeSelector 
                type={HealthMetricType.GLUCOSE} 
                active={selectedType === HealthMetricType.GLUCOSE} 
                onClick={() => setSelectedType(HealthMetricType.GLUCOSE)}
                icon={<Droplet size={20} />}
                label="Glucose"
              />
              <TypeSelector 
                type={HealthMetricType.BLOOD_PRESSURE} 
                active={selectedType === HealthMetricType.BLOOD_PRESSURE} 
                onClick={() => setSelectedType(HealthMetricType.BLOOD_PRESSURE)}
                icon={<Activity size={20} />}
                label="BP"
              />
              <TypeSelector 
                type={HealthMetricType.HEART_RATE} 
                active={selectedType === HealthMetricType.HEART_RATE} 
                onClick={() => setSelectedType(HealthMetricType.HEART_RATE)}
                icon={<Heart size={20} />}
                label="Heart"
              />
              <TypeSelector 
                type={HealthMetricType.WEIGHT} 
                active={selectedType === HealthMetricType.WEIGHT} 
                onClick={() => setSelectedType(HealthMetricType.WEIGHT)}
                icon={<Scale size={20} />}
                label="Weight"
              />
            </div>

            <form onSubmit={handleSaveLog} className="space-y-6">
              <div className="space-y-4">
                {selectedType === HealthMetricType.BLOOD_PRESSURE ? (
                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="Systolic" 
                      placeholder="120" 
                      value={formData.value1} 
                      onChange={v => setFormData({...formData, value1: v})} 
                      unit="mmHg"
                    />
                    <InputField 
                      label="Diastolic" 
                      placeholder="80" 
                      value={formData.value2} 
                      onChange={v => setFormData({...formData, value2: v})} 
                      unit="mmHg"
                    />
                  </div>
                ) : (
                  <InputField 
                    label="Value" 
                    placeholder={selectedType === HealthMetricType.WEIGHT ? "70.5" : "98"} 
                    value={formData.value1} 
                    onChange={v => setFormData({...formData, value1: v})} 
                    unit={selectedType === HealthMetricType.GLUCOSE ? "mg/dL" : selectedType === HealthMetricType.HEART_RATE ? "bpm" : "kg"}
                  />
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Timestamp</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="datetime-local" 
                      className="w-full bg-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.timestamp}
                      onChange={e => setFormData({...formData, timestamp: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Optional Note</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Fasting, After run..."
                    className="w-full bg-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-2xl text-sm active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!formData.value1}
                  className="flex-[1.5] py-4 px-6 bg-blue-600 text-white font-bold rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <CheckCircle2 size={18} />
                  <span>Save Vital</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TypeSelector: React.FC<{ type: HealthMetricType, active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-3 rounded-2xl transition-all border ${
      active 
        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
        : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase mt-1 tracking-tighter">{label}</span>
  </button>
);

const InputField: React.FC<{ label: string, placeholder: string, value: string, onChange: (v: string) => void, unit: string }> = ({ label, placeholder, value, onChange, unit }) => (
  <div className="flex-1">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">{label}</label>
    <div className="relative">
      <input 
        required
        type="text" 
        placeholder={placeholder}
        className="w-full bg-slate-100 rounded-2xl px-5 py-4 text-lg font-black text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">{unit}</span>
    </div>
  </div>
);

const StatItem: React.FC<{ label: string, value: string, unit: string, trend: 'up' | 'down' | 'stable', trendValue: string, color: string }> = ({ label, value, unit, trend, trendValue, color }) => (
  <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <div className="flex items-baseline space-x-1 mt-1">
      <span className={`text-2xl font-black ${color}`}>{value}</span>
      <span className="text-slate-400 text-xs font-medium">{unit}</span>
    </div>
    <div className="mt-2 flex items-center">
      {trend === 'up' && <ArrowUpRight size={14} className="text-rose-500 mr-1" />}
      {trend === 'down' && <ArrowDownRight size={14} className="text-emerald-500 mr-1" />}
      {trend === 'stable' && <TrendingUp size={14} className="text-blue-500 mr-1" />}
      <span className={`text-[10px] font-bold ${trend === 'up' ? 'text-rose-500' : trend === 'down' ? 'text-emerald-500' : 'text-blue-500'}`}>
        {trendValue} from yesterday
      </span>
    </div>
  </div>
);

export default HealthTracker;
