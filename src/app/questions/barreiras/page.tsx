'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { Barreira } from '@/types/onboarding';
import clsx from 'clsx';

export default function BarreirasPage() {
  const router = useRouter();
  const { answers, setAnswer } = useOnboardingStore();
  const [selected, setSelected] = useState<Barreira[]>(answers.barreiras ?? []);

  const options: { value: Barreira; title: string }[] = [
    { value: 'nao_sei_comecar', title: 'Não sei por onde começar' },
    { value: 'falta_tempo', title: 'Falta de tempo' },
    { value: 'falta_posicionamento', title: 'Falta de clareza sobre meu posicionamento' },
    { value: 'dificuldade_atrair_clientes', title: 'Dificuldade em atrair clientes' },
    { value: 'dificuldade_vender', title: 'Dificuldade em vender' },
    { value: 'falta_conhecimento', title: 'Falta de conhecimento técnico' },
    { value: 'falta_ferramentas', title: 'Falta de ferramentas ou recursos' },
    { value: 'falta_rede', title: 'Falta de rede de contatos / comunidade' },
    { value: 'medo_impostor', title: 'Medo de errar ou síndrome do impostor' },
    { value: 'procrastinacao', title: 'Procrastinação ou falta de disciplina' },
  ];

  const toggle = (v: Barreira) => {
    setSelected((prev) => {
      if (prev.includes(v)) {
        return prev.filter((x) => x !== v);
      }
      if (prev.length >= 2) return prev;
      return [...prev, v];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Logo />
      </header>

      <ProgressBar current={6} total={7} />

      <main className="flex-1 py-8">
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#1A1A26] mb-2">
              O que mais te impede de avançar hoje?
            </h1>
            <p className="text-[#8C8D96] text-base">
              Marque até 2
            </p>
          </div>

          <div className="space-y-4">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggle(option.value)}
                  className={clsx(
                    'w-full p-6 rounded-2xl border-2 text-left transition-all',
                    'hover:border-[#4559F6]',
                    isSelected
                      ? 'border-[#4559F6] bg-gray-50'
                      : 'border-[#E8E9EC] bg-white'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      'w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center',
                      isSelected
                        ? 'border-[#4559F6] bg-[#4559F6]'
                        : 'border-[#E8E9EC]'
                    )}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      )}
                    </div>
                    <div className="font-medium text-[#1A1A26]">{option.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <NavigationButtons
            onBack={() => router.push('/questions/tempo')}
            onNext={() => {
              if (selected.length > 0) {
                setAnswer('barreiras', selected);
                router.push('/questions/presenca');
              }
            }}
            nextDisabled={selected.length === 0}
          />
        </div>
      </main>
    </div>
  );
}
