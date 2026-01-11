import { motion } from 'framer-motion';

interface HeroSectionProps {
  onBegin: () => void;
}

export function HeroSection({ onBegin }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B58900' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center z-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm tracking-[0.2em] uppercase mb-4"
          style={{
            fontFamily: "var(--font-mono)",
            color: '#657B83',
            textShadow: '1px 1px 0 rgba(181, 137, 0, 0.1)'
          }}
        >
          ✦ An Interactive Experience ✦
        </motion.p>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{
            fontFamily: "var(--font-serif)",
            color: '#586E75',
          }}
        >
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="block"
          >
            One Hundred Years
          </motion.span>
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.8, duration: 1 }}
            className="block text-4xl md:text-5xl lg:text-6xl"
            style={{ color: '#B58900' }}
          >
            of Solitude
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-lg md:text-xl italic max-w-xl mx-auto mb-8"
          style={{
            fontFamily: "var(--font-serif)",
            color: '#657B83',
          }}
        >
          Gabriel García Márquez
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="max-w-md mx-auto text-center mb-12"
        >
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "var(--font-serif)",
              color: '#586E75',
            }}
          >
            Follow the Buendía family through seven generations of love, war,
            magic, and solitude in the mythical town of Macondo.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <button
          onClick={onBegin}
          className="flex flex-col items-center gap-3 group cursor-pointer"
        >
          <span
            className="text-xs tracking-widest uppercase group-hover:text-[#B58900] transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              color: '#657B83',
            }}
          >
            Begin the Journey
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-[#B58900]/50 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#B58900]"
            />
          </motion.div>
        </button>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute top-20 right-10 w-64 h-64"
        style={{
          background: 'radial-gradient(circle, #B58900 0%, transparent 70%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 1.3, duration: 2 }}
        className="absolute bottom-20 left-10 w-48 h-48"
        style={{
          background: 'radial-gradient(circle, #268BD2 0%, transparent 70%)',
        }}
      />
    </section>
  );
}
