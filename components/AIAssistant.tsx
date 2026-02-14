
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Camera, Image as ImageIcon, Sparkles, Loader2, AlertTriangle, Activity, X, Plus, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { getMedicationInsights, analyzeMedicationImage, checkInteractions } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: "Hi Alex! I'm your MedSmart assistant. You can ask me about medication interactions, side effects, or even upload a photo of a pill for identification.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [checkerMeds, setCheckerMeds] = useState<string[]>([]);
  const [currentMedInput, setCurrentMedInput] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, customContent?: string) => {
    if (e) e.preventDefault();
    const contentToSend = customContent || input;
    if (!contentToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: contentToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customContent) setInput('');
    setIsLoading(true);

    try {
      const response = await getMedicationInsights(contentToSend);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || "I'm sorry, I couldn't find information for that.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteractionCheck = async () => {
    if (checkerMeds.length < 2) return;
    
    setIsLoading(true);
    setIsCheckerOpen(false);
    
    const promptMessage = `Checking interactions between: ${checkerMeds.join(', ')}`;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const result = await checkInteractions(checkerMeds);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: result || "No interactions found or unable to analyze.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setCheckerMeds([]);
    }
  };

  const addMedToChecker = () => {
    if (currentMedInput.trim() && !checkerMeds.includes(currentMedInput.trim())) {
      setCheckerMeds([...checkerMeds, currentMedInput.trim()]);
      setCurrentMedInput('');
    }
  };

  const removeMedFromChecker = (med: string) => {
    setCheckerMeds(checkerMeds.filter(m => m !== med));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: "Scanning medication image...",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      try {
        const result = await analyzeMedicationImage(base64);
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: result || "Could not analyze the image.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] relative">
      {/* Interaction Checker Tool Modal */}
      {isCheckerOpen && (
        <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Activity size={20} className="text-rose-500" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Interaction Checker</h3>
              </div>
              <button onClick={() => setIsCheckerOpen(false)} className="text-slate-400 p-1">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mb-4 font-medium">Add at least two medications to check for potential interactions and health risks.</p>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Enter medication name..."
                  className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentMedInput}
                  onChange={e => setCurrentMedInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addMedToChecker()}
                />
                <button 
                  onClick={addMedToChecker}
                  className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="max-h-32 overflow-y-auto no-scrollbar space-y-2">
                {checkerMeds.map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl">
                    <span className="text-sm font-bold text-blue-700">{med}</span>
                    <button onClick={() => removeMedFromChecker(med)} className="text-blue-400 hover:text-blue-600">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {checkerMeds.length === 0 && (
                  <div className="text-center py-4 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs font-medium italic">
                    No medications added yet
                  </div>
                )}
              </div>

              <button 
                disabled={checkerMeds.length < 2 || isLoading}
                onClick={handleInteractionCheck}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  checkerMeds.length >= 2 && !isLoading
                  ? 'bg-rose-600 text-white shadow-rose-200 active:scale-95' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <AlertCircle size={18} />
                <span>Analyze Interactions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4 rounded-r-xl flex items-start space-x-2">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
          NOT MEDICAL ADVICE. This tool is for informational purposes only. Consult a doctor or pharmacist for medical decisions.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 ml-2' : 'bg-slate-200 mr-2'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-slate-600" />}
              </div>
              <div 
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                }`}
              >
                {msg.content}
                <div className={`text-[8px] mt-2 font-bold uppercase ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] items-end">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2">
                <Bot size={16} className="text-slate-600" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center space-x-2">
                <Loader2 className="animate-spin text-blue-600" size={16} />
                <span className="text-xs text-slate-500 font-medium italic">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-100 pt-4 pb-2">
        <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors"
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Ask about your meds..." 
                className="w-full bg-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 p-2 disabled:text-slate-300"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
            <QuickAction label="Check Interactions" icon={<Activity size={12} />} onClick={() => setIsCheckerOpen(true)} />
            <QuickAction label="Pill ID" icon={<Camera size={12} />} onClick={() => fileInputRef.current?.click()} />
            <QuickAction label="Side Effects" icon={<Sparkles size={12} />} onClick={() => handleSendMessage(undefined, "What are common side effects of Metformin?")} />
          </div>
        </form>
      </div>
    </div>
  );
};

const QuickAction: React.FC<{ label: string, icon?: React.ReactNode, onClick: () => void }> = ({ label, icon, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap hover:bg-blue-100 transition-colors flex items-center space-x-1.5"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default AIAssistant;
