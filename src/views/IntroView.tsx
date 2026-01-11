import { motion } from 'framer-motion';
import { colors, fonts, gradients } from '../constants/theme';

interface IntroViewProps {
  onEnterBook: () => void;
}

export function IntroView({ onEnterBook }: IntroViewProps) {
  return (
    <motion.section
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: gradients.darkRadialSubtle }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm tracking-[0.3em] uppercase mb-6"
          style={{ fontFamily: fonts.accent, color: colors.textMuted }}
        >
          An Interactive Experience
        </motion.p>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{ fontFamily: fonts.heading, color: colors.textLight }}
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
            style={{ color: colors.gold }}
          >
            of Solitude
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-lg italic mb-12"
          style={{ fontFamily: fonts.body, color: colors.textMuted }}
        >
          Gabriel Garcia Marquez
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          onClick={onEnterBook}
          className="px-8 py-4 rounded-lg cursor-pointer"
          style={{
            backgroundColor: colors.withAlpha(colors.gold, 0.2),
            border: `2px solid ${colors.gold}`,
          }}
          whileHover={{ backgroundColor: colors.withAlpha(colors.gold, 0.3), scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            className="flex items-center gap-3 text-lg"
            style={{ fontFamily: fonts.heading, color: colors.gold }}
          >
            <span className="text-2xl">📖</span>
            Open the Book
          </span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 text-sm max-w-md mx-auto"
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
        >
          Read through chapters. Explore the house. Speak with the dead.
        </motion.p>
      </motion.div>
    </motion.section>
  );
}
