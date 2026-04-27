'use client';

import * as React from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';

import { cn } from '../lib/utils';

/**
 * Sidebar — composição responsiva (desktop colapsável + drawer mobile).
 *
 * Padrão de uso:
 *   <SidebarProvider>
 *     <SidebarDesktop>
 *       <SidebarHeader>...</SidebarHeader>
 *       <SidebarBody>
 *         <SidebarNavItem href="/dashboard" active>...</SidebarNavItem>
 *       </SidebarBody>
 *       <SidebarFooter>...</SidebarFooter>
 *     </SidebarDesktop>
 *     <SidebarMobile>...</SidebarMobile>
 *     <SidebarMobileTrigger />
 *   </SidebarProvider>
 *
 * Cada app monta seus próprios nav items, logo e footer. O package fornece
 * apenas o estado, animações e shell responsivo.
 */

const MOBILE_WIDTH = 280;
const DESKTOP_COLLAPSED = 72;
const DESKTOP_EXPANDED = 260;

type SidebarContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  setMobileOpen: (v: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used within <SidebarProvider>');
  }
  return ctx;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  /** Initial collapsed state on desktop. Default: false. */
  defaultCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed: () => setCollapsed((c) => !c),
      mobileOpen,
      setMobileOpen,
      openMobile: () => setMobileOpen(true),
      closeMobile: () => setMobileOpen(false),
    }),
    [collapsed, mobileOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export interface SidebarDesktopProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual tone — light (default) or dark navy. */
  tone?: 'light' | 'dark';
  /** Custom class for the aside container. */
  className?: string;
}

export const SidebarDesktop = React.forwardRef<HTMLElement, SidebarDesktopProps>(
  ({ className, tone = 'light', children, ...props }, ref) => {
    const { collapsed } = useSidebar();
    return (
      <aside
        ref={ref}
        aria-label="Navegação principal"
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30',
          'border-r transition-[width] duration-normal ease-out-expo',
          tone === 'dark'
            ? 'bg-surface-dark-card border-brand-deep/30 text-foreground-on-dark backdrop-blur-xl'
            : 'bg-surface-sidebar border-border-default text-foreground',
          collapsed ? `w-[${DESKTOP_COLLAPSED}px]` : `w-[${DESKTOP_EXPANDED}px]`,
          className,
        )}
        style={{ width: collapsed ? DESKTOP_COLLAPSED : DESKTOP_EXPANDED }}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
SidebarDesktop.displayName = 'SidebarDesktop';

type DragHandlerKey =
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onTransitionEnd';

export interface SidebarMobileProps
  extends Omit<React.HTMLAttributes<HTMLElement>, DragHandlerKey> {
  tone?: 'light' | 'dark';
  /** Disable swipe-left to close (default enabled on mobile). */
  disableSwipeClose?: boolean;
}

export const SidebarMobile = React.forwardRef<HTMLElement, SidebarMobileProps>(
  ({ className, tone = 'light', disableSwipeClose, children, ...props }, ref) => {
    const { mobileOpen, closeMobile } = useSidebar();
    const x = useMotionValue(0);
    const overlayOpacity = useTransform(x, [-MOBILE_WIDTH, 0], [0, 1]);

    const handleDragEnd = React.useCallback(
      (_: unknown, info: PanInfo) => {
        if (info.offset.x < -80 || info.velocity.x < -300) {
          closeMobile();
        }
      },
      [closeMobile],
    );

    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ opacity: overlayOpacity }}
              onClick={closeMobile}
              className="lg:hidden fixed inset-0 z-40 bg-black/40"
              aria-hidden="true"
            />
            <motion.aside
              ref={ref as React.Ref<HTMLElement>}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              initial={{ x: -MOBILE_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -MOBILE_WIDTH }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              drag={disableSwipeClose ? false : 'x'}
              dragConstraints={{ left: -MOBILE_WIDTH, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              style={{
                x,
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
              className={cn(
                'lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] touch-pan-y',
                'flex flex-col',
                tone === 'dark'
                  ? 'bg-surface-dark-card text-foreground-on-dark'
                  : 'bg-surface text-foreground',
                className,
              )}
              {...props}
            >
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Fechar menu"
                className={cn(
                  'absolute right-3 z-10 h-11 w-11 inline-flex items-center justify-center rounded-xl',
                  'text-muted-foreground hover:text-foreground active:bg-surface-hover',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  'transition-colors',
                )}
                style={{ top: 'calc(12px + env(safe-area-inset-top, 0px))' }}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              {children}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  },
);
SidebarMobile.displayName = 'SidebarMobile';

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between p-4 shrink-0', className)}
    {...props}
  />
));
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarBody = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="Itens do menu"
    className={cn('flex-1 p-3 space-y-0.5 overflow-y-auto', className)}
    {...props}
  />
));
SidebarBody.displayName = 'SidebarBody';

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-4 space-y-3 shrink-0 border-t border-border-default/40', className)}
    {...props}
  />
));
SidebarFooter.displayName = 'SidebarFooter';

export interface SidebarNavItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether this item represents the current route. */
  active?: boolean;
  /** Icon rendered to the left. */
  icon?: React.ReactNode;
  /** Trailing slot (badge, count). */
  trailing?: React.ReactNode;
  /** Hide label when collapsed. Reads from context if omitted. */
  collapsed?: boolean;
  /** Tone of the active accent. */
  tone?: 'light' | 'dark';
}

export const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  (
    { className, active, icon, trailing, collapsed: collapsedProp, tone = 'light', children, ...props },
    ref,
  ) => {
    const ctx = React.useContext(SidebarContext);
    const collapsed = collapsedProp ?? ctx?.collapsed ?? false;

    return (
      <a
        ref={ref}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 min-h-[44px] rounded-lg text-sm font-medium relative',
          'transition-colors duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
          collapsed ? 'justify-center px-2' : 'px-3',
          active
            ? tone === 'dark'
              ? 'bg-accent/10 text-accent border border-accent/15'
              : 'bg-accent/10 text-accent border border-accent/20'
            : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-input',
          className,
        )}
        {...props}
      >
        {active && !collapsed && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent"
            aria-hidden="true"
          />
        )}
        {icon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {!collapsed && <span className="truncate">{children}</span>}
        {!collapsed && trailing && <span className="ml-auto shrink-0">{trailing}</span>}
      </a>
    );
  },
);
SidebarNavItem.displayName = 'SidebarNavItem';

export interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, ...props }, ref) => {
    const { collapsed, toggleCollapsed } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        aria-pressed={collapsed}
        className={cn(
          'hidden lg:inline-flex h-7 w-7 items-center justify-center rounded-md',
          'text-muted-foreground hover:text-foreground hover:bg-surface-hover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          'transition-colors duration-fast',
          className,
        )}
        {...props}
      >
        <ChevronLeft
          className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
    );
  },
);
SidebarToggle.displayName = 'SidebarToggle';

export interface SidebarMobileTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarMobileTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarMobileTriggerProps
>(({ className, children, ...props }, ref) => {
  const { openMobile } = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      onClick={openMobile}
      aria-label="Abrir menu"
      className={cn(
        'lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-lg',
        'text-muted-foreground hover:text-foreground hover:bg-surface-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'transition-colors duration-fast',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarMobileTrigger.displayName = 'SidebarMobileTrigger';
