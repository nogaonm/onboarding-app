import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  selected?: boolean;
  onClick?: () => void;
}

export function ServiceCard({ icon: Icon, title, selected, onClick }: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'p-5 rounded-xl border-2 text-center transition-all hover:border-primary',
        selected ? 'border-primary bg-gray-50' : 'border-gray-200 bg-white'
      )}
    >
      <div className={clsx(
        'w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center',
        selected ? 'bg-blue-50 text-primary' : 'bg-gray-100 text-gray-400'
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-sm font-medium text-primary-dark">
        {title}
      </div>
    </button>
  );
}
