'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { OptionCard } from '@/components/OptionCard';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { PresencaDigital } from '@/types/onboarding';

export default function PresencaPage() {
  const router = useRouter();
  const { answers, setAnswer } = useOnboardingStore();
  const [selected, setSelected] = useState<PresencaDigital | undefined>(answers.presencaDigital);

  const options: { value: PresencaDigital; title: string; description: string }[] = [
    {
      value: 'ativa',
      title: 'Sim, já tenho presença ativa (site, redes ou portfólio)',
      description: '',
    },
    {
      value: 'nao_estrategica',
      title: 'Tenho perfis, mas ainda não uso de forma estratégica',
      description: '',
    },
    {
      value: 'zero',
      title: 'Não, vou começar do zero',
      description: '',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Logo />
      </header>

      <ProgressBar current={7} total={7} />

      <main className="flex-1 py-8">
        <QuestionCard
          title="Você já possui presença digital estruturada?"
          subtitle=""
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
            onBack={() => router.push('/questions/barreiras')}
            onNext={() => {
              if (selected) {
                setAnswer('presencaDigital', selected);
                router.push('/loading');
              }
            }}
            nextDisabled={!selected}
            nextLabel="Ver meu plano"
          />
        </div>
      </main>
    </div>
  );
}
