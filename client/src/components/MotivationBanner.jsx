import { motion } from 'framer-motion';

const MotivationBanner = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 p-4 text-white"
  >
    <p className="font-medium">{message}</p>
  </motion.div>
);

export default MotivationBanner;
