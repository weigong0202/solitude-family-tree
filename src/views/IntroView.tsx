import { motion } from 'framer-motion';
import { colors, fonts, gradients } from '../constants/theme';
import { YellowButterflies, GoldenDust } from '../components/MagicalEffects';

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
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: gradients.darkRadialSubtle }}
    >
      {/* Magical Effects */}
      <GoldenDust count={30} active={true} />
      <YellowButterflies count={5} active={true} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center relative z-10"
      >
        {/* Title - Hero */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{ fontFamily: fonts.heading, color: colors.textLight }}
        >
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 1 }}
            className="block"
          >
            One Hundred Years
          </motion.span>
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.6, duration: 1 }}
            className="block text-4xl md:text-5xl lg:text-6xl"
            style={{ color: colors.gold }}
          >
            of Solitude
          </motion.span>
        </h1>

        {/* Author - Secondary */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl md:text-2xl italic mb-8"
          style={{ fontFamily: fonts.body, color: colors.textMuted }}
        >
          Gabriel García Márquez
        </motion.p>

        {/* Tagline - Supporting (before button) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-base md:text-lg max-w-2xl mx-auto mb-10"
          style={{ fontFamily: fonts.body, color: colors.textMuted }}
        >
          Seven generations. One hundred years. A family destined to repeat itself.
        </motion.p>

        {/* Button - CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          onClick={onEnterBook}
          className="enter-macondo-btn group px-8 py-4 rounded-lg cursor-pointer transition-all duration-300 ease-out"
          style={{
            backgroundColor: colors.withAlpha(colors.gold, 0.15),
            border: `2px solid ${colors.gold}`,
          }}
        >
          <span
            className="flex items-center gap-3 text-lg"
            style={{ fontFamily: fonts.heading, color: colors.gold }}
          >
            <span className="text-2xl inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
              🦋
            </span>
            Enter Macondo
          </span>
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
