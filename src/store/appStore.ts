import { create } from 'zustand';

export type AppPage = 'splash' | 'onboarding-auth' | 'onboarding-slides' | 'home' | 'quran' | 'quran-reader' | 'salah' | 'hadith' | 'hadith-reader' | 'more' | 'library' | 'book-reader' | 'dhikr' | 'settings' | 'ai-assistant' | 'deaddiction' | 'quiz' | 'arabic-learning' | 'dictionary';

export interface UserProfile {
  name: string;
  madhab: string;
  city: string;
  country: string;
  gender: string;
  language: string;
  arabicLevel: 'beginner' | 'intermediate' | 'advanced' | '';
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface AppState {
  currentPage: AppPage;
  previousPage: AppPage | null;
  userProfile: UserProfile | null;
  hasCompletedOnboarding: boolean;
  prayerTimes: PrayerTimes | null;
  currentSurah: number;
  dhikrCount: number;
  dhikrTarget: number;
  dhikrText: string;
  streakDays: number;
  currentHadithCollection: string;
  currentBookId: string;
  languageLoaded: boolean;
  performanceMode: 'low' | 'high';
  appScale: number;
  
  setPage: (page: AppPage) => void;
  setUserProfile: (profile: UserProfile) => void;
  setOnboardingComplete: () => void;
  setPrayerTimes: (times: PrayerTimes) => void;
  setCurrentSurah: (num: number) => void;
  incrementDhikr: () => void;
  resetDhikr: () => void;
  setDhikrTarget: (t: number) => void;
  setDhikrText: (t: string) => void;
  setCurrentHadithCollection: (c: string) => void;
  setCurrentBookId: (id: string) => void;
  setLanguageLoaded: (loaded: boolean) => void;
  setPerformanceMode: (mode: 'low' | 'high') => void;
  setAppScale: (scale: number) => void;
}

const savedProfile = localStorage.getItem('noor-profile');
const savedOnboarding = localStorage.getItem('noor-onboarding-complete');
const savedPerformanceMode = (localStorage.getItem('noor-performance-mode') as 'low' | 'high') || 'high';
const savedAppScale = parseFloat(localStorage.getItem('noor-app-scale') || '1') || 1;

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'splash',
  previousPage: null,
  userProfile: savedProfile ? JSON.parse(savedProfile) : null,
  hasCompletedOnboarding: savedOnboarding === 'true',
  prayerTimes: null,
  currentSurah: 1,
  dhikrCount: 0,
  dhikrTarget: 33,
  dhikrText: 'سبحان الله',
  streakDays: parseInt(localStorage.getItem('noor-streak') || '0'),
  currentHadithCollection: '',
  currentBookId: '',
  languageLoaded: true,
  performanceMode: savedPerformanceMode,
  appScale: savedAppScale,
  
  setPage: (page) => set((state) => ({ currentPage: page, previousPage: state.currentPage })),
  setUserProfile: (profile) => {
    localStorage.setItem('noor-profile', JSON.stringify(profile));
    set({ userProfile: profile });
  },
  setOnboardingComplete: () => {
    localStorage.setItem('noor-onboarding-complete', 'true');
    set({ hasCompletedOnboarding: true });
  },
  setPrayerTimes: (times) => set({ prayerTimes: times }),
  setCurrentSurah: (num) => set({ currentSurah: num }),
  incrementDhikr: () => set((state) => ({ dhikrCount: state.dhikrCount + 1 })),
  resetDhikr: () => set({ dhikrCount: 0 }),
  setDhikrTarget: (t) => set({ dhikrTarget: t }),
  setDhikrText: (t) => set({ dhikrText: t }),
  setCurrentHadithCollection: (c) => set({ currentHadithCollection: c }),
  setCurrentBookId: (id) => set({ currentBookId: id }),
  setLanguageLoaded: (loaded) => set({ languageLoaded: loaded }),
  setPerformanceMode: (mode) => {
    localStorage.setItem('noor-performance-mode', mode);
    set({ performanceMode: mode });
  },
  setAppScale: (scale) => {
    localStorage.setItem('noor-app-scale', String(scale));
    set({ appScale: scale });
  },
}));

// Language translations
export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', rtl: false },
  { code: 'ar', name: 'Arabic', native: 'العربية', rtl: true },
  { code: 'ur', name: 'Urdu', native: 'اردو', rtl: true },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', rtl: false },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', rtl: false },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', rtl: false },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', rtl: false },
  { code: 'fa', name: 'Persian', native: 'فارسی', rtl: true },
  { code: 'fr', name: 'French', native: 'Français', rtl: false },
  { code: 'de', name: 'German', native: 'Deutsch', rtl: false },
  { code: 'es', name: 'Spanish', native: 'Español', rtl: false },
  { code: 'ru', name: 'Russian', native: 'Русский', rtl: false },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', rtl: false },
  { code: 'zh', name: 'Chinese', native: '中文', rtl: false },
  { code: 'ja', name: 'Japanese', native: '日本語', rtl: false },
  { code: 'ko', name: 'Korean', native: '한국어', rtl: false },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', rtl: false },
  { code: 'ha', name: 'Hausa', native: 'Hausa', rtl: false },
  { code: 'so', name: 'Somali', native: 'Soomaali', rtl: false },
  { code: 'ps', name: 'Pashto', native: 'پښتو', rtl: true },
];
