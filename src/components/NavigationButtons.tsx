interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export function NavigationButtons({ 
  onBack, 
  onNext, 
  nextDisabled,
  nextLabel = 'Próximo',
  backLabel = 'Voltar'
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-4 mt-12">
      {onBack ? (
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border-2 border-[#E8E9EC] text-[#8C8D96] font-medium hover:border-[#8C8D96] transition-colors"
        >
          {backLabel}
        </button>
      ) : (
        <div />
      )}
      
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="px-8 py-3 rounded-lg bg-[#4559F6] text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
