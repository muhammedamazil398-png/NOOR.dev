import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import RainbowButton from '../components/RainbowButton';
import SceneBg from '../components/SceneBg';

type Level = 'beginner' | 'intermediate' | 'advanced';

const LEVELS = [
  { id: 'beginner' as Level, name: 'Beginner', arabic: 'مبتدئ', description: 'Learn the Arabic alphabet, basic pronunciation, and simple words' },
  { id: 'intermediate' as Level, name: 'Intermediate', arabic: 'متوسط', description: 'Grammar fundamentals, sentence structure, and basic Quranic vocabulary' },
  { id: 'advanced' as Level, name: 'Advanced', arabic: 'متقدم', description: 'Complex grammar, classical Arabic, and Quranic comprehension' },
];

const MADINAH_BOOKS = [
  { id: 'book1', name: 'Madinah Book 1', arabic: 'الكتاب الأول', level: 'beginner', lessons: 23, description: 'Foundation of Arabic reading, writing, and basic grammar' },
  { id: 'book2', name: 'Madinah Book 2', arabic: 'الكتاب الثاني', level: 'intermediate', lessons: 16, description: 'Expanding vocabulary, verb conjugations, and nominal sentences' },
  { id: 'book3', name: 'Madinah Book 3', arabic: 'الكتاب الثالث', level: 'advanced', lessons: 25, description: 'Advanced grammar, rhetorical devices, and Quranic Arabic' },
];

const ALPHABET = [
  { letter: 'ا', name: 'Alif', transliteration: 'ā', isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا' },
  { letter: 'ب', name: 'Bā', transliteration: 'b', isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
  { letter: 'ت', name: 'Tā', transliteration: 't', isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
  { letter: 'ث', name: 'Thā', transliteration: 'th', isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
  { letter: 'ج', name: 'Jīm', transliteration: 'j', isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
  { letter: 'ح', name: 'Ḥā', transliteration: 'ḥ', isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
  { letter: 'خ', name: 'Khā', transliteration: 'kh', isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
  { letter: 'د', name: 'Dāl', transliteration: 'd', isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' },
  { letter: 'ذ', name: 'Dhāl', transliteration: 'dh', isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
  { letter: 'ر', name: 'Rā', transliteration: 'r', isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' },
  { letter: 'ز', name: 'Zāy', transliteration: 'z', isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' },
  { letter: 'س', name: 'Sīn', transliteration: 's', isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
  { letter: 'ش', name: 'Shīn', transliteration: 'sh', isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
  { letter: 'ص', name: 'Ṣād', transliteration: 'ṣ', isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
  { letter: 'ض', name: 'Ḍād', transliteration: 'ḍ', isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
  { letter: 'ط', name: 'Ṭā', transliteration: 'ṭ', isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
  { letter: 'ظ', name: 'Ẓā', transliteration: 'ẓ', isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
  { letter: 'ع', name: 'ʿAyn', transliteration: 'ʿ', isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
  { letter: 'غ', name: 'Ghayn', transliteration: 'gh', isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
  { letter: 'ف', name: 'Fā', transliteration: 'f', isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
  { letter: 'ق', name: 'Qāf', transliteration: 'q', isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
  { letter: 'ك', name: 'Kāf', transliteration: 'k', isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
  { letter: 'ل', name: 'Lām', transliteration: 'l', isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
  { letter: 'م', name: 'Mīm', transliteration: 'm', isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
  { letter: 'ن', name: 'Nūn', transliteration: 'n', isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
  { letter: 'ه', name: 'Hā', transliteration: 'h', isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
  { letter: 'و', name: 'Wāw', transliteration: 'w/ū', isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' },
  { letter: 'ي', name: 'Yā', transliteration: 'y/ī', isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' },
];

const BASIC_WORDS = [
  { arabic: 'كِتَاب', transliteration: 'kitāb', english: 'book' },
  { arabic: 'قَلَم', transliteration: 'qalam', english: 'pen' },
  { arabic: 'بَيْت', transliteration: 'bayt', english: 'house' },
  { arabic: 'مَسْجِد', transliteration: 'masjid', english: 'mosque' },
  { arabic: 'مَاء', transliteration: 'māʾ', english: 'water' },
  { arabic: 'سَمَاء', transliteration: 'samāʾ', english: 'sky' },
  { arabic: 'أَرْض', transliteration: 'arḍ', english: 'earth' },
  { arabic: 'شَمْس', transliteration: 'shams', english: 'sun' },
  { arabic: 'قَمَر', transliteration: 'qamar', english: 'moon' },
  { arabic: 'نَجْم', transliteration: 'najm', english: 'star' },
];

const AI_RESPONSES: Record<string, string> = {
  'alphabet': 'The Arabic alphabet has 28 letters. Each letter can have up to 4 forms depending on its position in a word: isolated, initial, medial, and final. Let\'s start with Alif (ا) - it\'s the first letter and represents the long "ā" sound.',
  'grammar': 'Arabic grammar (النحو - an-naḥw) is built on root patterns. Most words derive from 3-letter roots. For example, ك-ت-ب (k-t-b) relates to writing: كِتَاب (book), كَاتِب (writer), مَكْتُوب (written).',
  'pronunciation': 'Key sounds unique to Arabic include: ع (ʿayn) - a deep throat sound, ح (ḥā) - breathy h, خ (khā) - like clearing throat, غ (ghayn) - like French r, ق (qāf) - deep k from throat.',
  'quran': 'Quranic Arabic uses Classical Arabic (الفصحى). Key features: إعراب (iʿrāb) - case endings that show grammatical function, and special vocabulary. Start by learning common Quranic words.',
  default: 'I can help you learn Arabic! Ask me about:\n\n• The Arabic alphabet and letter forms\n• Basic grammar concepts\n• Pronunciation tips\n• Quranic Arabic\n• Common vocabulary\n\nWhat would you like to learn today?'
};

export default function ArabicLearningPage() {
  const setPage = useAppStore(s => s.setPage);
  const userProfile = useAppStore(s => s.userProfile);
  const setUserProfile = useAppStore(s => s.setUserProfile);
  
  const [level, setLevel] = useState<Level | ''>(userProfile?.arabicLevel || '');
  const [activeTab, setActiveTab] = useState<'alphabet' | 'words' | 'books' | 'ai'>('alphabet');
  const [selectedLetter, setSelectedLetter] = useState<typeof ALPHABET[0] | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [aiTyping, setAiTyping] = useState(false);

  const handleLevelSelect = (l: Level) => {
    setLevel(l);
    if (userProfile) {
      setUserProfile({ ...userProfile, arabicLevel: l });
    }
  };

  const sendAiMessage = (text?: string) => {
    const msg = text || aiInput;
    if (!msg.trim()) return;
    
    setAiMessages(prev => [...prev, { role: 'user', text: msg }]);
    setAiInput('');
    setAiTyping(true);
    
    setTimeout(() => {
      const lowerMsg = msg.toLowerCase();
      let response = AI_RESPONSES.default;
      if (lowerMsg.includes('alphabet') || lowerMsg.includes('letter')) response = AI_RESPONSES.alphabet;
      else if (lowerMsg.includes('grammar') || lowerMsg.includes('root')) response = AI_RESPONSES.grammar;
      else if (lowerMsg.includes('pronoun') || lowerMsg.includes('sound')) response = AI_RESPONSES.pronunciation;
      else if (lowerMsg.includes('quran') || lowerMsg.includes('classical')) response = AI_RESPONSES.quran;
      
      setAiMessages(prev => [...prev, { role: 'ai', text: response }]);
      setAiTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="relative overflow-hidden">
        <SceneBg scene="calligraphy" />
        
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('more')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-emerald text-emerald-200">تعلم العربية</h1>
              <p className="text-white/30 text-[11px]">Learn Arabic</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!level ? (
          // Level selection
          <motion.div key="levels" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-6 py-4">
            <h3 className="text-white/25 text-[10px] uppercase tracking-[0.25em] mb-4">Select Your Level</h3>
            <div className="space-y-3">
              {LEVELS.map((l, i) => (
                <motion.button key={l.id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleLevelSelect(l.id)}
                  className="w-full glass rounded-xl p-5 text-left cursor-pointer hover:bg-white/[0.03] transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 font-medium">{l.name}</span>
                    <span className="font-arabic text-emerald-300/60">{l.arabic}</span>
                  </div>
                  <p className="text-white/35 text-sm font-light">{l.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          // Main learning content
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Level badge & change */}
            <div className="px-6 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-300/60 text-xs">Level:</span>
                <span className="text-white/70 text-sm capitalize">{level}</span>
              </div>
              <button onClick={() => setLevel('')}
                className="text-white/30 text-xs hover:text-white/50 transition cursor-pointer">
                Change Level
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 mb-6">
              <div className="glass rounded-xl p-1 flex gap-0.5">
                {[
                  { id: 'alphabet', label: 'Alphabet' },
                  { id: 'words', label: 'Words' },
                  { id: 'books', label: 'Madinah Books' },
                  { id: 'ai', label: 'AI Tutor' },
                ].map(tab => (
                  <button key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-2.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer
                      ${activeTab === tab.id ? 'bg-emerald-500/15 text-emerald-300' : 'text-white/30'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="px-6">
              {activeTab === 'alphabet' && (
                <div>
                  <p className="text-white/30 text-xs mb-4">Tap a letter to see all its forms</p>
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {ALPHABET.map((letter, i) => (
                      <motion.button key={letter.letter}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => setSelectedLetter(selectedLetter?.letter === letter.letter ? null : letter)}
                        className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all
                          ${selectedLetter?.letter === letter.letter 
                            ? 'bg-emerald-500/15 border border-emerald-500/30' 
                            : 'glass hover:bg-white/[0.05]'}`}>
                        <span className="font-arabic text-xl text-amber-200/70">{letter.letter}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Selected letter details */}
                  <AnimatePresence>
                    {selectedLetter && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="glass rounded-2xl p-5 mb-4">
                          <div className="text-center mb-4">
                            <span className="font-arabic text-5xl text-amber-200">{selectedLetter.letter}</span>
                            <p className="text-white/60 text-sm mt-2">{selectedLetter.name} - /{selectedLetter.transliteration}/</p>
                          </div>
                          <div className="divider-gold mb-4" />
                          <div className="grid grid-cols-4 gap-3">
                            {[
                              { label: 'Isolated', value: selectedLetter.isolated },
                              { label: 'Initial', value: selectedLetter.initial },
                              { label: 'Medial', value: selectedLetter.medial },
                              { label: 'Final', value: selectedLetter.final },
                            ].map(form => (
                              <div key={form.label} className="text-center">
                                <p className="text-white/30 text-[10px] mb-1">{form.label}</p>
                                <span className="font-arabic text-2xl text-emerald-300/70">{form.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === 'words' && (
                <div className="space-y-2">
                  <p className="text-white/30 text-xs mb-4">Common Arabic vocabulary</p>
                  {BASIC_WORDS.map((word, i) => (
                    <motion.div key={word.arabic}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="font-arabic text-xl text-amber-200/70">{word.arabic}</span>
                        <p className="text-white/40 text-xs mt-0.5">{word.transliteration}</p>
                      </div>
                      <span className="text-white/60 text-sm">{word.english}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'books' && (
                <div className="space-y-3">
                  <p className="text-white/30 text-xs mb-4">Madinah Arabic Course</p>
                  {MADINAH_BOOKS.filter(b => level === 'advanced' || b.level === level || (level === 'intermediate' && b.level === 'beginner')).map((book, i) => (
                    <motion.div key={book.id}
                      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="glass rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 font-medium">{book.name}</span>
                        <span className="font-arabic text-amber-200/50 text-sm">{book.arabic}</span>
                      </div>
                      <p className="text-white/35 text-sm font-light mb-2">{book.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/20 text-xs">{book.lessons} lessons</span>
                        <span className="text-emerald-300/40 text-xs capitalize">{book.level}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="flex flex-col h-[60vh]">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {aiMessages.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-white/40 text-sm mb-4">Ask me anything about learning Arabic!</p>
                        <div className="space-y-2">
                          {['How do I learn the Arabic alphabet?', 'Explain Arabic grammar basics', 'Tips for Quranic Arabic'].map((q, i) => (
                            <button key={i} onClick={() => sendAiMessage(q)}
                              className="w-full glass rounded-xl p-3 text-left text-xs text-white/40 hover:bg-white/[0.04] transition cursor-pointer">
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {aiMessages.map((msg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-emerald-500/10 border border-emerald-500/10' : 'glass'}`}>
                          <p className="text-sm whitespace-pre-line leading-relaxed text-white/70 font-light">{msg.text}</p>
                        </div>
                      </motion.div>
                    ))}
                    {aiTyping && (
                      <div className="flex justify-start">
                        <div className="glass rounded-2xl px-4 py-3 flex gap-1.5">
                          {[0, 1, 2].map(i => (
                            <motion.div key={i} animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-emerald-300/40" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2.5">
                    <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendAiMessage()}
                      placeholder="Ask about Arabic..."
                      className="flex-1 glass rounded-xl px-4 py-3 text-white/80 placeholder-white/15 outline-none text-sm" />
                    <RainbowButton onClick={() => sendAiMessage()} size="sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </RainbowButton>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
