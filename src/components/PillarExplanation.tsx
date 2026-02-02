import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PillarExplanationProps {
  explanation: string;
  pillarName: string;
}

export function PillarExplanation({ explanation, pillarName }: PillarExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!explanation || explanation === 'Sem dados') {
    return null;
  }

  return (
    <div className="mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto p-2 w-full justify-start text-xs hover:bg-primary/5"
      >
        <Info className="w-3 h-3 mr-2 text-primary flex-shrink-0" />
        <span className="font-medium text-primary">
          {isExpanded ? 'Ocultar' : 'Ver'} análise detalhada
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3 ml-auto" />
        ) : (
          <ChevronDown className="w-3 h-3 ml-auto" />
        )}
      </Button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mt-2 p-3 bg-muted/50 rounded-md border border-muted">
          <p className="text-xs text-foreground leading-relaxed">
            <strong className="text-primary">💡 Análise da IA:</strong> {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
