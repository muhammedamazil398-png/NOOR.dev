import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import RainbowButton from './RainbowButton';
import SceneBg from './SceneBg';
import SafeImage from './SafeImage';


const SLIDES = [
  { title:'Welcome to Noor', sub:'A Living Islamic Sanctuary', desc:'More than an app — an immersive spiritual ecosystem for worship, learning, and growth.', scene:'stars' as const, accent:'#d4a853', img:'/images/onboard-mosque.jpg' },
  { title:'The Sacred Qur\'an', sub:'Complete & Interactive', desc:'All 114 Surahs with translation, meaning, recitation by 5+ qaris, and a clean reading experience.', scene:'quran' as const, accent:'#2dd4a8', img:'/images/onboard-quran.jpg' },
  { title:'Prayer & Worship', sub:'Salah for Any City', desc:'Accurate prayer times worldwide, streak tracking, and calm prayer environments.', scene:'mosque' as const, accent:'#6366f1', img:'/images/mosque-hero.jpg' },
  { title:'Complete Hadith Library', sub:'All Major Sunni Collections', desc:'Sahih al-Bukhari, Muslim, Abu Dawud, Tirmidhi, and more — every hadith, fully searchable.', scene:'library' as const, accent:'#f59e0b', img:'/images/library-bg.jpg' },
  { title:'Learn Arabic', sub:'AI-Powered Lessons', desc:'Madinah Books curriculum, dictionary, root analysis, adaptive AI tutor based on your level.', scene:'calligraphy' as const, accent:'#14b8a6', img:'/images/calligraphy.jpg' },
  { title:'Dhikr & Focus', sub:'Digital Tasbih', desc:'Tap-to-count tasbih, customizable dhikr, focus timers, and habit tracking for spiritual discipline.', scene:'desert' as const, accent:'#2dd4a8', img:'/images/tasbih.jpg' },
  { title:'Your Language, Your Way', sub:'20+ Languages', desc:'Dynamic language downloads. The entire interface, books, and translations adapt to your chosen language.', scene:'geometric' as const, accent:'#ec4899', img:'/images/islamic-pattern.jpg' },
];

export default function OnboardingSlides() {
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const [exiting, setExiting] = useState(false);
  const setPage = useAppStore(s => s.setPage);
  const setOnboardingComplete = useAppStore(s => s.setOnboardingComplete);

  const s = SLIDES[cur];
  const isLast = cur === SLIDES.length - 1;

  const goNext = () => { if(isLast){setExiting(true);setOnboardingComplete();setTimeout(()=>setPage('home'),1100);return;} setDir(1);setCur(p=>p+1); };
  const goBack = () => { if(cur===0)return; setDir(-1);setCur(p=>p-1); };
  const skip = () => { setExiting(true);setOnboardingComplete();setTimeout(()=>setPage('home'),900); };

  const variants = {
    enter:(d:number)=>({x:d>0?180:-180,opacity:0,scale:0.97,filter:'blur(6px)'}),
    center:{x:0,opacity:1,scale:1,filter:'blur(0px)'},
    exit:(d:number)=>({x:d<0?180:-180,opacity:0,scale:0.97,filter:'blur(6px)'}),
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-40">
      <AnimatePresence mode="wait">
        <motion.div key={cur} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}} className="absolute inset-0">
          <SceneBg scene={s.scene}/>
        </motion.div>
      </AnimatePresence>

      <motion.div animate={{background:`radial-gradient(ellipse at 50% 35%, ${s.accent}0c 0%, transparent 55%)`}}
        transition={{duration:1}} className="absolute inset-0"/>

      {Array.from({length:10}).map((_,i)=>(
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{width:Math.random()*2+0.5,height:Math.random()*2+0.5,background:s.accent,
            left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,boxShadow:`0 0 5px ${s.accent}`}}
          animate={{y:[0,-20,0],opacity:[0.08,0.35,0.08]}}
          transition={{duration:4+Math.random()*3,repeat:Infinity,delay:Math.random()*2}}/>
      ))}

      <AnimatePresence>
        {exiting && (
          <>
            <motion.div initial={{x:'100%'}} animate={{x:0}} transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
              className="fixed inset-0 z-50" style={{background:'rgba(4,7,16,0.92)',backdropFilter:'blur(40px)'}}/>
            <motion.div initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} transition={{delay:0.3}}
              className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-bold text-glow-gold font-arabic text-amber-100 mb-3">بِسْمِ اللَّهِ</div>
                <div className="divider-gold w-28 mx-auto mb-3"/>
                <p className="text-amber-200/35 text-sm tracking-widest font-light">Begin Your Journey</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={cur} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
            transition={{duration:0.45,ease:[0.22,1,0.36,1]}} className="w-full max-w-md text-center">

            {/* Visual card — uses SafeImage for real photos, SVG visual for others */}
            <motion.div initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}}
              transition={{delay:0.12,type:'spring',stiffness:200}}
              className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-8 rounded-3xl overflow-hidden relative"
              style={{boxShadow:`0 16px 50px -8px ${s.accent}25, 0 0 30px ${s.accent}08`}}>
              <SafeImage src={s.img} className="w-full h-full" fallbackColor={s.accent}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/>
              <div className="absolute inset-0 rounded-3xl border border-white/[0.06]"/>
            </motion.div>

            <motion.h2 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
              className="text-2xl md:text-3xl font-bold mb-1.5"
              style={{color:s.accent,textShadow:`0 0 30px ${s.accent}25`}}>{s.title}</motion.h2>
            <motion.p initial={{opacity:0}} animate={{opacity:0.45}} transition={{delay:0.3}}
              className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-5 font-light">{s.sub}</motion.p>
            <motion.div initial={{width:0}} animate={{width:'40%'}} transition={{delay:0.3,duration:0.5}}
              className="divider-gold mx-auto mb-5"/>
            <motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
              className="text-white/55 text-sm leading-relaxed px-2 font-light">{s.desc}</motion.p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-1.5 mt-10 mb-7">
          {SLIDES.map((_,i)=>(
            <motion.button key={i} onClick={()=>{setDir(i>cur?1:-1);setCur(i);}} className="cursor-pointer rounded-full"
              animate={{width:i===cur?24:5,height:5,opacity:i===cur?1:0.2,background:i===cur?s.accent:'rgba(255,255,255,0.4)'}}
              transition={{duration:0.35}}/>
          ))}
        </div>

        <div className="flex items-center gap-2.5 w-full max-w-md px-4">
          {cur>0 && <RainbowButton onClick={goBack} size="md" className="flex-1">Back</RainbowButton>}
          <RainbowButton onClick={goNext} size="md" className="flex-1">{isLast?'Begin Your Journey':'Next'}</RainbowButton>
        </div>
        <button onClick={skip} className="mt-3 text-white/15 text-[10px] hover:text-white/30 transition cursor-pointer tracking-wider">Skip</button>
      </div>
    </div>
  );
}
