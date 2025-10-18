import { motion } from 'framer-motion';

const Spinner = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-t-brand-blue border-white/20 rounded-full"
            />
            <p className="text-white/80 text-lg">{text}</p>
        </div>
    );
};

export default Spinner;
