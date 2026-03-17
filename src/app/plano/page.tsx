'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboarding-store';
import { Logo } from '@/components/Logo';
import type { Fase, Momento } from '@/types/onboarding';
import clsx from 'clsx';

const momentoLabel: Record<Momento, string> = {
  explorador: 'Explorador',
  construtor: 'Construtor',
  operador: 'Operador',
  referencia: 'Referência',
};

function FaseCard({ fase, defaultOpen, concluidos }: { fase: Fase; defaultOpen: boolean; concluidos: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-[#E8E9EC] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-[#4559F6] tracking-widest uppercase">
            Fase {fase.numero}
          </span>
          <span className="text-base font-semibold text-[#1A1A26]">{fase.titulo}</span>
        </div>
        <div className="flex items-center gap-3">
          {!open && (
            <span className="text-xs text-[#8C8D96] bg-gray-100 px-2 py-1 rounded-full">
              {fase.acoes.length} ações
            </span>
          )}
          <svg
            className={clsx('w-4 h-4 text-[#8C8D96] transition-transform', open && 'rotate-180')}
            viewBox="0 0 16 16" fill="none"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-[#E8E9EC]">
          <p className="px-6 py-4 text-sm text-[#8C8D96]">{fase.descricao}</p>

          <div className="px-6 pb-2 space-y-1">
            {fase.acoes.map((acao) => {
              const done = concluidos.includes(acao.id);
              return (
                <button
                  key={acao.id}
                  onClick={() => router.push(`/plano/acao/${acao.id}`)}
                  className={clsx(
                    'w-full flex items-center gap-4 py-4 px-2 rounded-xl transition-colors group text-left',
                    done ? 'bg-gray-50/60' : 'hover:bg-gray-50',
                  )}
                >
                  <div className="w-2 h-2 rounded-full bg-[#4559F6] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className={clsx('font-medium text-sm', done ? 'text-[#8C8D96]' : 'text-[#1A1A26]')}>{acao.titulo}</div>
                    <div className="text-xs text-[#8C8D96] mt-0.5">{acao.descricao}</div>
                  </div>
                  {done ? (
                    <div className="w-5 h-5 rounded-full bg-[#4559F6] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <svg
                      className="w-4 h-4 text-[#8C8D96] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      viewBox="0 0 16 16" fill="none"
                    >
                      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mx-6 mb-5 mt-2 px-4 py-3 bg-gray-50 rounded-xl border border-[#E8E9EC]">
            <span className="text-xs font-semibold text-[#8C8D96]">Marco: </span>
            <span className="text-xs text-[#5A5B66]">{fase.marco}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanoPage() {
  const router = useRouter();
  const { plano, concluidos } = useOnboardingStore();

  if (!plano) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8C8D96] mb-4">Plano não encontrado.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#4559F6] text-white rounded-lg font-medium"
          >
            Refazer onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      {/* TopBar */}
      <header className="h-14 bg-white border-b border-[#E8E9EC] flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Logo />
          <span className="text-sm font-medium text-[#5A5B66]">Meu Plano</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#4559F6] flex items-center justify-center text-white text-sm font-bold">
          M
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-4">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl border border-[#E8E9EC] p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold text-[#1A1A26]">
              Seu plano está pronto!
            </h1>
            <span className="flex-shrink-0 text-xs font-medium text-[#4559F6] bg-blue-50 px-3 py-1.5 rounded-full">
              {momentoLabel[plano.momento]}
            </span>
          </div>
          <p className="text-sm font-semibold text-[#4559F6] mb-3">{plano.jornada}</p>
          <p className="text-sm text-[#5A5B66] leading-relaxed">{plano.mensagemBemVinda}</p>
        </div>

        {/* Primeiro Passo */}
        {plano.primeiroPasso && (
          <div className="bg-white rounded-2xl border border-[#E8E9EC] p-6">
            <h3 className="text-xs font-bold text-[#4559F6] tracking-widest uppercase mb-2">
              Seu primeiro passo
            </h3>
            <p className="text-sm text-[#5A5B66] leading-relaxed">
              {plano.primeiroPasso}
            </p>
          </div>
        )}

        {/* Fases */}
        <h2 className="text-xl font-bold text-[#1A1A26] pt-2">
          Seu plano em {plano.fases.length} fases
        </h2>

        {plano.fases.map((fase, i) => (
          <FaseCard key={fase.numero} fase={fase} defaultOpen={i === 0} concluidos={concluidos} />
        ))}

        {/* CTA */}
        <div className="pt-4 pb-8 flex justify-center">
          <button
            onClick={() => {
              const primeiraAcao = plano.fases[0]?.acoes[0];
              if (primeiraAcao) {
                router.push(`/plano/acao/${primeiraAcao.id}`);
              }
            }}
            className="px-8 py-4 bg-[#4559F6] text-white rounded-xl font-semibold text-base hover:bg-blue-600 transition-colors"
          >
            Começar minha jornada
          </button>
        </div>
      </main>
    </div>
  );
}
