import { ReactNode } from 'react';
import clsx from 'clsx';

interface OptionCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function OptionCard({ 
  icon, 
  title, 
  description, 
  selected, 
  onClick 
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full p-6 rounded-2xl border-2 text-left transition-all',
        'hover:border-[#4559F6] hover:bg-[#FAFAFC]',
        selected 
          ? 'border-[#4559F6] bg-[#FAFAFC]' 
          : 'border-[#E8E9EC] bg-white'
      )}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            selected ? 'bg-[#EEF0FE]' : 'bg-[#F5F5F7]'
          )}>
            {icon}
          </div>
        )}
        
        <div className="flex-1">
          <div className="font-medium text-[#1A1A26] mb-1">
            {title}
          </div>
          {description && (
            <div className="text-sm text-[#8C8D96]">
              {description}
            </div>
          )}
        </div>
        
        <div className={clsx(
          'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1',
          selected 
            ? 'border-[#4559F6] bg-[#4559F6]' 
            : 'border-[#E8E9EC]'
        )}>
          {selected && (
            <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
