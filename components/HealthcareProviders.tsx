
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  Plus, 
  Stethoscope, 
  User, 
  ExternalLink,
  Sparkles,
  Loader2,
  CalendarDays,
  Clock
} from 'lucide-react';
import { findProviders } from '../services/geminiService';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  image?: string;
  nextAppointment?: string;
  phone: string;
}

const MY_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'Primary Care Physician',
    clinic: 'Central Valley Medical',
    rating: 4.9,
    nextAppointment: 'Oct 24, 10:30 AM',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    specialty: 'Cardiologist',
    clinic: 'Heart & Vascular Institute',
    rating: 4.8,
    nextAppointment: 'Nov 12, 2:15 PM',
    phone: '(555) 987-6543'
  }
];

const HealthcareProviders: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{text: string, sources: any[]}>({ text: '', sources: [] });
  const [activeTab, setActiveTab] = useState<'my' | 'find'>('my');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Attempt to get user location for better results
      let location = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
        );
        location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) { console.warn("Location access denied"); }

      const result = await findProviders(searchQuery, location);
      setSearchResults(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Healthcare Providers</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage your care team</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
        <button 
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'my' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
        >
          My Doctors
        </button>
        <button 
          onClick={() => setActiveTab('find')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'find' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
        >
          Find Specialists
        </button>
      </div>

      {activeTab === 'my' ? (
        <div className="space-y-4 pb-20">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Care Team</h3>
            <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center space-x-1">
              <Plus size={12} />
              <span>Add Provider</span>
            </button>
          </div>

          {MY_PROVIDERS.map(provider => (
            <div key={provider.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[32px] shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                    <User size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{provider.name}</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{provider.specialty}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{provider.clinic}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-lg">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-amber-700 dark:text-amber-500">{provider.rating}</span>
                </div>
              </div>

              {provider.nextAppointment && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarDays size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Next Visit: {provider.nextAppointment}</span>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 uppercase">Reschedule</button>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 bg-slate-900 dark:bg-slate-800 text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all">
                  <MessageSquare size={14} />
                  <span>Message</span>
                </button>
                <button className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all">
                  <Phone size={14} />
                  <span>Call Clinic</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6 pb-20">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search specialists (e.g. Cardiologist near me)"
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-12 pr-4 py-4 rounded-[24px] text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm dark:text-white transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-600" size={20} />}
          </form>

          {!isSearching && !searchResults.text && (
            <div className="text-center py-12 px-6">
              <div className="w-20 h-20 bg-blue-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-blue-400" size={40} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI Specialist Search</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Find the best-rated doctors and clinics near your location using smart search.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['Dermatologist', 'Endocrinologist', 'Dentist', 'Pediatrician'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => { setSearchQuery(tag + " near me"); }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.text && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-5 rounded-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles size={16} className="text-blue-600" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">MedSmart AI Results</span>
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed prose prose-sm dark:prose-invert">
                  {searchResults.text}
                </div>
              </div>

              {searchResults.sources.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Top Recommendations</h3>
                  <div className="grid gap-4">
                    {searchResults.sources.map((chunk: any, i: number) => {
                      if (!chunk.maps) return null;
                      return (
                        <a 
                          key={i} 
                          href={chunk.maps.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:translate-x-1 transition-all group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600">
                              <MapPin size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{chunk.maps.title || "Provider Location"}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified Healthcare Provider</p>
                            </div>
                          </div>
                          <ExternalLink size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthcareProviders;
