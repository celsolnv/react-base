import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { HEXAGON_PATTERN_URL } from "./hexagon-pattern";

const LOADING_MESSAGES = [
  "Iniciando sistema...",
  "Validando segurança...",
  "Acessando frota blindada...",
  "Preparando ambiente...",
  "Carregando módulos...",
];

const LoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Message rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Progress simulation effect
  useEffect(() => {
    let animationFrameId: number;

    // Wrap initial reset in rAF to avoid synchronous setState warning
    const resetFrameId = requestAnimationFrame(() => {
      setProgress(0);
      setMessageIndex(0);

      const duration = 8000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const targetProgress = 90;
        // Calculate progress based on time
        const nextProgress = Math.min(
          (elapsed / duration) * targetProgress,
          targetProgress
        );

        setProgress(nextProgress);

        if (nextProgress < targetProgress) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(resetFrameId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      className="bg-background fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Radial gradient spotlight background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,hsl(var(--foreground)/0.06)_0%,transparent_60%),radial-gradient(ellipse_60%_40%_at_50%_50%,hsl(var(--foreground)/0.03)_0%,transparent_50%),hsl(var(--background))]" />

      {/* Hexagonal pattern texture - animated */}
      <motion.div
        className="absolute inset-0 bg-size-[56px_98px] opacity-[0.04]"
        style={{
          backgroundImage: `url("${HEXAGON_PATTERN_URL}")`,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Carbon fiber subtle overlay */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_1px,hsl(var(--foreground)/0.1)_1px,hsl(var(--foreground)/0.1)_2px)] bg-size-[4px_4px] opacity-[0.02]" />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-10"
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Shield icon with scale & fade in + breathing pulse */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glow effect behind shield */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--foreground)/0.2)_0%,transparent_70%)] blur-2xl"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Breathing pulse effect */}
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [1, 0.9, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="text-foreground h-20 w-20 md:h-24 md:w-24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <motion.path
                d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              <motion.path
                d="M9 12l2 2 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Brand typography with staggered animations */}
        <div className="flex flex-col items-center gap-4">
          <motion.h1
            className="text-foreground text-4xl font-semibold tracking-[0.25em] md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Nome do Sistema{" "}
            <span className="text-muted-foreground ml-3 font-light">
              Descrição do Sistema
            </span>
          </motion.h1>

          <motion.div
            className="via-foreground/50 h-px bg-linear-to-r from-transparent to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 160, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          />

          <motion.p
            className="text-foreground/70 text-sm font-light tracking-[0.5em] uppercase md:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            LOCADORA
          </motion.p>
        </div>

        {/* Premium progress bar section */}
        <motion.div
          className="mt-6 flex flex-col items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="relative w-56 md:w-64">
            <div className="bg-secondary/50 h-0.75 w-full overflow-hidden rounded-full">
              <motion.div
                className="relative h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--muted-foreground)/0.5)_0%,hsl(var(--foreground)/0.7)_50%,hsl(var(--foreground))_100%)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              >
                <div className="absolute top-1/2 right-0 -mr-4 h-8 w-8 -translate-y-1/2 bg-[radial-gradient(circle,hsl(var(--foreground)/0.5)_0%,transparent_70%)] blur-sm" />
              </motion.div>
            </div>

            <motion.span
              className="text-foreground/50 absolute top-1/2 -right-10 -translate-y-1/2 font-mono text-xs tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>

          <div className="flex h-6 items-center justify-center">
            <motion.p
              key={messageIndex}
              className="text-foreground/60 text-xs font-medium tracking-[0.2em] uppercase md:text-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </div>
        </motion.div>

        {/* System badge */}
        <motion.div
          className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <motion.div className="bg-success h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_4px_hsl(var(--success)/0.5)]" />
          <span className="text-foreground/50 text-xs font-medium tracking-wider">
            Sistema Interno de Gestão
          </span>
        </motion.div>
      </motion.div>

      {/* Corner accents */}
      <motion.div
        className="border-foreground/20 absolute top-8 left-8 h-12 w-12 border-t border-l"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      />
      <motion.div
        className="border-foreground/20 absolute right-8 bottom-8 h-12 w-12 border-r border-b"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      />
    </motion.div>
  );
};

export default LoadingScreen;
