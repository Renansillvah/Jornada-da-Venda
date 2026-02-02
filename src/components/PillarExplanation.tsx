import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
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

  // Tentar extrair as seções do formato estruturado
  const sections = {
    seen: '',
    impact: '',
    actions: ''
  };

  // Extrair "O QUE FOI VISTO"
  const seenMatch = explanation.match(/O QUE FOI VISTO:?\s*([^⚠️✅]+)/i);
  if (seenMatch) sections.seen = seenMatch[1].trim();

  // Extrair "IMPACTO"
  const impactMatch = explanation.match(/IMPACTO[^:]*:?\s*([^✅]+)/i);
  if (impactMatch) sections.impact = impactMatch[1].trim();

  // Extrair "O QUE FAZER"
  const actionsMatch = explanation.match(/O QUE FAZER[^:]*:?\s*(.+)/is);
  if (actionsMatch) sections.actions = actionsMatch[1].trim();

  // Se não encontrou o formato estruturado, usa o texto inteiro
  const hasStructure = sections.seen || sections.impact || sections.actions;

  return (
    <div className="mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto p-2 w-full justify-start text-xs hover:bg-primary/5"
      >
        <Lightbulb className="w-3.5 h-3.5 mr-2 text-primary flex-shrink-0" />
        <span className="font-semibold text-primary">
          {isExpanded ? 'Ocultar' : 'Ver'} análise completa + ações práticas
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 ml-auto" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 ml-auto" />
        )}
      </Button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mt-2 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 space-y-3 max-h-[800px] overflow-y-auto">
          {hasStructure ? (
            <>
              {sections.seen && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Eye className="w-4 h-4 text-info" />
                    <h4 className="text-xs font-bold text-info uppercase tracking-wide">
                      O que foi identificado
                    </h4>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed pl-6">
                    {sections.seen}
                  </p>
                </div>
              )}

              {sections.impact && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    <h4 className="text-xs font-bold text-warning uppercase tracking-wide">
                      Impacto na decisão do cliente
                    </h4>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed pl-6">
                    {sections.impact}
                  </p>
                </div>
              )}

              {sections.actions && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <h4 className="text-xs font-bold text-success uppercase tracking-wide">
                      Ações práticas para melhorar
                    </h4>
                  </div>
                  <div className="text-xs text-foreground leading-relaxed pl-6 whitespace-pre-line">
                    {sections.actions}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                  Análise da IA
                </h4>
              </div>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                {explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
