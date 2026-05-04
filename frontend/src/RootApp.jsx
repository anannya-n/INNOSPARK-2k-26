import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './LandingPage';
import App from './App';

export default function RootApp() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!showDashboard ? (
        <motion.div
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
        >
          <LandingPage onLaunch={() => setShowDashboard(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <App />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
