'use client';

import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center px-6 border-b border-gray-200">
        <Logo />
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-primary-dark mb-4">
            Bem-vindo ao O Novo Mercado
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Vamos descobrir o melhor caminho para você no digital.
            Responda algumas perguntas e receba um plano personalizado.
          </p>
          <button
            onClick={() => router.push('/questions/objetivo')}
            className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors"
          >
            Começar
          </button>
        </div>
      </main>
    </div>
  );
}
