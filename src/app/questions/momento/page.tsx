'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { OptionCard } from '@/components/OptionCard';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { Momento } from '@/types/onboarding';

export default function MomentoPage() {
  const router = useRouter();
  const { answers, setAnswer } = useOnboardingStore();
  const [selected, setSelected] = useState<Momento | undefined>(answers.momento);

  const options: { value: Momento; title: string; description: string }[] = [
    {
      value: 'explorador',
      title: 'Estou descobrindo o que quero fazer, testando possibilidades',
      description: '',
    },
    {
      value: 'construtor',
      title: 'Sei o que quero, estou estruturando meu negócio/serviço',
      description: '',
    },
    {
      value: 'operador',
      title: 'Já tenho clientes/vendas, quero otimizar e escalar',
      description: '',
    },
    {
      value: 'referencia',
      title: 'Quero me tornar autoridade e expandir meu impacto',
      description: '',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Logo />
      </header>

      <ProgressBar current={3} total={7} />

      <main className="flex-1 py-8">
        <QuestionCard
          title="Em que momento você se encontra?"
          subtitle="Escolha o que melhor descreve sua situação atual"
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
            onBack={() => router.push('/questions/clientes')}
            onNext={() => {
              if (selected) {
                setAnswer('momento', selected);
                router.push('/questions/urgencia');
              }
            }}
            nextDisabled={!selected}
          />
        </div>
      </main>
    </div>
  );
}
