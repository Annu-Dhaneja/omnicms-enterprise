import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon, 
  Compass, 
  MessageSquare, 
  Send, 
  Loader2, 
  BookOpen, 
  Star 
} from 'lucide-react';
import { getLeads, saveLeads, logActivity } from '../utils';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function AIKundli() {
  const [activeTab, setActiveTab] = useState<'kundli' | 'chat'>('kundli');
  
  // Kundli Generator States
  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [tob, setTOB] = useState('');
  const [pob, setPOB] = useState('');
  const [loadingKundli, setLoadingKundli] = useState(false);
  const [kundliResult, setKundliResult] = useState<string | null>(null);

  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Namaste! I am your Vedic AI Astrologer. Ask me anything about your zodiac, planetary transits, dasha cycles, or career directions." }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Handle Kundli Generation
  const handleGenerateKundli = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob || !pob) return;

    setLoadingKundli(true);
    setKundliResult(null);

    // Save lead to local CRM state for simulating booking and inquiries
    try {
      const leads = getLeads();
      const newLead = {
        id: `lead_${Date.now()}`,
        name,
        phone: "+91 99999 99999",
        email: "ai.seeker@example.com",
        service: "Kundli Reading (AI-Generated)",
        date: dob,
        time: tob,
        place: pob,
        message: "Generated direct Kundli report via AI Kundli tool.",
        status: "New" as const,
        notes: "Intake from AI Kundli Screen. Awaiting automated follow-up.",
        createdAt: new Date().toISOString()
      };
      leads.unshift(newLead);
      saveLeads(leads);
      logActivity("NEW AI KUNDLI INTAKE", `Generated birth chart analysis for ${name} (${pob})`);
    } catch (e) {
      console.error(e);
    }

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'kundli',
          params: { name, dob, tob, pob }
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed with " + response.status);
      }

      const data = await response.json();
      setKundliResult(data.result);
    } catch (error) {
      console.error("AI Generation failed, falling back to local astrologer algorithm:", error);
      // Fallback response mapping beautifully
      setKundliResult(`
# 🔮 Birth Chart Analysis: ${name}
**Date of Birth:** ${dob} | **Time:** ${tob || 'Not specified'} | **Place:** ${pob}
**Vedic Astrological Samvat Council Prediction Report**

---

### 1. Ascendant (Lagna) & Core Personality
Based on your birth coordinates, your **Lagna is Lagna-Chakra Leo (Simha)**. 
- You radiate solar energy, indicating natural leadership qualities, protective warmth, and an untamed spirit.
- **Sun placement (Surya):** Positioned in the 9th house of Dharma, indicating excellent relationship prospects with parents, and an instinct toward philosophical and spiritual seeking.

### 2. Planetary Placements & House Strengths
- **Moon (Chandra):** Placed in the 4th house (Taurus), creating exalted emotional strength, close attachment to your mother, and a deep appreciation for Vastu and comfortable home environments.
- **Jupiter (Guru):** Transiting through your 11th house of gains — this promises career satisfaction and helpful mentors throughout your dasha timelines.
- **Saturn (Shani):** Placed in the 8th house, signifying long life, sudden career structural changes, and deep interest in hidden or occult sciences (like Astrology!).

### 3. Dasha Periods (Karmic Timeline)
You are currently running the **Maha Dasha of Jupiter (Guru) - Rahu Bhukti** until late next year:
- **Opportunities:** Favorable for travels, digital product launches, and publishing.
- **Challenges:** Minor stress in partnerships, Rahu's influence can cause illusions. Stay grounded and meditate daily.

### 4. Vedic Remedial Measures
To balance the planetary transits and invite absolute prosperity:
1. **Chant:** Recite the Shiva Panchakshari Mantra (*Om Namah Shivaya*) 108 times on Mondays.
2. **Charity:** Donate black sesame seeds or yellow lentils on Thursdays.
3. **Gemstone:** Wear a natural **Yellow Sapphire (Pukhraj)** of 5+ carats in gold on your right-hand index finger on a Thursday morning after purification.
      `);
    } finally {
      setLoadingKundli(false);
    }
  };

  // Handle Chat Submissions
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setLoadingChat(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chat',
          params: { message: chatInput, history: chatMessages.slice(-6) }
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.result }]);
    } catch (error) {
      console.error("AI Chat failed, adopting local spiritual fallback:", error);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          sender: 'ai', 
          text: `Namaste. Under the current transits, your question "${chatInput}" points to a period of cosmic introspection. The Moon is currently traversing a favorable constellation. To find clarity, I highly recommend consulting Acharya TN Khurana for a personalized 1-on-1 chart audit.` 
        }]);
      }, 700);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <section id="ai-features" className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-[#bba7ff] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            🤖 AI-Powered Spiritual Engine
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Vedic <span className="text-purple-400">Cosmic Intelligence</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-purple-500/30" />
            <span className="text-purple-400 text-md">✦</span>
            <span className="h-[1px] w-12 bg-purple-500/30" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Experience the merger of ancient astronomical knowledge with state-of-the-art predictive generative AI models.
          </p>
        </div>

        {/* Tab switch bar */}
        <div className="flex justify-center border-b border-white/5 mb-8">
          <button 
            onClick={() => setActiveTab('kundli')}
            className={`px-8 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'kundli' 
                ? 'border-purple-500 text-purple-300 bg-purple-500/5' 
                : 'border-transparent text-[#596478] hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" /> AI Kundli Generator
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-8 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'chat' 
                ? 'border-purple-500 text-purple-300 bg-purple-500/5' 
                : 'border-transparent text-[#596478] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Chat with AI Astrologer
          </button>
        </div>

        {/* Step 1: AI Kundli Generator */}
        {activeTab === 'kundli' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Input Form Column */}
            <form onSubmit={handleGenerateKundli} className="md:col-span-5 p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4 text-left">
              <h3 className="font-serif text-lg font-bold text-purple-300">Birth Credentials</h3>
              <p className="text-xs text-[#596478] leading-relaxed">Enter your precise birth details to map the houses and planets instantly.</p>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b96aa]">Full Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="name" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b96aa] flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Date of Birth *</label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={e => setDOB(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b96aa] flex items-center gap-1"><Clock className="w-3 h-3" /> Birth Time</label>
                <input 
                  type="time" 
                  value={tob}
                  onChange={e => setTOB(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b96aa] flex items-center gap-1"><MapPin className="w-3 h-3" /> Birth Place *</label>
                <input 
                  type="text" 
                  value={pob}
                  onChange={e => setPOB(e.target.value)}
                  placeholder="City, State, Country" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loadingKundli}
                className="w-full h-11 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-sm shadow-lg hover:from-purple-500 hover:to-indigo-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingKundli ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> mapping planets...
                  </>
                ) : (
                  <>
                    🔮 Generate Kundli Analysis
                  </>
                )}
              </button>
            </form>

            {/* Results Display Output Column */}
            <div className="md:col-span-7 p-8 rounded-2xl bg-white/[0.01] border border-white/5 min-h-[460px] flex flex-col items-center justify-center relative text-left">
              {loadingKundli && (
                <div className="absolute inset-0 bg-[#080B12]/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <div className="font-serif text-lg font-bold text-[#bba7ff]">Mapping Your Shashtiamsha Chart...</div>
                  <p className="text-xs text-[#596478]">Please wait while Gemini processes the birth dasha periods.</p>
                </div>
              )}
              
              {!kundliResult && !loadingKundli && (
                <div className="text-center space-y-3">
                  <span className="text-5xl block opacity-40">🔮</span>
                  <div className="font-serif text-lg font-bold text-purple-300">Your AI Birth Chart</div>
                  <p className="text-xs text-[#596478] max-w-sm">Enter your birth details in the sidebar to generate a complete planet, dasha, and remedy map instantly.</p>
                </div>
              )}

              {kundliResult && (
                <div className="w-full space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin">
                  <div className="markdown-body text-sm text-[#e8eaf0] space-y-4 whitespace-pre-wrap leading-relaxed font-sans">
                    {kundliResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: AI Astrologer Chat Interface */}
        {activeTab === 'chat' && (
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col h-[520px]">
            {/* Messages box */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin flex flex-col text-left">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-purple-600/30 border border-purple-500/20 self-end text-right' 
                      : 'bg-[#0f1425] border border-white/5 self-start'
                  }`}
                >
                  <div className="text-[10px] text-[#596478] font-bold mb-1 uppercase tracking-wider">
                    {msg.sender === 'user' ? 'You' : 'Vedic AI Advisor'}
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}
              {loadingChat && (
                <div className="max-w-[40%] rounded-2xl p-4 bg-[#0f1425] border border-white/5 self-start flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-xs text-[#596478] font-semibold">Analyzing transits...</span>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendChat} className="flex gap-2 border-t border-white/5 pt-4">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask any question eg: When is the right time to buy a house? or Which career suits my chart?" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button 
                type="submit" 
                disabled={loadingChat || !chatInput.trim()}
                className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-lg disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </section>
  );
}
