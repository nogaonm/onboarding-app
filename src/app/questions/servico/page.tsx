'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Pen, BarChart3, Headset, MousePointer, Settings } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { ServiceCard } from '@/components/ServiceCard';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useOnboardingStore } from '@/store/onboarding-store';
import type { SubServico } from '@/types/onboarding';
import type { LucideIcon } from 'lucide-react';

export default function ServicoPage() {
  const router = useRouter();
  const { answers, setAnswer } = useOnboardingStore();
  const [selected, setSelected] = useState<SubServico | undefined>(answers.subServico);

  const services: { value: SubServico; icon: LucideIcon; title: string }[] = [
    { value: 'social_media', icon: Smartphone, title: 'Social Media' },
    { value: 'copywriting', icon: Pen, title: 'Copywriting' },
    { value: 'trafego_pago', icon: BarChart3, title: 'Tráfego Pago' },
    { value: 'assistencia_virtual', icon: Headset, title: 'Assistência Virtual' },
    { value: 'design', icon: MousePointer, title: 'Design' },
    { value: 'outro', icon: Settings, title: 'Outro' },
  ];

  const handleNext = () => {
    if (selected) {
      setAnswer('subServico', selected);
      router.push('/questions/clientes');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Logo />
      </header>
      
      <ProgressBar current={1.5} total={7} />

      <main className="flex-1 py-8">
        <QuestionCard title="Qual tipo de serviço você pretende oferecer?">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {services.map((service) => (
              <ServiceCard
                key={service.value}
                icon={service.icon}
                title={service.title}
                selected={selected === service.value}
                onClick={() => setSelected(service.value)}
              />
            ))}
          </div>
        </QuestionCard>

        <div className="max-w-3xl mx-auto px-6">
          <NavigationButtons
            onBack={() => router.push('/questions/objetivo')}
            onNext={handleNext}
            nextDisabled={!selected}
          />
        </div>
      </main>
    </div>
  );
}
