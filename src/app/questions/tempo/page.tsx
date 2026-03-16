'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { OptionCard } from '@/components/OptionCard';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { Tempo } from '@/types/onboarding';

export default function TempoPage() {
  const router = useRouter();
  const { answers, setAnswer } = useOnboardingStore();
  const [selected, setSelected] = useState<Tempo | undefined>(answers.tempo);

  const options: { value: Tempo; title: string; description: string }[] = [
    {
      value: 'menos_3h',
      title: 'Menos de 3 horas',
      description: '',
    },
    {
      value: '3_5h',
      title: '3 a 5 horas',
      description: '',
    },
    {
      value: '6_10h',
      title: '6 a 10 horas',
      description: '',
    },
    {
      value: 'mais_10h',
      title: 'Mais de 10 horas',
      description: '',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Logo />
      </header>

      <ProgressBar current={5} total={7} />

      <main className="flex-1 py-8">
        <QuestionCard
          title="Quanto tempo você pode dedicar por semana ao seu desenvolvimento?"
          subtitle="Calibra o ritmo do plano"
        >
          {options.map((option) => (
            <OptionCard
              key={option.value}
              title={option.title}
              description={option.description}
              selected={selected === option.value}
              onClick={() => setSelected(option.value)}
            />
          ))}
        </QuestionCard>

        <div className="max-w-3xl mx-auto px-6">
          <NavigationButtons
            onBack={() => router.push('/questions/urgencia')}
            onNext={() => {
              if (selected) {
                setAnswer('tempo', selected);
                router.push('/questions/barreiras');
              }
            }}
            nextDisabled={!selected}
          />
        </div>
      </main>
    </div>
  );
}
