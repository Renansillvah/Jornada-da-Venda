import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Image as ImageIcon, Plus, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImagesSelected: (files: File[], base64Images: string[]) => void;
  className?: string;
  maxImages?: number;
}

export function ImageUpload({ onImagesSelected, className, maxImages = 5 }: ImageUploadProps) {
  const [previews, setPreviews] = useState<Array<{ file: File; base64: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = async (files: FileList) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Por favor, selecione apenas imagens');
      return;
    }

    if (previews.length + imageFiles.length > maxImages) {
      alert(`Você pode adicionar no máximo ${maxImages} imagens`);
      return;
    }

    const newPreviews: Array<{ file: File; base64: string }> = [];

    for (const file of imageFiles) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newPreviews.push({ file, base64 });
    }

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    onImagesSelected(
      updatedPreviews.map(p => p.file),
      updatedPreviews.map(p => p.base64)
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    onImagesSelected(
      updatedPreviews.map(p => p.file),
      updatedPreviews.map(p => p.base64)
    );
  };

  const handleClearAll = () => {
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImagesSelected([], []);
  };

  return (
    <div className={cn('w-full space-y-3', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files) handleFilesSelect(e.target.files);
        }}
        className="hidden"
      />

      {/* Dica sobre mais imagens */}
      <Alert className="bg-info/5 border-info/30">
        <Lightbulb className="h-4 w-4 text-info" />
        <AlertDescription className="text-xs">
          <strong>💡 Dica:</strong> Quanto mais imagens você enviar, mais completa será a análise!
          Envie prints de diferentes momentos: Instagram, WhatsApp, proposta, reunião, follow-up, etc.
          (Máximo: {maxImages} imagens)
        </AlertDescription>
      </Alert>

      {previews.length === 0 ? (
        <Card
          className={cn(
            'border-2 border-dashed transition-colors cursor-pointer',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Arraste imagens ou clique para selecionar
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pode adicionar até {maxImages} imagens de diferentes momentos da jornada
            </p>
            <Button type="button" variant="outline">
              <ImageIcon className="w-4 h-4 mr-2" />
              Selecionar Imagens
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <div className="relative aspect-video">
                  <img
                    src={preview.base64}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}/{previews.length}
                  </div>
                </div>
              </Card>
            ))}

            {/* Botão para adicionar mais */}
            {previews.length < maxImages && (
              <Card
                className="relative overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
                onClick={handleClick}
              >
                <div className="aspect-video flex flex-col items-center justify-center">
                  <Plus className="w-8 h-8 text-primary mb-2" />
                  <span className="text-xs text-primary font-medium">Adicionar mais</span>
                </div>
              </Card>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAll}
            >
              <X className="w-3 h-3 mr-1" />
              Limpar todas
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
