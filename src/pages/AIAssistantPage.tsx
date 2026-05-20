import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import RainbowButton from '../components/RainbowButton';
import SceneBg from '../components/SceneBg';

const SUGGESTED = [
  'What are the five pillars of Islam?',
  'Tell me about Surah Al-Kahf',
  'What are the best duas for daily life?',
  'How to improve my dhikr practice?',
  'What is the significance of Ramadan?',
  'Explain the concept of Tawhid',
  'What is the history of the Kaaba?',
  'How to achieve Khushu in Salah?',
];

const KB: Record<string, string> = {
  pillars: 'The Five Pillars of Islam:\n\n1. Shahada — Testifying there is no god but Allah and Muhammad (pbuh) is His Messenger.\n\n2. Salah — Five daily prayers.\n\n3. Zakat — Giving 2.5% of savings to those in need.\n\n4. Sawm — Fasting during Ramadan.\n\n5. Hajj — Pilgrimage to Makkah at least once if able.',
  kahf: "Surah Al-Kahf (The Cave) is the 18th chapter with 110 ayahs. Four major stories:\n\n1. The People of the Cave — Youth who sought refuge to protect their faith.\n2. The Owner of Two Gardens — A test of wealth and gratitude.\n3. Musa and Al-Khidr — Divine wisdom beyond human understanding.\n4. Dhul-Qarnayn — A just ruler and Gog and Magog.\n\nReading it on Fridays brings special blessings.",
  duas: "Essential daily duas:\n\nMorning: 'اللَّهُمَّ بِكَ أَصْبَحْنَا' — O Allah, by Your leave we have reached the morning.\n\nBefore eating: 'بِسْمِ اللَّهِ' — In the name of Allah.\n\nBefore sleeping: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا' — In Your name, O Allah, I die and I live.\n\nFor guidance: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي' — O Allah, guide me.",
  dhikr: "To improve dhikr:\n\n1. Consistency over quantity.\n2. Focus on meanings.\n3. Best time: after obligatory prayers.\n4. Recommended: SubhanAllah ×33, Alhamdulillah ×33, Allahu Akbar ×34.\n5. Establish morning and evening adhkar.",
  ramadan: "Ramadan significance:\n\nThe Quran was first revealed in this month. Muslims fast dawn to sunset. Laylat al-Qadr in the last ten nights is better than a thousand months. Generosity increases. Many complete the entire Quran. Tarawih prayers are performed nightly.",
  tawhid: "Tawhid — Oneness of Allah:\n\n1. Tawhid ar-Rububiyyah — Allah alone is Creator and Sustainer.\n2. Tawhid al-Uluhiyyah — All worship directed to Allah alone.\n3. Tawhid al-Asma was-Sifat — Allah's names and attributes are unique.\n\nTawhid is the foundation of Islam and the core message of all prophets.",
  kaaba: "The Kaaba — sacred house of Allah in Makkah:\n\nBuilt by Prophet Ibrahim (AS) and his son Ismail (AS). Muslims worldwide face it during Salah. The Black Stone (Hajar al-Aswad) is from Paradise. The Kiswah (black cloth) is replaced annually. Pilgrims circumambulate it seven times during Hajj and Umrah.",
  khushu: "Achieving Khushu in Salah:\n\n1. Remember you stand before Allah.\n2. Understand what you recite.\n3. Pray slowly.\n4. Focus gaze at prostration place.\n5. Pray as if it's your last prayer.\n6. Minimize distractions.\n7. Arrive early for mosque prayers.",
};

export default function AIAssistantPage() {
  const setPage = useAppStore(s => s.setPage);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getResp = (q: string): string => {
    const l = q.toLowerCase();
    if (l.includes('pillar')) return KB.pillars;
    if (l.includes('kahf') || l.includes('cave')) return KB.kahf;
    if (l.includes('dua')) return KB.duas;
    if (l.includes('dhikr')) return KB.dhikr;
    if (l.includes('ramadan') || l.includes('fasting')) return KB.ramadan;
    if (l.includes('tawhid') || l.includes('monotheism')) return KB.tawhid;
    if (l.includes('kaaba') || l.includes('makkah')) return KB.kaaba;
    if (l.includes('khushu') || l.includes('focus') || l.includes('concentration')) return KB.khushu;
    return "As-salamu alaykum! I can help with:\n\n- The Five Pillars\n- Qur'an surahs\n- Daily duas\n- Dhikr practice\n- Ramadan\n- Tawhid\n- The Kaaba\n- Khushu in Salah\n\nTry asking about one of these topics.";
  };

  const send = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(m => [...m, { role: 'user', text: msg }]);
    setInput(''); setIsTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: getResp(msg) }]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative overflow-hidden shrink-0">
        <SceneBg scene="calligraphy" />
        <div className="relative z-10 px-6 pt-8 pb-3">
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('more')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-glow-gold text-amber-100">AI Islamic Guide</h1>
              <p className="text-white/30 text-[11px]">Ask anything about Islam</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden relative flex items-center justify-center" style={{background:'rgba(168,85,247,0.06)',border:'1px solid rgba(168,85,247,0.1)'}}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M18 4L32 18L18 32L4 18Z" fill="none" stroke="#a855f7" strokeWidth="0.6" opacity="0.3"/>
                  <circle cx="18" cy="18" r="7" fill="none" stroke="#a855f7" strokeWidth="0.6" opacity="0.4"/>
                  <circle cx="18" cy="18" r="3" fill="#a855f7" opacity="0.1"/>
                  <path d="M18 4v4M18 28v4M4 18h4M28 18h4" stroke="#a855f7" strokeWidth="0.4" opacity="0.25"/>
                  <path d="M8 8l3 3M25 25l3 3M8 28l3-3M25 11l3-3" stroke="#d4a853" strokeWidth="0.3" opacity="0.15"/>
                </svg>
              </div>
              <h3 className="text-white/60 font-medium mb-1 text-sm">As-salamu Alaykum</h3>
              <p className="text-white/30 text-xs font-light">Your Islamic knowledge assistant</p>
            </div>
            <div className="space-y-1.5">
              {SUGGESTED.map((q, i) => (
                <motion.button key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => send(q)}
                  className="w-full glass rounded-xl p-3 text-left text-xs text-white/45 hover:bg-white/[0.04] transition cursor-pointer">
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-amber-500/10 border border-amber-500/10' : 'glass'}`}>
              <p className="text-sm whitespace-pre-line leading-relaxed text-white/70 font-light">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-amber-200/40" />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="shrink-0 px-6 pb-6 pt-2">
        <div className="flex gap-2.5">
          <div className="flex-1 glass rounded-xl px-4 py-3 flex items-center">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about Islam..."
              className="flex-1 bg-transparent text-white/80 placeholder-white/15 outline-none text-sm" />
          </div>
          <RainbowButton onClick={() => send()} size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </RainbowButton>
        </div>
      </div>
    </div>
  );
}
