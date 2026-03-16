'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { OptionCard } from '@/components/OptionCard';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { Objetivo } from '@/types/onboarding';

export default function ObjetivoPage() {
  const router = useRouter();
  const { answers, setAnswer } = useOnboardingStore();
  const [selected, setSelected] = useState<Objetivo | undefined>(answers.objetivo);

  const options: { value: Objetivo; title: string; description: string }[] = [
    {
      value: 'migrar_digital',
      title: 'Migrar para o digital',
      description: 'Descobrir uma nova área de atuação no mercado digital',
    },
    {
      value: 'prestar_servicos',
      title: 'Prestar serviços',
      description: 'Social media, tráfego, copy, design e outros serviços digitais',
    },
    {
      value: 'criar_infoprodutos',
      title: 'Criar infoprodutos',
      description: 'Curso, mentoria, consultoria ou outros produtos digitais',
    },
    {
      value: 'vender_fisicos',
      title: 'Vender produtos físicos',
      description: 'Presencialmente ou por e-commerce',
    },
    {
      value: 'desenvolver_habilidades',
      title: 'Desenvolver habilidades',
      description: 'Habilidades digitais para meu trabalho atual',
    },
    {
      value: 'outro',
      title: 'Outro objetivo',
      description: 'Tenho um objetivo diferente dos listados acima',
    },
  ];

  const handleNext = () => {
    if (selected) {
      setAnswer('objetivo', selected);
      
      // Se escolheu "Prestar serviços", vai para sub-pergunta
      if (selected === 'prestar_servicos') {
        router.push('/questions/servico');
      } else {
        // Senão, pula para P2
        router.push('/questions/clientes');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Logo />
      </header>
      
      <ProgressBar current={1} total={7} />

      <main className="flex-1 py-8">
        <QuestionCard
          title="O que você quer construir ou desenvolver no digital?"
          subtitle="Escolha a opção que mais se aproxima do seu objetivo"
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
            onBack={() => router.push('/')}
            onNext={handleNext}
            nextDisabled={!selected}
          />
        </div>
      </main>
    </div>
  );
}
