'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { OptionCard } from '@/components/OptionCard';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { Clientes } from '@/types/onboarding';

export default function ClientesPage() {
  const router = useRouter();
  const { answers, setAnswer } = useOnboardingStore();
  const [selected, setSelected] = useState<Clientes | undefined>(answers.clientes);

  const options: { value: Clientes; title: string; description: string }[] = [
    {
      value: 'sim_recorrente',
      title: 'Sim, já tenho clientes e faturamento recorrente',
      description: '',
    },
    {
      value: 'sim_pontuais',
      title: 'Sim, já tive alguns clientes ou projetos pontuais',
      description: '',
    },
    {
      value: 'nao',
      title: 'Não, ainda estou me preparando para começar',
      description: '',
    },
    {
      value: 'nao_aplica',
      title: 'Não se aplica (estou em transição ou explorando)',
      description: '',
    },
  ];

  const handleNext = () => {
    if (selected) {
      setAnswer('clientes', selected);
      router.push('/questions/momento');
    }
  };

  const handleBack = () => {
    if (answers.objetivo === 'prestar_servicos') {
      router.push('/questions/servico');
    } else {
      router.push('/questions/objetivo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Logo />
      </header>

      <ProgressBar current={2} total={7} />

      <main className="flex-1 py-8">
        <QuestionCard
          title="Você já tem clientes ou já faturou com esse modelo de negócio?"
          subtitle="Calibra o tom e a profundidade do plano"
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
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={!selected}
          />
        </div>
      </main>
    </div>
  );
}
