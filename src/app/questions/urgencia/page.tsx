'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { OptionCard } from '@/components/OptionCard';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { Urgencia } from '@/types/onboarding';

export default function UrgenciaPage() {
  const router = useRouter();
  const { answers, setAnswer } = useOnboardingStore();
  const [selected, setSelected] = useState<Urgencia | undefined>(answers.urgencia);

  const options: { value: Urgencia; title: string; description: string }[] = [
    {
      value: 'imediata',
      title: 'Preciso gerar renda rapidamente (até 30 dias)',
      description: '',
    },
    {
      value: 'curto_prazo',
      title: 'Preciso gerar renda nos próximos 3 meses',
      description: '',
    },
    {
      value: 'medio_prazo',
      title: 'Tenho alguma urgência, mas posso construir com calma (até 6 meses)',
      description: '',
    },
    {
      value: 'longo_prazo',
      title: 'Não tenho urgência financeira, estou aprendendo no longo prazo',
      description: '',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Logo />
      </header>

      <ProgressBar current={4} total={7} />

      <main className="flex-1 py-8">
        <QuestionCard
          title="Qual é a sua situação financeira em relação a esse objetivo?"
          subtitle="Prioriza ações de curto prazo no plano"
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
            onBack={() => router.push('/questions/momento')}
            onNext={() => {
              if (selected) {
                setAnswer('urgencia', selected);
                router.push('/questions/tempo');
              }
            }}
            nextDisabled={!selected}
          />
        </div>
      </main>
    </div>
  );
}
