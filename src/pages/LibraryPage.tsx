import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import SceneBg from '../components/SceneBg';

// Hadith book IDs that map to the HadithPage collections
const HADITH_BOOK_IDS: Record<string, string> = {
  'Sahih al-Bukhari': 'bukhari',
  'Sahih Muslim': 'muslim',
};

const LIBRARY_CATEGORIES = [
  { name: 'Tafsir', arabic: 'التفسير', color: '#2dd4a8', scene: 'quran' as const, books: [
    { title: 'Tafsir Ibn Kathir', author: 'Ibn Kathir', volumes: 10, description: 'One of the most respected Quranic commentaries, tracing interpretations back to the Prophet and companions. Covers linguistic, historical, and theological analysis of every verse.' },
    { title: 'Tafsir al-Jalalayn', author: 'Al-Mahalli & As-Suyuti', volumes: 1, description: 'A concise commentary covering the entire Quran, known for its brevity and clarity. Ideal for beginners.' },
    { title: 'Tafsir al-Tabari', author: 'Ibn Jarir al-Tabari', volumes: 30, description: 'The earliest major commentary. Comprehensive and encyclopedic with extensive chains of narration.' },
    { title: 'Tafsir al-Qurtubi', author: 'Al-Qurtubi', volumes: 20, description: 'Focuses on legal rulings derived from the Quran. Also covers linguistic and theological aspects.' },
    { title: 'Fi Zilal al-Quran', author: 'Sayyid Qutb', volumes: 6, description: 'Modern literary interpretation focusing on the spiritual and social message of the Quran.' },
    { title: "Ma'ariful Quran", author: 'Mufti Muhammad Shafi', volumes: 8, description: 'Comprehensive tafsir with focus on practical application of Quranic teachings.' },
  ]},
  { name: 'Hadith', arabic: 'الحديث', color: '#f59e0b', scene: 'lantern' as const, books: [
    { title: 'Sahih al-Bukhari', author: 'Imam al-Bukhari', volumes: 9, description: 'The most authentic collection of hadith with 7,563 narrations. The gold standard of hadith scholarship.' },
    { title: 'Sahih Muslim', author: 'Imam Muslim', volumes: 7, description: 'The second most authentic hadith collection, known for its systematic organization and rigorous methodology.' },

    { title: 'Bulugh al-Maram', author: 'Ibn Hajar al-Asqalani', volumes: 1, description: 'A collection of hadith pertaining to Islamic jurisprudence, organized by legal topics.' },
    { title: 'Mishkat al-Masabih', author: 'Al-Khatib al-Tabrizi', volumes: 3, description: 'An expanded version of Masabih as-Sunnah with additional hadith and narrator chains.' },
  ]},
  { name: 'Fiqh', arabic: 'الفقه', color: '#6366f1', scene: 'geometric' as const, books: [
    { title: 'Fiqh us-Sunnah', author: 'Sayyid Sabiq', volumes: 5, description: 'Comprehensive guide to Islamic jurisprudence based on Quran and Sunnah. Accessible for all levels.' },
    { title: 'Al-Fiqh Al-Islami wa Adillatuhu', author: 'Wahbah al-Zuhayli', volumes: 11, description: 'Encyclopedic work covering all four schools of Islamic law with comparative analysis.' },
    { title: "Reliance of the Traveller", author: 'Ahmad ibn Naqib al-Misri', volumes: 1, description: "A classic manual of Shafi'i jurisprudence with comprehensive coverage of worship and daily life." },
    { title: 'Al-Hidaya', author: 'Al-Marghinani', volumes: 4, description: 'Foundational text of Hanafi jurisprudence studied across the Muslim world for centuries.' },
  ]},
  { name: 'Seerah', arabic: 'السيرة', color: '#ec4899', scene: 'desert' as const, books: [
    { title: 'Ar-Raheeq Al-Makhtum', author: 'Safiur Rahman Mubarakpuri', volumes: 1, description: 'The Sealed Nectar — award-winning biography of Prophet Muhammad (peace be upon him). Comprehensive and well-sourced.' },
    { title: 'Sirat Ibn Hisham', author: 'Ibn Hisham', volumes: 2, description: 'One of the earliest and most authentic biographies of the Prophet. A primary historical source.' },
    { title: 'The Lives of the Prophets', author: 'Ibn Kathir', volumes: 1, description: 'Stories of all prophets mentioned in the Quran from Adam to Muhammad (peace be upon them all).' },
    { title: 'Men Around the Messenger', author: 'Khalid Muhammad Khalid', volumes: 1, description: 'Inspiring biographies of the noble companions (Sahabah) of the Prophet.' },
  ]},
  { name: 'Aqeedah', arabic: 'العقيدة', color: '#d4a853', scene: 'stars' as const, books: [
    { title: 'Al-Aqidah al-Wasitiyyah', author: 'Ibn Taymiyyah', volumes: 1, description: 'A concise creed text outlining core Islamic beliefs based on Quran and Sunnah.' },
    { title: 'Kitab at-Tawhid', author: 'Muhammad ibn Abdul-Wahhab', volumes: 1, description: 'A treatise on Islamic monotheism with extensive hadith references and scholarly explanations.' },
    { title: 'Al-Aqidah at-Tahawiyyah', author: 'Imam at-Tahawi', volumes: 1, description: 'A classical creed text accepted by scholars across all four Sunni schools of thought.' },
  ]},
  { name: 'Spirituality', arabic: 'التزكية', color: '#a855f7', scene: 'calligraphy' as const, books: [
    { title: 'Ihya Ulum al-Din', author: 'Imam al-Ghazali', volumes: 4, description: 'Revival of the Religious Sciences — the most comprehensive guide to spiritual development in Islam.' },
    { title: 'Purification of the Heart', author: 'Imam al-Mawlud', volumes: 1, description: 'A treatise on the diseases of the heart and their cures according to the Quran and Sunnah.' },
    { title: 'The Book of Assistance', author: 'Imam al-Haddad', volumes: 1, description: 'A practical guide to everyday spiritual practices and remembrance of Allah.' },
  ]},
];

export default function LibraryPage() {
  const setPage = useAppStore(s => s.setPage);
  const setCurrentHadithCollection = useAppStore(s => s.setCurrentHadithCollection);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [expandedBook, setExpandedBook] = useState<number | null>(null);

  const cat = LIBRARY_CATEGORIES.find(c => c.name === selectedCat);

  const openBook = (title: string) => {
    const hadithId = HADITH_BOOK_IDS[title];
    if (hadithId) {
      setCurrentHadithCollection(hadithId);
      setPage('hadith');
    }
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="relative overflow-hidden">
        <SceneBg scene={cat?.scene || 'library'} />
        <div className="relative z-10 px-6 pt-8 pb-5">
          <div className="flex items-center gap-4">
            <motion.button whileTap={{scale:0.9}}
              onClick={()=>{ if(selectedCat) { setSelectedCat(null); setExpandedBook(null); } else setPage('more'); }}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-gold text-amber-100">المكتبة</h1>
              <p className="text-white/30 text-[11px]">{selectedCat || 'Islamic Library'}</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedCat ? (
          <motion.div key="cats" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="px-6 grid grid-cols-2 gap-3 mt-2">
            {LIBRARY_CATEGORIES.map((c,i) => (
              <motion.button key={c.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                transition={{delay:i*0.05}} whileHover={{scale:1.02,y:-2}} whileTap={{scale:0.97}}
                onClick={()=>setSelectedCat(c.name)}
                className="glass rounded-2xl p-5 text-left cursor-pointer hover:bg-white/[0.03] transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-3xl opacity-8" style={{background:c.color}}/>
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg mb-3 flex items-center justify-center"
                    style={{background:`${c.color}0c`,border:`1px solid ${c.color}12`}}>
                    <span className="font-arabic text-sm" style={{color:c.color}}>{c.arabic.charAt(0)}</span>
                  </div>
                  <p className="text-white/65 font-medium text-sm">{c.name}</p>
                  <p className="font-arabic text-amber-200/25 text-xs">{c.arabic}</p>
                  <p className="text-white/12 text-[10px] mt-1">{c.books.length} books</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="books" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}}
            className="px-6 space-y-2 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{background:cat?.color}}/>
              <span className="text-sm font-medium" style={{color:cat?.color}}>{cat?.name}</span>
              <span className="font-arabic text-amber-200/25 text-xs">{cat?.arabic}</span>
            </div>
            {cat?.books.map((book,i) => {
              const hasContent = !!HADITH_BOOK_IDS[book.title];
              return (
                <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.035}}>
                  <motion.button whileTap={{scale:0.995}}
                    onClick={()=>{ if(hasContent) openBook(book.title); else setExpandedBook(expandedBook===i?null:i); }}
                    className="w-full glass rounded-xl p-4 text-left cursor-pointer hover:bg-white/[0.02] transition">
                    <div className="flex items-start gap-3">
                      {/* Mini book cover with geometric fallback */}
                      <div className="w-9 h-12 rounded-md overflow-hidden shrink-0 relative"
                        style={{background:`${cat?.color}08`,border:`1px solid ${cat?.color}10`}}>
                        <svg className="w-full h-full opacity-20">
                          <defs><pattern id={`bk-${i}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                            <path d="M6 0L12 6L6 12L0 6Z" fill="none" stroke={cat?.color} strokeWidth="0.3"/>
                          </pattern></defs>
                          <rect width="100%" height="100%" fill={`url(#bk-${i})`}/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white/75 font-medium text-sm">{book.title}</h3>
                          {hasContent && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300/40 border border-emerald-500/10">
                              Read
                            </span>
                          )}
                        </div>
                        <p className="text-white/25 text-[11px] mt-0.5">{book.author}</p>
                        <p className="text-white/12 text-[10px] mt-0.5">{book.volumes} vol{book.volumes>1?'s':''}</p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedBook===i && (
                        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                          exit={{opacity:0,height:0}} className="mt-3 pt-3 border-t border-white/[0.03]">
                          <p className="text-white/40 text-[13px] leading-relaxed font-light">{book.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
