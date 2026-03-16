'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { useOnboardingStore } from '@/store/onboarding-store';
import { gerarPlanoPersonalizado } from '@/lib/mapping-engine';

export default function LoadingPage() {
  const router = useRouter();
  const { answers, setPlano } = useOnboardingStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const plano = gerarPlanoPersonalizado(answers);
        setPlano(plano);
        router.push('/plano');
      } catch {
        router.push('/plano');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [answers, setPlano, router]);

  const steps = [
    'Analisando seu perfil...',
    'Identificando seu momento...',
    'Montando seu plano personalizado...',
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-16 flex items-center px-6 border-b border-gray-200">
        <Logo />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-10 px-6">
        {/* Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-[#4559F6] border-t-transparent animate-spin" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#1A1A26]">
            Criando seu plano personalizado
          </h2>
          <p className="text-[#8C8D96]">
            Estamos analisando suas respostas para montar a melhor jornada para você
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm text-[#8C8D96]"
              style={{ animationDelay: `${i * 0.8}s` }}
            >
              <div className="w-5 h-5 rounded-full bg-[#4559F6] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {step}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
