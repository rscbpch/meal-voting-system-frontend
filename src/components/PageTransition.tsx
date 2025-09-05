import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1], // Custom cubic-bezier for smoother motion
        opacity: { duration: 0.4 },
        y: { duration: 0.5 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;