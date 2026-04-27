'use client';

/**
 * Toaster — wrapper sobre `sonner`. Padrão pré-configurado do ecossistema.
 *
 * Uso (uma vez por app, no layout root):
 *   import { Toaster } from '@gradios/ui';
 *   <Toaster />
 *
 * Para disparar toasts:
 *   import { toast } from 'sonner';
 *   toast.success('Receita salva');
 *   toast.error('Não conseguimos salvar. Verifique sua conexão.');
 *
 * Sonner é peer dependency opcional — se não estiver instalado, este módulo
 * não deve ser importado.
 */

import * as React from 'react';
import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

export interface AppToasterProps extends ToasterProps {
  /** Visual tone — light (default) or dark navy. */
  tone?: 'light' | 'dark';
}

export function Toaster({
  tone = 'light',
  position = 'top-right',
  duration = 3000,
  closeButton = true,
  richColors = true,
  ...props
}: AppToasterProps) {
  return (
    <SonnerToaster
      position={position}
      duration={duration}
      closeButton={closeButton}
      richColors={richColors}
      theme={tone === 'dark' ? 'dark' : 'light'}
      toastOptions={{
        classNames: {
          toast:
            'rounded-lg border border-border-default shadow-card bg-surface-card text-foreground',
          title: 'font-semibold text-sm',
          description: 'text-xs text-muted-foreground',
          actionButton: 'bg-accent text-white text-xs px-2 py-1 rounded-md',
          cancelButton:
            'bg-surface-hover text-foreground text-xs px-2 py-1 rounded-md',
          error: 'bg-danger/10 text-danger border-danger/30',
          success: 'bg-success/10 text-success border-success/30',
          warning: 'bg-warning/10 text-warning border-warning/30',
          info: 'bg-accent/10 text-accent border-accent/30',
        },
      }}
      {...props}
    />
  );
}

export { toast } from 'sonner';
