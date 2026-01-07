'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] relative overflow-hidden">
            <div className="neo-blur top-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-500/10" />
            <div className="neo-blur bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-500/10" />

            <div className="relative z-10 text-center">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-2xl mb-8 mx-auto flex items-center justify-center"
                >
                    <Loader2 className="text-cyan-400" size={32} />
                </motion.div>

                <h2 className="text-xl font-black text-white uppercase tracking-[0.5em] animate-pulse">
                    Synchronizing <span className="text-cyan-400">Net</span>
                </h2>
                <p className="mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Initializing neural uplink...
                </p>
            </div>

            <div className="absolute bottom-10 left-10 opacity-5">
                <p className="font-mono text-[8px] text-white">REWIRE_V2.0_INIT_SEQUENCE_ONLINE</p>
            </div>
        </div>
    );
}
