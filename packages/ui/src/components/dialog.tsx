'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../lib/utils';

/**
 * Dialog/Modal — wrapper sobre @radix-ui/react-dialog.
 *
 * Comportamentos garantidos pelo Radix:
 *   • Focus trap automático ao abrir
 *   • Restauração de foco ao elemento anterior no fechar
 *   • ESC fecha o dialog
 *   • Click no overlay fecha
 *   • Aria attributes corretos (role="dialog", aria-modal="true")
 *
 * Layout responsivo:
 *   • Mobile (< sm): bottom sheet full-width
 *   • Desktop (≥ sm): centralizado com max-w configurável
 *
 * Animações via tailwindcss-animate (data-[state=open|closed]).
 */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<DialogSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize;
  /** Hide the default close button (e.g. when content has its own). */
  hideCloseButton?: boolean;
  /** Visual tone — light by default, dark for navy-themed apps. */
  tone?: 'light' | 'dark';
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    { className, children, size = 'md', hideCloseButton, tone = 'light', ...props },
    ref,
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 w-full overflow-y-auto shadow-2xl outline-none',
          'duration-normal',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          // Mobile: bottom sheet
          'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-2xl p-4 pt-12',
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          // Desktop: centered modal
          'sm:inset-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:rounded-2xl sm:p-6 sm:pt-6',
          'sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[90vh]',
          'sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0',
          'sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95',
          sizeClasses[size],
          tone === 'dark'
            ? 'bg-surface-dark-card border border-brand-deep/30 text-foreground-on-dark'
            : 'bg-surface border border-border-default text-foreground',
          className,
        )}
        {...props}
      >
        {children}
        {!hideCloseButton && (
          <DialogPrimitive.Close
            aria-label="Fechar"
            className={cn(
              'absolute right-3 top-3 sm:right-4 sm:top-4',
              'inline-flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-full',
              'text-muted-foreground transition-colors',
              'hover:bg-surface-hover hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            )}
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5 mb-4 pr-8', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-tight tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
