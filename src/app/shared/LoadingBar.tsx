import { motion } from "framer-motion";

function ProgressBar({ progress }: { progress: number }) {
	return (
		<motion.div
			className="fixed top-0 left-0 h-1 bg-blue-500"
			initial={{ width: "0%" }}
			animate={{ width: `${progress}%` }}
			transition={{ ease: "easeOut", duration: 0.5 }}
		/>
	);
}

export default ProgressBar;
