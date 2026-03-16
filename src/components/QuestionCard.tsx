import { ReactNode } from 'react';

interface QuestionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function QuestionCard({ title, subtitle, children }: QuestionCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#1A1A26] mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#8C8D96] text-base">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
