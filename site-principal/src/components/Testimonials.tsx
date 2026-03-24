"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { WordReveal } from "./WordReveal";
import { spring, revealVariants, staggerParent, viewport } from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";

/* ── Neural Network Node Generator ── */
function generateNodes(count: number, seed: number) {
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + seed;
    const radius = 20 + ((i * 17 + seed * 7) % 30);
    nodes.push({
      x: 50 + Math.cos(angle) * radius + ((i * 13 + seed * 3) % 10) - 5,
      y: 50 + Math.sin(angle) * radius + ((i * 11 + seed * 5) % 10) - 5,
    });
  }
  return nodes;
}

/* ── Neural Network SVG Background ── */
function NeuralNetwork({ chaos, side }: { chaos: number; side: "before" | "after" }) {
  const nodes = useMemo(() => generateNodes(12, side === "before" ? 1 : 5), [side]);

  const color = side === "before" ? "rgba(239,68,68," : "rgba(0,191,255,";
  const jitter = chaos * 3;

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Connections */}
      {nodes.map((node, i) =>
        nodes.slice(i + 1).filter((_, j) => (i + j) % 3 === 0).map((target, j) => (
          <line
            key={`${i}-${j}`}
            x1={node.x + (side === "before" ? Math.sin(i * chaos * 0.5) * jitter : 0)}
            y1={node.y + (side === "before" ? Math.cos(i * chaos * 0.3) * jitter : 0)}
            x2={target.x + (side === "before" ? Math.sin(j * chaos * 0.7) * jitter : 0)}
            y2={target.y + (side === "before" ? Math.cos(j * chaos * 0.4) * jitter : 0)}
            stroke={`${color}${side === "before" ? 0.08 + chaos * 0.04 : 0.12 - chaos * 0.02})`}
            strokeWidth={side === "before" ? 0.3 + chaos * 0.15 : 0.2}
          />
        ))
      )}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.x + (side === "before" ? Math.sin(i * chaos * 0.6) * jitter : 0)}
          cy={node.y + (side === "before" ? Math.cos(i * chaos * 0.4) * jitter : 0)}
          r={side === "before" ? 0.8 + chaos * 0.3 : 1}
          fill={`${color}${side === "before" ? 0.15 + chaos * 0.1 : 0.25 - chaos * 0.05})`}
        />
      ))}
    </svg>
  );
}

/* ── Interactive Before/After Slider — Neural Engineering ── */
function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(65);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Derived values based on slider position
  const beforeHours = 72; // 3 days = 72h
  const afterHours = 4;
  const economyHours = Math.round(((sliderPos / 100) * (beforeHours - afterHours)));
  const chaosLevel = sliderPos / 100; // 0 = all green, 1 = all red

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden select-none touch-none cursor-col-resize border border-white/[0.06]"
      style={{ aspectRatio: "16/7" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* ═══ DEPOIS (background - full width) ═══ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071520] via-[#0a1e30] to-[#0d2a3d]">
        <NeuralNetwork chaos={chaosLevel} side="after" />
        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10">
          <div className="max-w-sm ml-auto mr-6 sm:mr-12 lg:mr-20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#00BFFF] animate-pulse" />
              <span className="text-[10px] font-bold text-[#00BFFF] uppercase tracking-widest">Sistema ativo</span>
            </div>
            <div className="text-3xl sm:text-5xl font-bold font-display text-white mb-1">4 horas</div>
            <p className="text-sm sm:text-base text-[#00BFFF]/70 mb-4">Automatizado. Zero erro. Relatório pronto.</p>

            {/* Progress bar — stable, clean */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Conformidade</span>
                <span className="text-[#00BFFF] font-bold">100%</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#2546BD] to-[#00BFFF]" style={{ width: "100%" }} />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Tempo de execução</span>
                <span className="text-green-400 font-bold">5.5%</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-400" style={{ width: "5.5%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ANTES (overlay - clipped) ═══ */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#1f0f0f] to-[#180808]"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <NeuralNetwork chaos={chaosLevel} side="before" />
        {/* Scan lines for chaos effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(239,68,68,0.3) 0px, transparent 1px, transparent 3px)",
            backgroundSize: "100% 3px",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10">
          <div className="max-w-sm ml-6 sm:ml-12 lg:ml-20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation: "pulse 0.8s ease-in-out infinite" }} />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Processo manual</span>
            </div>
            <div className="text-3xl sm:text-5xl font-bold font-display text-white mb-1">3 dias</div>
            <p className="text-sm sm:text-base text-red-400/70 mb-4">Planilhas. Retrabalho. Erros frequentes.</p>

            {/* Progress bars — unstable, glitchy */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Risco de fraude</span>
                <span className="text-red-400 font-bold">Alto</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${78 + chaosLevel * 12}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Tempo consumido</span>
                <span className="text-red-400 font-bold">100%</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-red-500" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SLIDER HANDLE — Régua de Tempo ═══ */}
      <motion.div
        className="absolute top-0 bottom-0 z-20 flex items-center"
        style={{ left: `${sliderPos}%`, x: "-50%" }}
        whileTap={{ scale: 1.05 }}
      >
        {/* Vertical line with glow */}
        <div
          className="w-[2px] h-full"
          style={{
            background: "linear-gradient(to bottom, transparent, #00BFFF, transparent)",
            boxShadow: isDragging
              ? "0 0 20px rgba(0,191,255,0.5), 0 0 40px rgba(0,191,255,0.2)"
              : "0 0 8px rgba(0,191,255,0.3)",
          }}
        />

        {/* Handle knob with economy counter */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
          animate={{
            scale: isDragging ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Counter pill */}
          <div
            className="bg-[#0A1628] border border-[#00BFFF]/40 rounded-full px-3 py-1 whitespace-nowrap"
            style={{
              boxShadow: "0 0 15px rgba(0,191,255,0.25)",
            }}
          >
            <span className="text-[10px] font-bold text-[#00BFFF]">
              Economia: {economyHours}h
            </span>
          </div>

          {/* Drag handle */}
          <div
            className="w-11 h-11 rounded-full bg-[#0A1628] border-2 border-[#00BFFF]/60 flex items-center justify-center"
            style={{
              boxShadow: isDragging
                ? "0 0 24px rgba(0,191,255,0.4), inset 0 0 8px rgba(0,191,255,0.1)"
                : "0 0 12px rgba(0,191,255,0.2)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#00BFFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8l4 4-4 4" />
              <path d="M6 8l-4 4 4 4" />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-3 left-3 z-10 bg-red-500/20 backdrop-blur-sm text-red-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-500/20">
        Antes
      </div>
      <div className="absolute top-3 right-3 z-10 bg-[#00BFFF]/15 backdrop-blur-sm text-[#00BFFF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#00BFFF]/20">
        Depois
      </div>

      {/* Hint — fades after interaction */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md text-white/80 text-[10px] font-medium px-3 py-1.5 rounded-full pointer-events-none transition-opacity duration-500"
        style={{ opacity: hasInteracted ? 0 : 0.8 }}
      >
        Arraste para comparar
      </div>
    </div>
  );
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="text-4xl font-bold font-display text-primary"
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={spring.smooth}
    >
      {displayValue}
      {suffix}
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section id="cases" className="bg-bg-alt relative z-10 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerParent(0.1)}
        >
          <motion.div
            className="inline-flex items-center bg-primary/8 text-primary font-semibold border border-secondary/20 rounded-pill text-sm px-4 py-1.5 tracking-wide mb-6"
            variants={revealVariants("up")}
          >
            Prova
          </motion.div>
          <WordReveal
            text="Fatos. Não promessas."
            className="text-4xl lg:text-5xl font-bold text-text text-center leading-tight mb-4"
          />
          <motion.p
            className="text-text-muted text-lg text-center max-w-xl mx-auto mt-4"
            variants={revealVariants("up")}
          >
            Estes são resultados reais de empresas reais. Pergunte para elas.
          </motion.p>
        </motion.div>

        {/* Case principal — slider interativo neural */}
        <motion.div
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={staggerParent(0.12)}
        >
          <motion.div
            className="solution-card bg-white border border-card-border rounded-card p-6 sm:p-8"
            variants={revealVariants("scale")}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider block">Case em destaque | Setor Financeiro</span>
                <span className="text-lg font-bold text-text">Fechamento financeiro mensal</span>
              </div>
            </div>

            {/* Before/After Neural Slider */}
            <BeforeAfterSlider />

            <p className="text-text-muted leading-relaxed mt-6">
              Automação completa do fluxo de aprovações, conciliação bancária e geração de relatórios. Eliminamos 90% do trabalho manual.
            </p>

            {/* Testimonial + micro-CTA */}
            <div className="pt-4 mt-4 border-t border-card-border space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/logo-cliente-4.webp" alt="Logo de holding financeira, cliente Gradios" width={32} height={32} className="w-8 h-8 rounded-full object-cover bg-white border border-card-border flex-shrink-0" />
                <div>
                  <span className="text-sm text-text font-semibold block">CFO de holding com 3 empresas no setor financeiro, Londrina/PR</span>
                  <span className="text-xs text-text-muted italic">&ldquo;O fechamento que levava 3 dias agora termina antes do almoço.&rdquo;</span>
                </div>
              </div>

              <Link
                href="/diagnostico"
                className="group flex items-center gap-3 bg-primary/[0.04] hover:bg-primary/[0.08] border border-primary/15 hover:border-primary/30 rounded-xl px-4 py-3 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text">Seu fechamento financeiro também demora?</p>
                  <p className="text-xs text-primary font-medium">Descubra como reduzir &rarr;</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Cards secundários */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={staggerParent(0.12)}
        >
          <motion.div
            className="solution-card bg-white border border-card-border rounded-card p-6 flex flex-col justify-between"
            variants={revealVariants("left")}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-text-muted line-through">1x volume</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="text-xs font-bold text-green-600">3x volume</span>
              </div>
              <div className="text-3xl font-bold font-display text-text mb-2">3x</div>
              <p className="text-sm font-bold text-text mb-2">Volume sem contratar</p>
              <p className="text-sm text-text-muted">Empresa de serviços B2B com 12 colaboradores triplicou a capacidade de atendimento em 6 semanas com automação de processos internos.</p>
            </div>
            <div className="pt-4 mt-4 border-t border-card-border flex items-center gap-2">
              <Image src="/logo-cliente-5.webp" alt="Logo de consultoria B2B, cliente Gradios" width={24} height={24} className="w-6 h-6 rounded-full object-cover bg-white border border-card-border flex-shrink-0" />
              <span className="text-xs text-text-muted font-medium">Diretor de Operações, consultoria B2B</span>
            </div>
          </motion.div>

          <motion.div
            className="solution-card bg-white border border-card-border rounded-card p-6 flex flex-col justify-between"
            variants={revealVariants("left")}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-text-muted line-through">40h/mês</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="text-xs font-bold text-green-600">2h/mês</span>
              </div>
              <div className="text-3xl font-bold font-display text-text mb-2">95%</div>
              <p className="text-sm font-bold text-text mb-2">Menos tempo em emissão de notas</p>
              <p className="text-sm text-text-muted">Processo de emissão de notas fiscais que consumia uma semana por mês passou a rodar automaticamente com validação inteligente.</p>
            </div>
            <div className="pt-4 mt-4 border-t border-card-border flex items-center gap-2">
              <Image src="/logo-cliente-6.webp" alt="Logo de distribuidora, cliente Gradios" width={24} height={24} className="w-6 h-6 rounded-full object-cover bg-white border border-card-border flex-shrink-0" />
              <span className="text-xs text-text-muted font-medium">Gestor Financeiro, distribuidora</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Métricas rápidas */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-card-border pt-12">
          {[
            { value: 70, suffix: "%", label: "Redução de retrabalho" },
            { value: 3, suffix: "x", label: "Escala sem contratar" },
            { value: 2, suffix: " sem", label: "Primeira entrega" },
            { value: 12, suffix: "/12", label: "Clientes renovaram" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-text-muted mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
          <p className="text-xs text-text-muted text-center mt-4 col-span-full">
            *Média dos nossos clientes nos primeiros 90 dias de operação
          </p>
        </div>
      </div>
    </section>
  );
}
