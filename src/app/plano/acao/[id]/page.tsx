'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboarding-store';
import { Logo } from '@/components/Logo';
import type { Acao, Fase } from '@/types/onboarding';

function SectionCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E9EC] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8E9EC]">
        <span className="text-xs font-bold text-[#8C8D96] uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function PromptCard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[#F8F9FF] rounded-xl p-4 border border-[#E8E9EC]">
      <p className="text-sm text-[#5A5B66] leading-relaxed pr-8">&ldquo;{text}&rdquo;</p>
      <button
        onClick={copy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#4559F6] font-medium"
      >
        {copied ? '✓' : 'Copiar'}
      </button>
    </div>
  );
}


export default function EspacoDeAulaPage() {
  const router = useRouter();
  const params = useParams();
  const { plano, marcarConcluido, concluidos } = useOnboardingStore();
  const id = params?.id as string;

  type ItemPlano = {
    id: string;
    acao: Acao;
    fase: Fase;
    indexFase: number;
    indexItem: number;
  };

  const todosItens: ItemPlano[] = [];
  plano?.fases.forEach((fase, fi) => {
    fase.acoes.forEach((acao, ai) => {
      todosItens.push({ id: acao.id, acao, fase, indexFase: fi, indexItem: ai });
    });
  });

  const current = todosItens.find((x) => x.id === id);
  const currentGlobalIndex = todosItens.findIndex((x) => x.id === id);
  const prevAcao = currentGlobalIndex > 0 ? todosItens[currentGlobalIndex - 1] : null;
  const nextAcao = currentGlobalIndex < todosItens.length - 1 ? todosItens[currentGlobalIndex + 1] : null;

  if (!plano || !current) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8C8D96] mb-4">Ação não encontrada.</p>
          <button
            onClick={() => router.push('/plano')}
            className="px-6 py-3 bg-[#4559F6] text-white rounded-lg font-medium"
          >
            Voltar ao plano
          </button>
        </div>
      </div>
    );
  }

  const { fase, indexItem, acao } = current;
  const totalItensFase = fase.acoes.length;

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      {/* TopBar */}
      <header className="h-14 bg-white border-b border-[#E8E9EC] flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Logo />
          <button
            onClick={() => router.push('/plano')}
            className="flex items-center gap-1.5 text-sm text-[#5A5B66] hover:text-[#4559F6] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar ao plano
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-[#E8E9EC] p-6">
          <div className="w-full h-1.5 bg-[#E8E9EC] rounded-full mb-6">
            <div
              className="h-full bg-[#4559F6] rounded-full transition-all"
              style={{ width: `${((indexItem + 1) / totalItensFase) * 100}%` }}
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A26] mb-2">
            {acao.titulo}
          </h1>
          <p className="text-sm text-[#8C8D96] leading-relaxed">
            {acao.descricao}
          </p>
        </div>

        {/* Conteúdo */}
        {acao.conteudoSuporte ? (
          <SectionCard label="Conteúdo">
            <div className="space-y-5">
              {[acao.conteudoSuporte, ...(acao.conteudosAdicionais ?? [])].map((conteudo, idx) => (
                <div key={idx} className={`flex gap-5 items-stretch ${idx > 0 ? 'pt-5 border-t border-[#E8E9EC]' : ''}`}>
                  <div className="w-[200px] min-h-[130px] bg-[#1A1A26] rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <svg className="w-6 h-6 text-white ml-0.5" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 3l9 5-9 5V3z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-[#4559F6] uppercase tracking-wide">
                      {conteudo.tipo}
                    </span>
                    <h3 className="font-semibold text-[#1A1A26] mt-0.5 mb-1 text-base">
                      {conteudo.titulo}
                    </h3>
                    <p className="text-sm text-[#8C8D96] leading-relaxed mb-4">
                      {conteudo.descricao}
                    </p>
                    <button className="px-5 py-2.5 bg-[#4559F6] text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                      Continuar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {/* O que é esperado de você */}
        <SectionCard label="O que é esperado de você">
          <div className="text-sm text-[#5A5B66] leading-relaxed whitespace-pre-line">
            {acao.tarefaEsperada}
          </div>
        </SectionCard>

        {/* Prompts Omnia */}
        {acao.promptsOmnia.length > 0 && (
          <SectionCard label="Use a Omnia para executar">
            <div className="space-y-3">
              {acao.promptsOmnia.map((prompt, i) => (
                <PromptCard key={i} text={prompt} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Comunidade */}
        {acao.orientacoesComunidade.length > 0 && (
          <a
            href="https://comunidade.onovomercado.com/c/jornada-onm/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <SectionCard label="Mostre na comunidade">
              <ul className="space-y-3">
                {acao.orientacoesComunidade.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#5A5B66]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4559F6] mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </a>
        )}

        {/* Critério de conclusão */}
        <SectionCard label="Como saber que terminei">
          <p className="text-sm text-[#5A5B66] leading-relaxed">
            {acao.criterioConclusao}
          </p>
        </SectionCard>

        {/* Navegação inferior — 3 colunas fixas */}
        <div className="pt-6 pb-10 grid grid-cols-3 gap-4 items-center">
          <div className="flex justify-start">
            {prevAcao && (
              <button
                onClick={() => router.push(`/plano/acao/${prevAcao.id}`)}
                className="px-5 py-3 rounded-xl border-2 border-[#E8E9EC] text-[#5A5B66] font-medium hover:border-[#4559F6] transition-colors text-sm"
              >
                ← Anterior
              </button>
            )}
          </div>

          <div className="flex justify-center">
            {concluidos.includes(current.id) ? (
              <span className="px-6 py-3 rounded-xl bg-gray-100 text-[#8C8D96] font-semibold text-sm whitespace-nowrap flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Concluída
              </span>
            ) : (
              <button
                onClick={() => {
                  marcarConcluido(current.id);
                  if (nextAcao) {
                    router.push(`/plano/acao/${nextAcao.id}`);
                  } else {
                    router.push('/plano');
                  }
                }}
                className="px-6 py-3 rounded-xl bg-[#4559F6] text-white font-semibold hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
              >
                Marcar como concluída ✓
              </button>
            )}
          </div>

          <div className="flex justify-end">
            {nextAcao && (
              <button
                onClick={() => router.push(`/plano/acao/${nextAcao.id}`)}
                className="px-5 py-3 rounded-xl border-2 border-[#E8E9EC] text-[#5A5B66] font-medium hover:border-[#4559F6] transition-colors text-sm"
              >
                Próxima →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
