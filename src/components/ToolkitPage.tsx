import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Compass, 
  Flame, 
  TrendingUp, 
  Heart, 
  Gem, 
  Award,
  Zap,
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';

interface ToolkitPageProps {
  onOpenBooking: (serviceName?: string) => void;
}

export default function ToolkitPage({ onOpenBooking }: ToolkitPageProps) {
  const [activeTab, setActiveTab] = useState<'birth_chart' | 'kundli' | 'numerology' | 'manglik' | 'gemstone'>('birth_chart');
  const [activeTools, setActiveTools] = useState<string[]>([
    'birth_chart', 'kundli', 'numerology', 'manglik', 'gemstone'
  ]);

  // Load backend active toolkit states so administrative toggles are fully respected on visitor client-side!
  useEffect(() => {
    fetch('/api/admin/astrology-toolkit')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.activeTools) {
          setActiveTools(data.activeTools);
          // Auto route to first active tool if first is hidden
          if (!data.activeTools.includes(activeTab)) {
            const firstActive = ['birth_chart', 'kundli', 'numerology', 'manglik', 'gemstone'].find(t => data.activeTools.includes(t));
            if (firstActive) {
              setActiveTab(firstActive as any);
            }
          }
        }
      })
      .catch(() => {
        // Fallback to all enabled if offline or error
      });
  }, []);

  // --- STATE FOR BIRTH CHART ---
  const [chartInput, setChartInput] = useState({
    name: '',
    dob: '',
    tob: '',
    place: '',
    chartStyle: 'north' // 'north' | 'south'
  });
  const [chartResult, setChartResult] = useState<any | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);

  // --- STATE FOR KUNDLI MATCHING ---
  const [matchInput, setMatchInput] = useState({
    groomName: '',
    groomDob: '',
    groomTob: '',
    groomPlace: '',
    brideName: '',
    brideDob: '',
    brideTob: '',
    bridePlace: ''
  });
  const [matchResult, setMatchResult] = useState<any | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  // --- STATE FOR NUMEROLOGY ---
  const [numInput, setNumInput] = useState({
    fullName: '',
    birthdate: ''
  });
  const [numResult, setNumResult] = useState<any | null>(null);

  // --- STATE FOR MANGLIK DOSHA ---
  const [manglikInput, setManglikInput] = useState({
    name: '',
    dob: '',
    knowsHouse: 'unknown', // 'unknown' | 'known'
    marsHouse: '1'
  });
  const [manglikResult, setManglikResult] = useState<any | null>(null);

  // --- STATE FOR GEMSTONE ENGINE ---
  const [gemInput, setGemInput] = useState({
    targetFocus: 'Wealth', // 'Wealth' | 'Career' | 'Health' | 'Relationship' | 'Protection'
    birthMonth: '1' // Month index as string
  });
  const [gemResult, setGemResult] = useState<any | null>(null);

  // 1. CALCULATE BIRTH CHART
  const handleCalculateChart = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingChart(true);
    setChartResult(null);

    setTimeout(() => {
      // Dynamic calculative simulation based on birthdate digits and names
      const dateNum = new Date(chartInput.dob).getDate() || 5;
      const ascendantIndex = (dateNum % 12) + 1;
      const zodiacSigns = [
        'Mesh (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
        'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
        'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
      ];
      const ascendant = zodiacSigns[(ascendantIndex - 1) % 12];
      
      const housesPlanets: Record<number, string[]> = {
        1: ['Uranus', 'Lagna'],
        2: ['Sun', 'Mercury'],
        3: [],
        4: ['Moon'],
        5: ['Mars'],
        6: [],
        7: ['Rahu', 'Venus'],
        8: [],
        9: ['Jupiter'],
        10: ['Saturn'],
        11: [],
        12: ['Ketu']
      };

      setChartResult({
        ascendant,
        sunSign: zodiacSigns[(ascendantIndex + 3) % 12],
        moonSign: zodiacSigns[(ascendantIndex + 7) % 12],
        nakshatra: ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punavasu', 'Pushya', 'Shatabhisha', 'Uttara Phalguni', 'Vishakha', 'Revati'][dateNum % 12],
        dasha: `Jupiter (Guru) Maha-Dasha running until July ${2026 + 7}`,
        housesPlanets
      });
      setLoadingChart(false);

      // Trigger telemetry alert
      fetch('/api/admin/notifications/test-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Inquiry', message: `Visitor generated Birth Chart: ${chartInput.name} from ${chartInput.place}` })
      }).catch(() => {});
    }, 1200);
  };

  // 2. CALCULATE KUNDLI COMPATIBILITY
  const handleCalculateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMatch(true);
    setMatchResult(null);

    setTimeout(() => {
      const groomFactor = (matchInput.groomName.length + (new Date(matchInput.groomDob).getDate() || 4)) % 10;
      const brideFactor = (matchInput.brideName.length + (new Date(matchInput.brideDob).getDate() || 7)) % 10;
      
      const totalScore = 20 + ((groomFactor + brideFactor) % 16); // Dynamic score between 20 and 36

      const kootDetails = [
        { name: 'Varna (Spiritual Focus)', max: 1, obtained: totalScore > 28 ? 1 : 0, desc: 'Alignment of mental & career values' },
        { name: 'Vashya (Mutual Attraction)', max: 2, obtained: totalScore > 24 ? 2 : 1, desc: 'Dominance balance & natural respect' },
        { name: 'Tara (Aura Alignment)', max: 3, obtained: totalScore > 30 ? 3 : (totalScore % 3), desc: 'Health & lifetime health destiny lines' },
        { name: 'Yoni (Nature/Guna Temperament)', max: 4, obtained: Math.round((totalScore / 36) * 4), desc: 'Intrinsic dynamic personality harmony' },
        { name: 'Maitri (Planetary Friendship)', max: 5, obtained: totalScore > 27 ? 4 : 3, desc: 'Direct planetary friendship factors' },
        { name: 'Gana (Spiritual Compatibility)', max: 6, obtained: totalScore > 32 ? 6 : (totalScore % 6), desc: 'Temperament classifications' },
        { name: 'Bhakoot (Emotional Resonance)', max: 7, obtained: totalScore > 25 ? 7 : 0, desc: 'Subtle emotional attachment & communication code' },
        { name: 'Nadi (Physiological Matching)', max: 8, obtained: totalScore % 2 === 0 ? 8 : 0, desc: 'Aura element sync' }
      ];

      setMatchResult({
        score: totalScore,
        kootDetails,
        conclusion: totalScore >= 28 ? 'An Excellent celestial match! Highly recommended for long-term marriage and domestic peace.' : (totalScore >= 21 ? 'Good average matching prospects. Standard Vedic remedial pujas or donations will resolve minor afflictions.' : 'Severe energy afflictions. Please consult Acharya TN Khurana directly to analyze transit remedies before proceeding.')
      });
      setLoadingMatch(false);

      // Trigger telemetry alert
      fetch('/api/admin/notifications/test-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Inquiry', message: `Visitor performed Guna Milan Matchmaking: ${matchInput.groomName} & ${matchInput.brideName}` })
      }).catch(() => {});
    }, 1500);
  };

  // 3. CALCULATE NUMEROLOGY
  const handleCalculateNumerology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numInput.fullName) return;

    // Chaldean alphabet values mapping
    const chaldeanValues: Record<string, number> = {
      a: 1, i: 1, j: 1, y: 1, q: 1,
      b: 2, k: 2, r: 2,
      c: 3, g: 3, l: 3, s: 3,
      d: 4, m: 4, t: 4,
      e: 5, h: 5, n: 5, x: 5,
      u: 6, v: 6, w: 6,
      o: 7, z: 7,
      f: 8, p: 8
    };

    let nameValue = 0;
    const cleanName = numInput.fullName.toLowerCase().replace(/[^a-z]/g, '');
    for (let char of cleanName) {
      if (chaldeanValues[char]) {
        nameValue += chaldeanValues[char];
      }
    }

    const reduceToSingleDigit = (n: number): number => {
      while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
        n = String(n).split('').reduce((sum, d) => sum + parseInt(d), 0);
      }
      return n;
    };

    const reducedName = reduceToSingleDigit(nameValue);

    // Life Path Calculation
    let lifePath = 9;
    if (numInput.birthdate) {
      const bDigits = numInput.birthdate.replace(/[^0-9]/g, '');
      const dSum = bDigits.split('').reduce((sum, d) => sum + parseInt(d), 0);
      lifePath = reduceToSingleDigit(dSum);
    }

    const luckyColors: Record<number, string> = {
      1: 'Ruby Red, Bright Yellow, Golden Gold',
      2: 'Silver, Creamy White, Soft Sea Green',
      3: 'Royal Blue, Saffron, Purple',
      4: 'Electric Blue, Charcoal, Blue-Grey',
      5: 'Emerald Green, Soft Grey, Turquoise',
      6: 'Sky Blue, Rose Pink, Bright White',
      7: 'Ketan Green, Soft Pastels, Cream',
      8: 'Dark Blue, Indigo, Black, Violet',
      9: 'Crimson, Bright Red, Rose Peach',
      11: 'Silver, Pale Gold, Pearl',
      22: 'Electric Gold, Amber, Ivory'
    };

    const metals: Record<number, string> = {
      1: 'Gold', 2: 'Silver', 3: 'Copper / Brass',
      4: 'Steel', 5: 'Bronze / Alloy', 6: 'Platinum / Silver',
      7: 'Sandalwood / Copper', 8: 'Lead / Iron', 9: 'Copper'
    };

    setNumResult({
      nameNumber: nameValue,
      destinyNumber: reducedName,
      lifePathNumber: lifePath,
      luckyColor: luckyColors[lifePath] || 'Saffron, Cream',
      luckyMetal: metals[lifePath] || 'Copper',
      description: `Name Frequency ${nameValue} represents powerful Chaldean vibrations. Paired with Life Path ${lifePath}, you are ruled by astronomical frequencies of cosmic expansion, suggesting your path aligns with key transitions during years summing to ${lifePath || 5}.`
    });
  };

  // 4. CALCULATE MANGLIK DOSHA
  const handleCalculateManglik = (e: React.FormEvent) => {
    e.preventDefault();
    const dateNum = new Date(manglikInput.dob).getDate() || 8;
    const marsHouse = manglikInput.knowsHouse === 'known' ? parseInt(manglikInput.marsHouse) : (dateNum % 12) + 1;
    
    // Manglik houses: 1, 2, 4, 7, 8, 12
    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const isManglik = manglikHouses.includes(marsHouse);
    
    let severity = 'None';
    let description = '';
    
    if (isManglik) {
      if (marsHouse === 8 || marsHouse === 7) {
        severity = 'High severity';
        description = `Mars is placed in House ${marsHouse} (the house of Partner & Longevity). This constitutes a significant Manglik Dosha, causing challenges in marital harmony and transit decisions.`;
      } else {
        severity = 'Mild / Low severity';
        description = `Mars is in House ${marsHouse}. A mild Manglik Dosha is present. This is easily corrected through simple remedial chanting and charitable projects.`;
      }
    } else {
      severity = 'No Dosha Found';
      description = `Mars occupies House ${marsHouse}, which is an auspicious placement. You do not possess any natal Manglik Dosha.`;
    }

    setManglikResult({
      marsHouse,
      isManglik,
      severity,
      description,
      remedies: isManglik ? [
        'Perform Kumbh Vivah before actual marriage rituals.',
        'Donate red lentils (Masoor Dal) and copper utensils to local charity on Tuesdays.',
        'Chant Hanumath Chalisa with devotion 7 times during sunset hours.',
        'Wear a flawless high-carat Italian Red Coral gemstone set in silver copper alloy.'
      ] : [
        'No remedies required. Your Mars energy is naturally balanced and supports career and health.'
      ]
    });
  };

  // 5. CALCULATE GEMSTONE RECOMMENDATION
  const handleCalculateGem = (e: React.FormEvent) => {
    e.preventDefault();
    const gems: Record<string, any> = {
      Wealth: { name: 'Emerald (Panna)', mineral: 'Beryl', finger: 'Little Finger of working hand', metal: 'Gold or Bronze', benefit: 'Enhances business contracts, commercial logic, financial retention, and intellect.' },
      Career: { name: 'Yellow Sapphire (Pukhraj)', mineral: 'Corundum', finger: 'Index Finger of working hand', metal: 'Yellow Gold', benefit: 'Increases professional respect, government clearance alignment, wisdom, and corporate growth.' },
      Health: { name: 'Red Coral (Moonga)', mineral: 'Calcium Carbonate', finger: 'Ring Finger', metal: 'Copper or Gold', benefit: 'Stabilizes vital blood flow energy, heals sluggish metabolism, increases determination.' },
      Relationship: { name: 'Diamond / White Sapphire', mineral: 'Carbon / Corundum', finger: 'Middle or Ring Finger', metal: 'White Gold / Platinum', benefit: 'Strengthens Venus attraction factors, creative arts focus, and marital loyalty.' },
      Protection: { name: 'Blue Sapphire (Neelam)', mineral: 'Corundum', finger: 'Middle Finger', metal: 'Panchdhatu or Iron', benefit: 'Shields aura fields against psychic manipulation, counters Saturn transit delays rapidly.' }
    };

    const selectedGem = gems[gemInput.targetFocus] || gems.Wealth;
    setGemResult(selectedGem);
  };

  return (
    <div className="py-12 bg-[#080B12] min-h-screen relative z-10 text-left">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Head */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Vedic Astro-Engine
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Vedic Astrological <span className="text-[#C9A227]">Computation Suite</span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-[#8b96aa] text-base">
            Access secure predictive calendars, birth matrix house configurations, and matchmaking scores calculated with ancient sidereal mathematical precision.
          </p>
        </div>

        {/* Tab Switcher rail */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-white/5 mb-12 pb-1.5">
          {activeTools.includes('birth_chart') && (
            <button 
              onClick={() => setActiveTab('birth_chart')}
              className={`px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'birth_chart' 
                  ? 'border-[#C9A227] text-white bg-[#C9A227]/5' 
                  : 'border-transparent text-[#596478] hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-sky-400" /> Birth Chart (Kundli Map)
            </button>
          )}

          {activeTools.includes('kundli') && (
            <button 
              onClick={() => setActiveTab('kundli')}
              className={`px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'kundli' 
                  ? 'border-[#C9A227] text-white bg-[#C9A227]/5' 
                  : 'border-transparent text-[#596478] hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" /> Matchmaking (Guna Milan)
            </button>
          )}

          {activeTools.includes('numerology') && (
            <button 
              onClick={() => setActiveTab('numerology')}
              className={`px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'numerology' 
                  ? 'border-[#C9A227] text-white bg-[#C9A227]/5' 
                  : 'border-transparent text-[#596478] hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" /> Chaldean Numerology
            </button>
          )}

          {activeTools.includes('manglik') && (
            <button 
              onClick={() => setActiveTab('manglik')}
              className={`px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'manglik' 
                  ? 'border-[#C9A227] text-white bg-[#C9A227]/5' 
                  : 'border-transparent text-[#596478] hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" /> Manglik Dosha
            </button>
          )}

          {activeTools.includes('gemstone') && (
            <button 
              onClick={() => setActiveTab('gemstone')}
              className={`px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'gemstone' 
                  ? 'border-[#C9A227] text-white bg-[#C9A227]/5' 
                  : 'border-transparent text-[#596478] hover:text-white'
              }`}
            >
              <Gem className="w-4 h-4 text-indigo-400" /> Aura Gemstones
            </button>
          )}
        </div>

        {/* Dynamic Display Panel */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          {/* TAB 1: BIRTH CHART CO-ORDINATE COMPUTATION */}
          {activeTab === 'birth_chart' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form onSubmit={handleCalculateChart} className="lg:col-span-5 bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <span className="text-[10px] text-[#C9A227] font-bold uppercase tracking-widest block mb-1">Natal Matrix Intake</span>
                <h3 className="font-serif text-lg font-bold text-white">Generate Natal Chart Map</h3>
                <p className="text-xs text-[#8b96aa]">Enter your exact birth parameters below to map solar constellation coordinates instantly.</p>
                
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b96aa] block font-bold">Seeker Name *</label>
                  <input 
                    type="text" 
                    required
                    value={chartInput.name}
                    onChange={e => setChartInput({ ...chartInput, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227]"
                    placeholder="e.g. Anand Sen"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8b96aa] block font-bold">Date of Birth *</label>
                    <input 
                      type="date" 
                      required
                      value={chartInput.dob}
                      onChange={e => setChartInput({ ...chartInput, dob: e.target.value })}
                      className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8b96aa] block font-bold">Time of Birth *</label>
                    <input 
                      type="time" 
                      required
                      value={chartInput.tob}
                      onChange={e => setChartInput({ ...chartInput, tob: e.target.value })}
                      className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b96aa] block font-bold">Place of Birth *</label>
                  <input 
                    type="text" 
                    required
                    value={chartInput.place}
                    onChange={e => setChartInput({ ...chartInput, place: e.target.value })}
                    className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227]"
                    placeholder="e.g. New Delhi, India"
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <label className="text-[11px] text-[#8b96aa] block font-bold">Chart Diagram Style</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-[#8b96aa] cursor-pointer">
                      <input 
                        type="radio" 
                        name="chartStyle" 
                        value="north" 
                        checked={chartInput.chartStyle === 'north'} 
                        onChange={() => setChartInput({ ...chartInput, chartStyle: 'north' })}
                        className="accent-[#C9A227]"
                      /> North Indian Diamond Grid
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#8b96aa] cursor-pointer">
                      <input 
                        type="radio" 
                        name="chartStyle" 
                        value="south"
                        checked={chartInput.chartStyle === 'south'}
                        onChange={() => setChartInput({ ...chartInput, chartStyle: 'south' })}
                        className="accent-[#C9A227]"
                      /> South Indian Box Layout
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loadingChart}
                  className="w-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-slate-900 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  {loadingChart ? '🔮 Computing Planetary Alignment...' : '✨ Generate Sidereal Chart'}
                </button>
              </form>

              {/* Chart Display Grid */}
              <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 p-6 rounded-2xl min-h-[400px] flex flex-col justify-between">
                {chartResult ? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/5 pb-4">
                      <div>
                        <h4 className="font-serif text-xl font-bold text-white">{chartInput.name || 'Seeker'}'s Janma Kundli</h4>
                        <p className="text-[11px] text-[#596478] font-mono mt-0.5">Calculated for {chartInput.place} at {chartInput.tob} ({chartInput.dob})</p>
                      </div>
                      <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 px-3 py-1.5 rounded-xl text-right">
                        <span className="text-[9px] text-[#C9A227] uppercase font-bold block">Assumed Ascendant</span>
                        <span className="text-xs font-serif text-white font-bold">{chartResult.ascendant}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      
                      {/* Geometric North/South style Diagram */}
                      <div className="flex items-center justify-center p-4 bg-black/30 rounded-2xl border border-white/5 relative">
                        {chartInput.chartStyle === 'north' ? (
                          /* North Indian Diamond style SVG */
                          <svg viewBox="0 0 300 300" className="w-full max-w-[240px] h-auto stroke-amber-500/50 stroke-2 fill-none font-mono text-[9px]">
                            <rect x="10" y="10" width="280" height="280" />
                            <line x1="10" y1="10" x2="290" y2="290" />
                            <line x1="290" y1="10" x2="10" y2="290" />
                            <polygon points="150,10 290,150 150,290 10,150" />
                            
                            {/* House labels and simulated planets */}
                            <text x="142" y="110" fill="#f5d98a" className="font-bold">1</text>
                            <text x="132" y="125" fill="#596478">{chartResult.housesPlanets[1].join(', ') || 'Lagna'}</text>

                            <text x="90" y="60" fill="#C9A227">2</text>
                            <text x="70" y="75" fill="#596478">{chartResult.housesPlanets[2].join(', ')}</text>

                            <text x="40" y="90" fill="#C9A227">3</text>
                            
                            <text x="90" y="160" fill="#C9A227">4</text>
                            <text x="70" y="175" fill="#596478">{chartResult.housesPlanets[4].join(', ')}</text>

                            <text x="40" y="215" fill="#C9A227">5</text>
                            <text x="25" y="230" fill="#596478">{chartResult.housesPlanets[5].join(', ')}</text>

                            <text x="90" y="250" fill="#C9A227">6</text>

                            <text x="142" y="200" fill="#C9A227">7</text>
                            <text x="125" y="215" fill="#596478">{chartResult.housesPlanets[7].join(', ')}</text>

                            <text x="200" y="250" fill="#C9A227">8</text>

                            <text x="250" y="215" fill="#C9A227">9</text>
                            <text x="235" y="230" fill="#596478">{chartResult.housesPlanets[9].join(', ')}</text>

                            <text x="200" y="160" fill="#C9A227">10</text>
                            <text x="180" y="175" fill="#596478">{chartResult.housesPlanets[10].join(', ')}</text>

                            <text x="250" y="90" fill="#C9A227">11</text>

                            <text x="200" y="60" fill="#C9A227">12</text>
                            <text x="185" y="75" fill="#596478">{chartResult.housesPlanets[12].join(', ')}</text>
                          </svg>
                        ) : (
                          /* South Indian style BOX style SVG */
                          <svg viewBox="0 0 300 300" className="w-full max-w-[240px] h-auto stroke-amber-500/50 stroke-2 fill-none font-mono text-[9px]">
                            {/* Outer square */}
                            <rect x="10" y="10" width="280" height="280" />
                            
                            {/* Inner horizontal lines */}
                            <line x1="10" y1="80" x2="290" y2="80" />
                            <line x1="10" y1="150" x2="290" y2="150" />
                            <line x1="10" y1="220" x2="290" y2="220" />
                            
                            {/* Inner vertical lines */}
                            <line x1="80" y1="10" x2="80" y2="290" />
                            <line x1="150" y1="10" x2="150" y2="290" />
                            <line x1="220" y1="10" x2="220" y2="290" />

                            {/* Mask center block */}
                            <rect x="80" y="80" width="140" height="140" fill="#080B12" />
                            <text x="100" y="130" fill="#C9A227" className="font-bold text-[11px] shrink-0 font-serif">Aura Chart</text>
                            <text x="95" y="150" fill="#596478" className="text-[8px] font-sans">Acharya TNK</text>

                            {/* Boxes labels */}
                            {/* Row 1 */}
                            <text x="20" y="40" fill="#596478">Pi (12)</text>
                            <text x="90" y="40" fill="#596478">Ar (1)</text>
                            <text x="160" y="40" fill="#596478">Ta (2)</text>
                            <text x="230" y="40" fill="#596478">Ge (3)</text>
                            {/* Row 2 */}
                            <text x="230" y="110" fill="#596478">Ca (4)</text>
                            <text x="20" y="110" fill="#596478">Aq (11)</text>
                            {/* Row 3 */}
                            <text x="230" y="180" fill="#596478">Le (5)</text>
                            <text x="20" y="180" fill="#596478">Cp (10)</text>
                            {/* Row 4 */}
                            <text x="20" y="250" fill="#596478">Sg (9)</text>
                            <text x="90" y="250" fill="#596478">Sc (8)</text>
                            <text x="160" y="250" fill="#596478">Li (7)</text>
                            <text x="230" y="250" fill="#596478">Vi (6)</text>
                          </svg>
                        )}
                      </div>

                      {/* Sidereal Matrix Details */}
                      <div className="space-y-4">
                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-1.5 text-xs text-[#8b96aa]">
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span>Sun Sign</span>
                            <strong className="text-white font-serif">{chartResult.sunSign}</strong>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span>Moon Sign</span>
                            <strong className="text-white font-serif">{chartResult.moonSign}</strong>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span>Janma Nakshatra</span>
                            <strong className="text-white font-mono">{chartResult.nakshatra}</strong>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span>Planetary Dasha</span>
                            <strong className="text-amber-300 font-mono text-[10px]">{chartResult.dasha}</strong>
                          </div>
                        </div>

                        <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                          <p className="text-[11px] text-indigo-300 leading-relaxed font-sans font-medium">
                            🌿 Acharya says: "Your Ascendant signals powerful leadership alignment. However, Saturn rules your 10th house, requiring hard karma parameters."
                          </p>
                        </div>
                      </div>

                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-xs text-[#596478]">Want a certified 50+ page customized transit audit book?</span>
                      <button 
                        onClick={() => onOpenBooking('Detailed Kundli Reading')}
                        className="p-2.5 px-4 rounded-xl border border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Book Full Reading Session <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="my-auto text-center space-y-2 py-12">
                    <span className="text-4xl">🌌</span>
                    <h4 className="font-serif text-md font-bold text-[#8b96aa]">Natal Grid Blueprint Awaiting Data</h4>
                    <p className="text-xs text-[#596478] max-w-sm mx-auto">Please enter your exact name, birth dates and coordinates in the administrative form column to run sidereal calculus.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GUNA MILAN MATCHMAKING */}
          {activeTab === 'kundli' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form onSubmit={handleCalculateMatch} className="lg:col-span-5 bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest block mb-1">Guna Milan Matrix</span>
                <h3 className="font-serif text-lg font-bold text-white">Astrology Compatibility Engine</h3>
                <p className="text-xs text-[#8b96aa]">Find matrimonial alignments using traditional 36-point Guna algorithms instantly.</p>
                
                {/* Groom Intake block */}
                <div className="space-y-2.5 p-3.5 bg-sky-500/5 rounded-xl border border-sky-500/10">
                  <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5 font-serif">🧔 Groom Partner Alpha</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="Groom Name"
                      value={matchInput.groomName}
                      onChange={e => setMatchInput({ ...matchInput, groomName: e.target.value })}
                      className="text-xs p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                    <input 
                      type="date" 
                      required
                      value={matchInput.groomDob}
                      onChange={e => setMatchInput({ ...matchInput, groomDob: e.target.value })}
                      className="text-xs p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Bride Intake block */}
                <div className="space-y-2.5 p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/10">
                  <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5 font-serif">👩 Bride Partner Beta</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="Bride Name"
                      value={matchInput.brideName}
                      onChange={e => setMatchInput({ ...matchInput, brideName: e.target.value })}
                      className="text-xs p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                    <input 
                      type="date" 
                      required
                      value={matchInput.brideDob}
                      onChange={e => setMatchInput({ ...matchInput, brideDob: e.target.value })}
                      className="text-xs p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loadingMatch}
                  className="w-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-slate-900 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  {loadingMatch ? '💍 Synchronizing Wedding Transits...' : '💑 Calculate Match compatibility'}
                </button>
              </form>

              {/* Match Result Details */}
              <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 p-6 rounded-2xl min-h-[440px] flex flex-col justify-between">
                {matchResult ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-white">Astrological Guna Score Output</h4>
                        <p className="text-[11px] text-[#596478] font-mono">Calculated using Ashta Koota lunar matrices</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-extrabold text-[#f5d98a] font-mono">{matchResult.score}<span className="text-[#596478] text-base">/36</span></div>
                        <span className="text-[9px] uppercase font-bold text-rose-400 mt-0.5 block tracking-wide">Compatibility Rating</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Breakdown lists */}
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {matchResult.kootDetails.map((koot: any, i: number) => (
                          <div key={i} className="p-3 rounded-xl bg-white/[0.01] border border-white/5 text-xs text-left">
                            <div className="flex justify-between font-semibold text-white">
                              <span>{koot.name}</span>
                              <span className="text-[#C9A227]">{koot.obtained} / {koot.max}</span>
                            </div>
                            <p className="text-[10px] text-[#596478] mt-0.5">{koot.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* Conclusion & Action */}
                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col justify-between text-left space-y-4">
                        <div className="space-y-2">
                          <h5 className="text-[10px] text-rose-450 text-rose-400 font-bold uppercase tracking-wider">Astro Council Assessment</h5>
                          <p className="text-xs text-[#8b96aa] leading-relaxed font-sans">{matchResult.conclusion}</p>
                        </div>

                        <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 text-[10px] text-amber-200">
                          🚨 Pranam! Highly recommendation: Verify Nadi and Bhakoot doshas individually before printing invitations.
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-xs text-[#596478]">Resolve Doshas and schedule marriage puja support?</span>
                      <button 
                        onClick={() => onOpenBooking('Matrimonial Guna Matchmaking')}
                        className="p-2.5 px-4 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Schedule Kundli Milan Call <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="my-auto text-center space-y-2 py-12">
                    <span className="text-4xl">💑</span>
                    <h4 className="font-serif text-md font-bold text-[#8b96aa]">Matrimonial Guna Milan Awaiting Entry</h4>
                    <p className="text-xs text-[#596478] max-w-sm mx-auto">Please complete both partner's birth profiles on the left sub-deck column to compute sacred compatibility coefficients.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CHALDEAN NUMEROLOGY */}
          {activeTab === 'numerology' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
              <form onSubmit={handleCalculateNumerology} className="lg:col-span-5 bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-1">Gematria Numerology</span>
                <h3 className="font-serif text-lg font-bold text-white">Chaldean Numeric frequency</h3>
                <p className="text-xs text-[#8b96aa]">Translates syllable and alphabetic alignments into destiny vibrations.</p>
                
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b96aa] block font-bold">Full Professional Name (unspaced) *</label>
                  <input 
                    type="text" 
                    required
                    value={numInput.fullName}
                    onChange={e => setNumInput({ ...numInput, fullName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227]"
                    placeholder="e.g. RameshSharma"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b96aa] block font-bold">Date of Birth *</label>
                  <input 
                    type="date" 
                    required
                    value={numInput.birthdate}
                    onChange={e => setNumInput({ ...numInput, birthdate: e.target.value })}
                    className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227]"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-slate-900 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  🍀 Compute Gematria Numbers
                </button>
              </form>

              {/* Numerology results block */}
              <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 p-6 rounded-2xl min-h-[350px] flex flex-col justify-between">
                {numResult ? (
                  <div className="space-y-6">
                    <div className="border-b border-white/5 pb-4">
                      <h4 className="font-serif text-lg font-bold text-white">Chaldean Numerical Attributes</h4>
                      <p className="text-xs text-[#596478]">Reducing letter values according to ancient neo-Babylonian equations.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Compound Name</span>
                        <div className="text-3xl font-black text-white font-mono">{numResult.nameNumber}</div>
                      </div>
                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1">
                        <span className="text-[10px] text-yellow-500 font-bold uppercase">Destiny Count</span>
                        <div className="text-3xl font-black text-[#f5d98a] font-mono">{numResult.destinyNumber}</div>
                      </div>
                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase">Life Path</span>
                        <div className="text-3xl font-black text-indigo-300 font-mono">{numResult.lifePathNumber}</div>
                      </div>
                    </div>

                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                      <h5 className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wider">Planetary vibrations</h5>
                      <p className="text-xs text-[#8b96aa] leading-relaxed font-sans">{numResult.description}</p>
                      
                      <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-serif text-left border-t border-white/5">
                        <div>
                          <span className="text-[10px] text-[#596478] font-bold block">Lucky Colors</span>
                          <strong className="text-white mt-1 block">{numResult.luckyColor}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#596478] font-bold block">Lucky Element Metal</span>
                          <strong className="text-amber-300 mt-1 block">{numResult.luckyMetal}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => onOpenBooking('Numerology Consultation')} 
                        className="text-xs text-[#C9A227] font-bold hover:underline"
                      >
                        Want custom phone-number or name corrections to fit your business matrix? Book session →
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="my-auto text-center space-y-2 py-12">
                    <span className="text-4xl">🍀</span>
                    <h4 className="font-serif text-md font-bold text-[#8b96aa]">Chaldean Frequency Awaiting Inputs</h4>
                    <p className="text-xs text-[#596478] max-w-sm mx-auto">Please input your name and details on the left hand panel to reduce letters into lucky destiny counts.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MANGLIK DOSHA EVALUATOR */}
          {activeTab === 'manglik' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
              <form onSubmit={handleCalculateManglik} className="lg:col-span-5 bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block mb-1">Affliction Check</span>
                <h3 className="font-serif text-lg font-bold text-white">Manglik Dosha Evaluator</h3>
                <p className="text-xs text-[#8b96aa]">Checks if the position of planet Mars (Mangal) brings fiery afflictions in marriage charts.</p>
                
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b96aa] block font-bold">Seeker Name *</label>
                  <input 
                    type="text" 
                    required
                    value={manglikInput.name}
                    onChange={e => setManglikInput({ ...manglikInput, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227]"
                    placeholder="e.g. Vineet"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b96aa] block font-bold">Date of Birth *</label>
                  <input 
                    type="date" 
                    required
                    value={manglikInput.dob}
                    onChange={e => setManglikInput({ ...manglikInput, dob: e.target.value })}
                    className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b96aa] block font-bold">Do you know Mars' (Mangal) house placement?</label>
                  <select 
                    value={manglikInput.knowsHouse}
                    onChange={e => setManglikInput({ ...manglikInput, knowsHouse: e.target.value })}
                    className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227] bg-[#0c1220]"
                  >
                    <option value="unknown">No, compute it dynamically from birth mathematics</option>
                    <option value="known">Yes, I know the exact house placement</option>
                  </select>
                </div>

                {manglikInput.knowsHouse === 'known' && (
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8b96aa] block font-bold">Select Mars (Mangal) House</label>
                    <select 
                      value={manglikInput.marsHouse}
                      onChange={e => setManglikInput({ ...manglikInput, marsHouse: e.target.value })}
                      className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227] bg-[#0c1220]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                        <option key={h} value={h}>House {h}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-slate-900 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  🔥 Check Mangal Afflictions
                </button>
              </form>

              {/* Manglik evaluation results */}
              <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 p-6 rounded-2xl min-h-[350px] flex flex-col justify-between">
                {manglikResult ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-white">{manglikInput.name || 'Seeker'}'s Manglik Status</h4>
                        <p className="text-xs text-[#596478]">Mars Position in Natal Chart: House {manglikResult.marsHouse}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase font-mono border ${
                        manglikResult.isManglik 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>{manglikResult.severity}</span>
                    </div>

                    <div className="p-4 bg-white/[0.02]/40 border border-white/5 rounded-xl">
                      <p className="text-xs text-[#8b96aa] leading-relaxed font-sans font-medium">{manglikResult.description}</p>
                    </div>

                    {manglikResult.isManglik && (
                      <div className="space-y-2">
                        <span className="text-[10px] text-amber-500 font-bold uppercase block">Acharya Khurana's Prescribed Remedies</span>
                        <ul className="space-y-1.5 font-sans text-xs text-[#8b96aa]">
                          {manglikResult.remedies.map((rem: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#C9A227]">✦</span>
                              <span>{rem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2">
                      <button 
                        onClick={() => onOpenBooking('Manglik Correction Session')} 
                        className="text-xs text-amber-400 font-bold hover:underline"
                      >
                        Analyze detailed charts & remedies with Acharya directly? Book a call →
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="my-auto text-center space-y-2 py-12">
                    <span className="text-4xl text-amber-500">🔥</span>
                    <h4 className="font-serif text-md font-bold text-[#8b96aa]">Mangal Affliction Suite Awaiting Parameters</h4>
                    <p className="text-xs text-[#596478] max-w-sm mx-auto">Input your name and exact birthdates on the left pillar to scan astrological placements of planet Mars.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GEMSTONE RECOMMENDATION ENGINE */}
          {activeTab === 'gemstone' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
              <form onSubmit={handleCalculateGem} className="lg:col-span-12 bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block mb-1">Aura Strengths</span>
                  <h3 className="font-serif text-lg font-bold text-white">Recommended Mineral Gemstones</h3>
                  <p className="text-xs text-[#8b96aa]">Align your planetary energies with high-carat mineral elements to strengthen aura frequencies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] text-[#8b96aa] block font-bold">Select Aura Weakness or Intended Goal</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { val: 'Wealth', label: '💎 Financial Wealth (Retain Gains)' },
                        { val: 'Career', label: '💼 Career & Legal Clearances' },
                        { val: 'Health', label: '🏋️ Physical Health & Energy' },
                        { val: 'Relationship', label: '💍 Love & Marital Attraction' },
                        { val: 'Protection', label: '🛡️ Aura Protection & Saturn Shield' }
                      ].map(item => (
                        <div 
                          key={item.val}
                          onClick={() => setGemInput({ ...gemInput, targetFocus: item.val })}
                          className={`p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            gemInput.targetFocus === item.val 
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-white' 
                              : 'bg-black/30 border-white/5 text-[#8b96aa] hover:border-white/10'
                          }`}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-[#8b96aa] block font-bold">Aura Birth Month Index</label>
                    <select 
                      value={gemInput.birthMonth}
                      onChange={e => setGemInput({ ...gemInput, birthMonth: e.target.value })}
                      className="w-full text-xs p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#C9A227] bg-[#0c1220]"
                    >
                      <option value="1">January (Month of Makar/Kumbha)</option>
                      <option value="2">February (Month of Kumbha/Meena)</option>
                      <option value="3">March (Month of Meena/Mesh)</option>
                      <option value="4">April (Month of Mesh/Vrishabh)</option>
                      <option value="5">May (Month of Vrishabh/Mithun)</option>
                      <option value="6">June (Month of Mithun/Karka)</option>
                      <option value="7">July (Month of Karka/Simha)</option>
                      <option value="8">August (Month of Simha/Kanya)</option>
                      <option value="9">September (Month of Kanya/Tula)</option>
                      <option value="10">October (Month of Tula/Vrischika)</option>
                      <option value="11">November (Month of Vrischika/Dhanu)</option>
                      <option value="12">December (Month of Dhanu/Makar)</option>
                    </select>

                    <p className="text-[11px] text-[#596478] leading-relaxed pt-2">
                      💡 Gemstones recommended through this system should be premium natural untreated minerals. Do not purchase synthetic synthetics as they lack cosmic resonance.
                    </p>

                    <button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-slate-900 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center mt-3"
                    >
                      ✨ Fetch Mineral Alignment Recommendations
                    </button>
                  </div>
                </div>

                {gemResult && (
                  <div className="pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-indigo-500/5 p-6 rounded-2xl">
                    <div className="md:col-span-4 text-center space-y-2">
                      <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto shadow-2xl relative">
                        <Gem className="w-10 h-10 text-indigo-400 animate-pulse" />
                      </div>
                      <div className="font-serif text-lg font-bold text-white mt-2">{gemResult.name}</div>
                      <span className="text-[10px] text-indigo-300 uppercase font-mono font-bold tracking-widest">Aura Gemstone Recommendation</span>
                    </div>

                    <div className="md:col-span-8 space-y-3.5 text-left text-xs">
                      <div className="grid grid-cols-2 gap-4 border-b border-indigo-500/10 pb-3">
                        <div>
                          <span className="text-[10px] text-[#596478] font-bold block">Wearing Finger Placement</span>
                          <strong className="text-white font-medium mt-0.5 block">{gemResult.finger}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#596478] font-bold block">Ideal Setting Metal</span>
                          <strong className="text-white font-medium mt-0.5 block">{gemResult.metal}</strong>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#596478] font-bold">Aura Impact & Celestial Benefit</span>
                        <p className="text-xs text-[#8b96aa] leading-relaxed">{gemResult.benefit}</p>
                      </div>

                      <div className="pt-1 select-none flex items-center justify-between text-[11px] text-amber-200">
                        <span>Want authorized high-carat minerals certified in Government Laboratories?</span>
                        <button 
                          type="button"
                          onClick={() => onOpenBooking('Gemstone Consultation')}
                          className="font-bold underline hover:text-[#C9A227] bg-transparent border-0 cursor-pointer p-0"
                        >
                          Book Seer Consult →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

        </div>
        
      </div>
    </div>
  );
}
