import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import RainbowButton from '../components/RainbowButton';
import SceneBg from '../components/SceneBg';

interface Question { question: string; options: string[]; correct: number; category: string; }

const QUESTIONS: Question[] = [
  { question: 'How many surahs are in the Qur\'an?', options: ['110', '112', '114', '120'], correct: 2, category: 'Quran' },
  { question: 'Which surah is known as the "Heart of the Qur\'an"?', options: ['Al-Fatiha', 'Ya-Sin', 'Al-Baqarah', 'Al-Ikhlas'], correct: 1, category: 'Quran' },
  { question: 'Which prophet is mentioned most in the Qur\'an?', options: ['Muhammad (pbuh)', 'Ibrahim (AS)', 'Musa (AS)', 'Isa (AS)'], correct: 2, category: 'Quran' },
  { question: 'What is the longest surah?', options: ['Al-Imran', 'An-Nisa', 'Al-Baqarah', 'Al-Maidah'], correct: 2, category: 'Quran' },
  { question: 'What is the first pillar of Islam?', options: ['Salah', 'Shahada', 'Zakat', 'Hajj'], correct: 1, category: 'Aqeedah' },
  { question: 'How many pillars of Islam are there?', options: ['3', '4', '5', '6'], correct: 2, category: 'Aqeedah' },
  { question: 'How many articles of faith (Iman)?', options: ['4', '5', '6', '7'], correct: 2, category: 'Aqeedah' },
  { question: 'What is Tajweed?', options: ['Memorization', 'Recitation rules', 'Translation', 'Commentary'], correct: 1, category: 'Tajweed' },
  { question: 'What is "Ghunnah"?', options: ['Stopping', 'Nasalization', 'Elongation', 'Merging'], correct: 1, category: 'Tajweed' },
  { question: 'Where was Prophet Muhammad (pbuh) born?', options: ['Madinah', 'Makkah', 'Taif', 'Jerusalem'], correct: 1, category: 'Seerah' },
  { question: 'First revelation received?', options: ['Al-Fatiha', 'Al-Alaq (first 5)', 'Al-Ikhlas', 'Al-Nas'], correct: 1, category: 'Seerah' },
  { question: 'Cave of first revelation?', options: ['Thawr', 'Hira', 'Kahf', 'Safa'], correct: 1, category: 'Seerah' },
  { question: 'How many daily prayers?', options: ['3', '4', '5', '7'], correct: 2, category: 'Fiqh' },
  { question: 'Minimum Zakat rate on savings?', options: ['1%', '2.5%', '5%', '10%'], correct: 1, category: 'Fiqh' },
  { question: 'Arabic term for Islamic jurisprudence?', options: ['Hadith', 'Sunnah', 'Fiqh', 'Tafsir'], correct: 2, category: 'Fiqh' },
];

export default function QuizPage() {
  const setPage = useAppStore(s => s.setPage);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(QUESTIONS.map(q => q.category))];
  const filteredQ = categoryFilter === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.category === categoryFilter);
  const q = filteredQ[currentQ];

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    setSelected(idx); setAnswered(true);
    if (idx === q.correct) setScore(s => s + 1);
  }, [answered, q]);

  const nextQuestion = () => {
    if (currentQ + 1 >= filteredQ.length) setShowResult(true);
    else { setCurrentQ(c => c + 1); setSelected(null); setAnswered(false); }
  };

  const restart = () => { setCurrentQ(0); setSelected(null); setScore(0); setShowResult(false); setAnswered(false); };

  return (
    <div className="min-h-screen pb-28">
      <div className="relative overflow-hidden">
        <SceneBg scene="stars" />
        <div className="relative z-10 px-6 pt-8 pb-5">
          <div className="flex items-center gap-4 mb-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('more')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-gold text-amber-100">الإختبار</h1>
              <p className="text-white/30 text-[11px]">Islamic Quiz</p>
            </div>
          </div>
        </div>
      </div>

      {!quizStarted ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6">
          <h3 className="text-white/25 text-[10px] uppercase tracking-[0.2em] mb-4">Choose Category</h3>
          <div className="grid grid-cols-2 gap-2.5 mb-8">
            {categories.map((cat, i) => (
              <motion.button key={cat} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setCategoryFilter(cat)}
                className={`glass rounded-xl p-3.5 text-center cursor-pointer transition-all text-sm capitalize
                  ${categoryFilter === cat ? 'bg-amber-500/8 border-amber-500/20' : ''}`}
                style={{ border: `1px solid ${categoryFilter === cat ? 'rgba(212,168,83,0.2)' : 'rgba(255,255,255,0.04)'}` }}>
                <span className="text-white/60">{cat === 'all' ? 'All Topics' : cat}</span>
              </motion.button>
            ))}
          </div>
          <RainbowButton onClick={() => setQuizStarted(true)} size="lg" className="w-full">
            Start Quiz ({filteredQ.length} questions)
          </RainbowButton>
        </motion.div>
      ) : showResult ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-6 text-center">
          <div className="glass rounded-3xl p-8 mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: score >= filteredQ.length * 0.8 ? 'rgba(45,212,168,0.1)' : 'rgba(212,168,83,0.1)', border: `1px solid ${score >= filteredQ.length * 0.8 ? 'rgba(45,212,168,0.2)' : 'rgba(212,168,83,0.2)'}` }}>
              <span className="text-2xl font-bold" style={{ color: score >= filteredQ.length * 0.8 ? '#2dd4a8' : '#d4a853' }}>
                {Math.round((score / filteredQ.length) * 100)}%
              </span>
            </div>
            <h2 className="text-2xl font-bold text-amber-200 mb-2">Quiz Complete</h2>
            <p className="text-4xl font-bold text-white mb-2">{score}/{filteredQ.length}</p>
            <p className="text-white/35 text-sm font-light">
              {score >= filteredQ.length * 0.8 ? 'Excellent! Masha\'Allah!' : score >= filteredQ.length * 0.5 ? 'Good effort! Keep learning.' : 'Keep studying, you\'ll improve!'}
            </p>
          </div>
          <RainbowButton onClick={restart} size="lg" className="w-full">Try Again</RainbowButton>
        </motion.div>
      ) : (
        <div className="px-6">
          <div className="mb-6">
            <div className="flex justify-between text-white/20 text-[11px] mb-2">
              <span>Question {currentQ + 1}/{filteredQ.length}</span><span>Score: {score}</span>
            </div>
            <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #d4a853, #2dd4a8)' }}
                animate={{ width: `${((currentQ + 1) / filteredQ.length) * 100}%` }} />
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }} transition={{ duration: 0.3 }}>
              <div className="glass rounded-2xl p-6 mb-6">
                <span className="text-amber-200/25 text-[10px] uppercase tracking-[0.2em]">{q.category}</span>
                <h3 className="text-lg text-white/85 font-medium mt-2">{q.question}</h3>
              </div>
              <div className="space-y-2.5 mb-6">
                {q.options.map((opt, idx) => {
                  const isCorrect = idx === q.correct;
                  const isSel = idx === selected;
                  return (
                    <motion.button key={idx} whileHover={!answered ? { scale: 1.01, x: 3 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}} onClick={() => handleAnswer(idx)}
                      className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3
                        ${answered ? isCorrect ? 'bg-emerald-500/10 border border-emerald-400/20' : isSel ? 'bg-red-500/10 border border-red-400/20' : 'glass' : 'glass hover:bg-white/[0.05]'}`}>
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0
                        ${answered && isCorrect ? 'bg-emerald-500/20 text-emerald-300' : answered && isSel ? 'bg-red-500/20 text-red-300' : 'bg-white/[0.04] text-white/40'}`}>
                        {answered && isCorrect ? '✓' : answered && isSel ? '✗' : String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-sm ${answered && isCorrect ? 'text-emerald-300' : answered && isSel ? 'text-red-300' : 'text-white/60'}`}>{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <RainbowButton onClick={nextQuestion} size="md" className="w-full">
                    {currentQ + 1 >= filteredQ.length ? 'See Results' : 'Next Question'}
                  </RainbowButton>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
