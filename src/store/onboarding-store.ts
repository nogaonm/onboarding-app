import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingAnswers, PlanoPersonalizado } from '@/types/onboarding';

interface OnboardingStore {
  answers: OnboardingAnswers;
  plano: PlanoPersonalizado | null;
  currentStep: number;
  
  setAnswer: <K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K]
  ) => void;
  
  setPlano: (plano: PlanoPersonalizado) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      answers: {},
      plano: null,
      currentStep: 0,
      
      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),
      
      setPlano: (plano) => set({ plano }),
      
      nextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),
      
      prevStep: () =>
        set((state) => ({ 
          currentStep: Math.max(0, state.currentStep - 1) 
        })),
      
      reset: () =>
        set({ answers: {}, plano: null, currentStep: 0 }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
